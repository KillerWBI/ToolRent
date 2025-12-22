"use client";

import css from "./FeedbackFormModal.module.css";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface FeedbackFormModalProps {
  onCloseModal: () => void;
  //   onLoginBtn: () => void;
  //   onRegisterBtn: () => void;
}

export const FeedbackFormModal = ({ onCloseModal }: FeedbackFormModalProps) => {
  const [rating, setRating] = useState<number>(0); // выбранный
  const [hoverRating, setHoverRating] = useState<number>(0); // hover

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
        <h2 className={css.title}>Залишити відгук на товар</h2>
        <form action="">
          <div className={css.formGroup}>
            <label htmlFor="name">Ім'я</label>
            <input id="name" type="text" name="name" className={css.input} />
          </div>
          <div className={css.formGroup}>
            <label htmlFor="feedback">Відгук</label>
            <input
              id="feedback"
              type="text"
              name="feedback"
              className={css.input}
            />
          </div>
          <div className={css.formGroup}>
            <p>Оцінка</p>
            <div className={css.rating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={
                    star <= (hoverRating || rating) ? css.starActive : css.star
                  }
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`Rate ${star}`}>
                  ★
                </button>
              ))}
            </div>
          </div>
          <button type="button">Надіслати</button>
        </form>
      </div>
    </div>,
    document.body
  );
};
