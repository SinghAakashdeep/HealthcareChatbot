"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "app/types/auth";
import { apiFetch, ApiError } from "app/lib/api";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    apiFetch<User>("/auth/me")
      .then((u) => {
        if (mounted) setUser(u);
      })
      .catch((err) => {
        if (!mounted) return;

        if (err instanceof ApiError && err.status === 401) {
          setUser(null);
        }
        // 403 or anything else → keep existing user
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
