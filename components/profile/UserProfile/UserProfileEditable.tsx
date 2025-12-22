"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import type { PublicUser } from "@/lib/api/users";
import styles from "./UserProfile.module.css";
import editStyles from "./UserProfileEditable.module.css";

type Props = {
  user: PublicUser;
  isOwnProfile?: boolean;
};

export default function UserProfileEditable({
  user,
  isOwnProfile = false,
}: Props) {
  const letter = (user?.name?.trim()?.[0] || "?").toUpperCase();
  const hasAvatar = Boolean(user.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { fetchUser } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    // Валідація розміру файлу (макс 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("❌ Файл занадто великий (максимум 5MB)");
      return;
    }

    // Валідація типу файлу
    if (!file.type.startsWith("image/")) {
      toast.error("❌ Будь ласка, виберіть зображення");
      return;
    }

    setIsLoading(true);
    const uploadToastId = toast.loading("📤 Завантаження аватара...");

    try {
      // Формуємо FormData для відправки файлу
      const formData = new FormData();
      formData.append("avatar", file);

      // Відправляємо на бекенд
      const response = await fetch("/api/users/me/avatar", {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Не вдалося оновити аватар");
      }

      toast.dismiss(uploadToastId);
      toast.success("✅ Аватар успішно оновлено!");

      // Перезавантажуємо дані в стора для оновлення Header
      await fetchUser();

      setIsLoading(false);

      // Перезавантажуємо сторінку для оновлення аватара в профілі
      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Помилка при завантаженні аватара";
      toast.dismiss(uploadToastId);
      toast.error(`❌ ${message}`);
      setIsLoading(false);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={editStyles.wrapper}>
      <div
        className={`${styles.wrap} ${isOwnProfile ? editStyles.editable : ""}`}
      >
        <div className={editStyles.avatarContainer}>
          {hasAvatar ? (
            <Image
              className={styles.avatarImg}
              src={user.avatarUrl as string}
              alt={user.name}
              width={96}
              height={96}
            />
          ) : (
            <div
              className={styles.avatarLetter}
              aria-label={`Аватар ${user.name}`}
            >
              {letter}
            </div>
          )}

          {isOwnProfile && (
            <button
              type="button"
              className={editStyles.changeButton}
              onClick={(e) => {
                e.preventDefault();
                fileInputRef.current?.click();
              }}
              disabled={isLoading}
              aria-label="Змінити аватар"
            >
              {isLoading ? "Завантаження..." : "Змінити"}
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={editStyles.fileInput}
            disabled={isLoading}
          />
        </div>

        <h1 className={styles.name}>{user.name}</h1>
      </div>
    </div>
  );
}
