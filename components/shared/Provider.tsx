// app/providers.tsx
"use client";

import { useAuth } from "@/store/auth.store";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  const fetchUser = useAuth((s) => s.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <Toaster position="top-right" containerStyle={{ zIndex: 99999 }} />
      {children}
    </>
  );
}
