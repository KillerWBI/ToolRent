"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ConfirmationModal.module.css";

export type ConfirmationModalProps = {
  title: string;
  confirmButtonText: string;
  cancelButtonText: string;
  variant: "danger" | "default";
  isLoading?: boolean;
  error?: string;
  onConfirm: () => Promise<void>;
};

export default function ConfirmationModal({
  title,
  confirmButtonText,
  cancelButtonText,
  variant,
  isLoading = false,
  error,
  onConfirm,
}: ConfirmationModalProps) {
  const router = useRouter();
  const [localLoading, setLocalLoading] = useState(false);

  const handleCancel = () => router.back();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCancel();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleConfirm = async () => {
    if (isLoading || localLoading) return;
    setLocalLoading(true);
    try {
      await onConfirm();
      router.back();
    } finally {
      setLocalLoading(false);
    }
  };

  return createPortal(
    <div className={styles.backdrop} onClick={handleCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={handleCancel}>
          <svg className={styles.closeIcon}>
            <use href="/svg/sprite.svg#close" />
          </svg>
        </button>

        <h2 className={styles.title}>{title}</h2>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button
            onClick={handleCancel}
            disabled={isLoading || localLoading}
            className={styles.cancel}
          >
            {cancelButtonText}
          </button>

          <button
            onClick={handleConfirm}
            disabled={isLoading || localLoading}
            className={variant === "danger" ? styles.delete : styles.confirm}
          >
            {isLoading || localLoading ? "Завантаження..." : confirmButtonText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
