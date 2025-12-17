"use client";

import { useAuth } from "@/store/auth.store";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // или loader
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
