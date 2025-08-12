"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin");
    }
  }, [user, loading, router]);

  if (loading || (!user && typeof window !== "undefined")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-gray-500">Đang kiểm tra đăng nhập...</span>
      </div>
    );
  }

  return <>{children}</>;
}
