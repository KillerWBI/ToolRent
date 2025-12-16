"use client";

import { useModal } from "@/hooks/useModal";
import styles from "./ConfirmationModal.module.css";

interface ConfirmationModalProps {
    open: boolean;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    error?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmationModal({
    open,
    message = "Ви впевнені, що хочете видалити оголошення?",
    confirmLabel = "Видалити",
    cancelLabel = "Скасувати",
    isLoading = false,
    error,
    onConfirm,
    onCancel,
}: ConfirmationModalProps) {
    const { handleBackdropClick } = useModal({
        isOpen: open,
        onClose: onCancel,
    });

    if (!open) return null;

    return (
        <div
            className={styles.backdrop}
            role="dialog"
            aria-modal="true"
            onClick={handleBackdropClick}
        >
            <div className={styles.dialog}>
                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={onCancel}
                    aria-label="Закрити"
                    disabled={isLoading}
                >
                    <svg className={styles.closeIcon}>
                        <use href="/svg/sprite.svg#close" />
                    </svg>
                </button>

                <p className={styles.message}>{message}</p>
                {error ? <p className={styles.error}>{error}</p> : null}
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={`${styles.button} ${styles.cancel}`}
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className={`${styles.button} ${styles.confirm}`}
                        onClick={onConfirm}
                        disabled={isLoading}
                        aria-busy={isLoading}
                    >
                        {isLoading ? "Видаляємо..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
