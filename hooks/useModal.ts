"use client";

import { useEffect, useCallback } from "react";

interface UseModalOptions {
    isOpen: boolean;
    onClose: () => void;
}

export function useModal({ isOpen, onClose }: UseModalOptions) {
    // Закрытие по ESC
    const handleEscape = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        },
        [isOpen, onClose]
    );

    // Закрытие по клику на backdrop
    const handleBackdropClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        },
        [onClose]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            // Блокируем скролл body когда модалка открыта
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleEscape]);

    return {
        handleBackdropClick,
    };
}
