"use client";

import { useAuth } from "@/store/auth.store";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, fetchUser } = useAuth();


  useEffect(() => {
    // попробуем получить пользователя, если ещё не загружен
    if (!user && !loading) {
      fetchUser();
    }

  }, [user, loading, fetchUser]);



  return <>{children}</>;
}
