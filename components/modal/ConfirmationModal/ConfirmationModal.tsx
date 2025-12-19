"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ConfirmationModal.module.css";
import { ConfirmVariant } from "@/types/confirm";

type ConfirmationModalProps = {
  title: string;
  confirmButtonText: string;
  cancelButtonText: string;
  variant?: ConfirmVariant;
  open: boolean;
  // message: string;
  isLoading?: boolean;
  error?: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
};

export default function ConfirmationModal({
  open,
  title,
  // message,
  variant = "default",
  isLoading = false,
  error,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  if (!open) return null;

  const handleConfirm = async () => {
    if (isLoading || localLoading) return;
    setLocalLoading(true);
    try {
      await onConfirm();
    } finally {
      setLocalLoading(false);
    }
  };

  //   return createPortal(
  //     <div className={styles.backdrop} onClick={onCancel}>
  //       <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
  //         <button className={styles.close} onClick={onCancel}>
  //           <svg className={styles.closeIcon}>
  //             <use href="/svg/sprite.svg#close" />
  //           </svg>
  //         </button>

  //         <h2 className={styles.title}>{title}</h2>

  //         {error && <p className={styles.error}>{error}</p>}

  //         <div className={styles.actions}>
  //           <button
  //             onClick={onCancel}
  //             disabled={isLoading || localLoading}
  //             className={styles.cancel}
  //           >
  //             Відмінити
  //           </button>

  //           <button
  //             onClick={handleConfirm}
  //             disabled={isLoading || localLoading}
  //             className={styles.delete}
  //           >
  //             {isLoading || localLoading ? "Завантаження..." : confirmButtonText}
  //           </button>
  //         </div>
  //       </div>
  //     </div>,
  //     document.body
  //   );
  // }
  return createPortal(
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onCancel}>
          <svg className={styles.closeIcon}>
            <use href="/svg/sprite.svg#close" />
          </svg>
        </button>

        {title && <h2 className={styles.title}>{title}</h2>}

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button
            onClick={onCancel}
            disabled={isLoading || localLoading}
            className={styles.cancel}
          >
            {cancelButtonText}
          </button>

          <button
            onClick={handleConfirm}
            disabled={isLoading || localLoading}
            className={styles[variant]}
          >
            {isLoading || localLoading ? "Завантаження..." : confirmButtonText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
