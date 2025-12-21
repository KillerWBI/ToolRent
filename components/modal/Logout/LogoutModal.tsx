"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  // создаём контейнер для portal
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  // закрытие при Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose} // закрытие при клике на фон
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // клик внутри не закрывает
      >
        {children}
        <div className="modal-footer">
          <button
            className="modal-close-btn"
            onClick={onClose}
          >
            Нет
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
};
