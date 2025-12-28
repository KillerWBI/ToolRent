"use client";

import css from "./AuthRequiredModal.module.css";
import { createPortal } from "react-dom";
import { useEffect } from "react";

interface AuthRequiredModalProps {
  onCloseModal: () => void;
  onLoginBtn: () => void;
  onRegisterBtn: () => void;
  description?: string;
}

export const AuthRequiredModal = ({
  description,
  onCloseModal,
  onLoginBtn,
  onRegisterBtn,
}: AuthRequiredModalProps) => {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCloseModal();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onCloseModal]);

  return createPortal(
    <div onClick={handleBackdropClick} className={css.backdrop}>
      <div onClick={(e) => e.stopPropagation()} className={css.modal}>
        <button className={css.close} onClick={onCloseModal}>
          <svg className={css.closeIcon}>
            <use className={css.closeIconSwg} href="/svg/sprite.svg#close" />
          </svg>
        </button>
        <h2 className={css.title}>Спочатку авторизуйтесь</h2>
        <p className={css.description}>
          {description}
        </p>
        <div className={css.btnsWrap}>
          <button onClick={onLoginBtn} className={css.loginBtn} type="button">
            Вхід
          </button>
          <button
            onClick={onRegisterBtn}
            className={css.registerBtn}
            type="button">
            Реєстрація
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
