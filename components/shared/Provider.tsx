"use client";

import { useAuth } from "@/store/auth.store";
import { useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
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
      <Toaster
        position="top-center"
        containerStyle={{ zIndex: 99999 }}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: "#e7cdf4",
            color: "#000f",
            border: "2px solid #8808cc",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            iconTheme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
      {children}
    </>
  );
}
