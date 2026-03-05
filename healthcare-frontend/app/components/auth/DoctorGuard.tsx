"use client";

import { useAuth } from "app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DoctorGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "doctor") {
      router.replace("/patient");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "doctor") return null;

  return <>{children}</>;
}
