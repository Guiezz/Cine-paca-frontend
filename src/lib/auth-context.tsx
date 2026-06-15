"use client";

import { createContext, useContext, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clientApi } from "@/lib/api-client";
import type { AdminProfile } from "@/types/api";

type AuthContextType = {
  admin: AdminProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "cinepaca_admin_token";

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function storeToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function applyToken(token: string | null) {
  if (token) {
    clientApi.setDefaultHeaders({ Authorization: `Bearer ${token}` });
  } else {
    clientApi.clearDefaultHeaders();
  }
}

function useHasToken() {
  const [hasToken] = useState(() => !!getStoredToken());
  return hasToken;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hasToken = useHasToken();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(hasToken);
  const router = useRouter();

  useEffect(() => {
    if (!hasToken) return;
    const token = getStoredToken()!;
    applyToken(token);
    clientApi.get<{ admin: AdminProfile }>("/api/auth/me").then((res) => {
      if (res.ok) {
        setAdmin(res.data.admin);
      } else {
        storeToken(null);
        applyToken(null);
      }
    }).finally(() => setIsLoading(false));
  }, [hasToken]);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    const res = await clientApi.post<{
      admin: AdminProfile;
      access_token: string;
      expires_in: number;
      token_type: string;
    }>("/api/auth/login", { email, password });
    if (!res.ok) {
      return res.error;
    }
    const { access_token, admin: adminData } = res.data;
    storeToken(access_token);
    applyToken(access_token);
    setAdmin(adminData);
    return null;
  }, []);

  const logout = useCallback(() => {
    storeToken(null);
    applyToken(null);
    setAdmin(null);
    router.push("/admin/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ admin, isLoading, isAuthenticated: !!admin, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
