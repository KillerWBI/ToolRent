// app/(private routes)/profile/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import useAuth from "@/hooks/useAuth";
import Loader from "@/components/ui/Loader/Loader";

export default function MyProfilePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // якщо ще немає інформації про юзера — нічого не робимо
    if (!user && !isAuthenticated) return;

    // якщо не авторизований → на логін
    if (!isAuthenticated) {
      router.replace("/auth/login?redirect=/profile");
      return;
    }

    // дістаємо id користувача (залежить від того, як лежить у store)
    const userId = (user as any)?.id || (user as any)?._id;

    if (userId) {
      // редірект на публічний профіль /profile/[userId]
      router.replace(`/profile/${userId}`);
    }
  }, [isAuthenticated, user, router]);

  // Поки вирішуємо, куди редіректити — показуємо лоадер
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Loader />
    </div>
  );
}
