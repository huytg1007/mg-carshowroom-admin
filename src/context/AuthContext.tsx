"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/interfaces/userInterface";
import { AuthService } from "@/services/authService";

interface AuthContextProps {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  // Start with null, then load from localStorage in useEffect
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading] = useState<boolean>(false);

  // Load stored data only in the browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("access_token");
      const storedRefreshToken = localStorage.getItem("refresh_token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await AuthService.login({ username, password });
      if (!response.success)
        throw new Error(response.message || "Login failed");

      const userInfo = response.data?.user ?? null;
      const accessToken = response.data?.accessToken || "";
      const refreshTok = response.data?.refreshToken || "";

      setUser(userInfo);
      setToken(accessToken);
      setRefreshToken(refreshTok);

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userInfo));
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshTok);
        // Set cookie for SSR/middleware
        document.cookie = `access_token=${accessToken}; path=/;`;
      }

      // Navigate to home after login
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      // Remove cookie for SSR/middleware
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    // Optionally: redirect to login page
    router.push("/signin");
  };

  const refreshAccessToken = async () => {
    try {
      await AuthService.refreshToken();
    } catch (error) {
      console.error("Refresh token error:", error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        login,
        logout,
        refreshAccessToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
