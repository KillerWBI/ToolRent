"use client";

import { useAuth } from "@/store/auth.store";
import { useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const fetchUser = useAuth((s) => s.fetchUser);
  const loading = useAuth((s) => s.loading);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const id = setTimeout(() => {
      fetchUser();
    }, 0);

    return () => clearTimeout(id);
  }, [fetchUser]);

  return (
    <>
      <Toaster position="top-right" containerStyle={{ zIndex: 99999 }} />
      {children}
    </>
  );
}
