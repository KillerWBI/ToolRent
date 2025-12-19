"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import styles from "./ConfirmationModal.module.css";

type Variant = "default" | "delete";

type ConfirmationModalProps = {
  title: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => Promise<void>;
  variant?: Variant;
};

export default function ConfirmationModal({
  title,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  variant = "default",
}: ConfirmationModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => router.back(); // 🔑 закриття через parallel route

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      router.back(); // Закриваємо після успішного запиту
    } catch (error) {
      // console.error("Помилка підтвердження:", error);
      // Тут можна інтегрувати push-повідомлення (наприклад, toast)
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className={styles.backdrop} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={closeModal}>
          <svg className={styles.closeIcon}>
            <use href="/svg/sprite.svg#close" />
          </svg>
        </button>

        <h2 className={styles.title}>{title}</h2>

        <div className={styles.actions}>
          <button
            onClick={closeModal}
            disabled={isLoading}
            className={styles.cancel}
          >
            {cancelButtonText}
          </button>

          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={styles[variant]}
          >
            {isLoading ? "Завантаження..." : confirmButtonText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
