"use client";

import css from "./FeedbackFormModal.module.css";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFeedback } from "@/lib/api/feedbacks";

interface FeedbackFormModalProps {
  onCloseModal: () => void;
  toolId: string;
  //   onLoginBtn: () => void;
  //   onRegisterBtn: () => void;
}

export const FeedbackFormModal = ({
  onCloseModal,
  toolId,
}: FeedbackFormModalProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["feedbacks"],
    mutationFn: createFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["feedbacks"],
      });
      console.log("FEEDBACK CREATED");
      onCloseModal();
    },
    onError: (error) => {
      console.error("CREATE FEEDBACK ERROR:", error);
    },
  });

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCloseModal();
    }
  };

  const handleSubmit = (formData: FormData) => {
    const rate = Number(formData.get("rate"));
    const description = String(formData.get("feedback") || "").trim();
    const values = { toolId, rate, description };
    mutate(values);
    console.log(values);
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
        <form className={css.form} action={handleSubmit}>
          <div className={css.formGroup}>
            <label className={css.label} htmlFor="name">
              Ім'я
            </label>
            <input
              id="name"
              type="text"
              name="name"
              className={css.input}
              placeholder="Ваше ім’я"
            />
          </div>
          <div className={css.formGroup}>
            <label className={css.label} htmlFor="feedback">
              Відгук
            </label>
            <textarea
              id="feedback"
              name="feedback"
              className={css.text}
              placeholder="Ваш відгук"
            />
          </div>
          <div className={css.formGroup}>
            <label className={css.label} htmlFor="rating">
              Оцінка
            </label>
            <input
              className={css.input}
              type="hidden"
              name="rate"
              value={rating}
            />
            <div className={css.rating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  id="rating"
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
          <button
            className={css.submitBtn}
            type="submit"
            disabled={!rating || isPending}>
            Надіслати
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};
