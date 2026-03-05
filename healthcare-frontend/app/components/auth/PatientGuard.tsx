"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "app/context/AuthContext";

export default function PatientGuard({
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

    if (user.role !== "patient") {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "patient") {
    return null;
  }

  return <>{children}</>;
}
