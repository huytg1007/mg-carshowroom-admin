"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const checked = useRef(false);

  useEffect(() => {
    // Chỉ redirect khi đã xác định xong trạng thái đăng nhập
    if (!loading && !user) {
      checked.current = true;
      router.replace("/signin");
    }
  }, [user, loading, router]);

  // Chỉ render children khi đã xác thực là có user
  if (loading || (!user && !checked.current)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-gray-500">Đang kiểm tra đăng nhập...</span>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
