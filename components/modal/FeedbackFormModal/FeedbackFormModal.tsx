"use client";

import css from "./FeedbackFormModal.module.css";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFeedback } from "@/lib/api/feedbacks";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useFeedbackDraftStore } from "@/store/feedbackStore";
import { FeedbackDraft } from "@/store/feedbackStore";
import { useRouter } from "next/navigation";

interface FeedbackFormModalProps {
  onCloseModal: () => void;
  toolId: string;
}

const FeedbackFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name is too long")
    .required("Name is required"),
  feedback: Yup.string()
    .min(10, "Feedback must be at least 10 characters")
    .max(500, "Feedback is too long")
    .required("Feedback is required"),
  rate: Yup.number()
    .min(1, "Rating is required")
    .max(5)
    .required("Rating is required"),
});

export const FeedbackFormModal = ({
  onCloseModal,
  toolId,
}: FeedbackFormModalProps) => {
  const { draft, setDraft, clearDraft } = useFeedbackDraftStore();
  const router = useRouter();

  const [hoverRating, setHoverRating] = useState<number>(0);

  const [errors, setErrors] = useState<
    Partial<Record<keyof FeedbackDraft, string>>
  >({});

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCloseModal();
    }
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["feedbacks"],
    mutationFn: createFeedback,
    onSuccess: () => {
      clearDraft();
      onCloseModal();
      toast.success("Відгук успішно опубліковано!");
      router.refresh();
    },
    onError: () => {
      toast.error("Не вдалося опублікувати відгук. Спробуйте ще раз.");
    },
  });

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setDraft({ [name]: value } as Partial<FeedbackDraft>);

    try {
      await FeedbackFormSchema.validateAt(name, {
        ...draft,
        [name]: value,
      });
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setErrors((prev) => ({ ...prev, [name]: err.message }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await FeedbackFormSchema.validate(draft, { abortEarly: false });
      setErrors({});
      mutate({
        toolId,
        rate: draft.rate,
        description: draft.feedback,
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: Partial<Record<keyof FeedbackDraft, string>> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path as keyof FeedbackDraft] = error.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseModal();
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

        <form className={css.form} onSubmit={handleSubmit} noValidate>
          <div>
            <div className={css.formGroup}>
              <label htmlFor="name" className={css.label}>
                Імʼя
              </label>
              <input
                id="name"
                name="name"
                placeholder="Ваше ім’я"
                value={draft.name}
                onChange={handleChange}
                className={`${css.input} ${errors.name ? css.errorInput : ""}`}
              />
            </div>
            {errors.name && <span className={css.error}>{errors.name}</span>}
          </div>

          <div>
            <div className={css.formGroup}>
              <label htmlFor="feedback" className={css.label}>
                Відгук
              </label>
              <textarea
                id="feedback"
                name="feedback"
                placeholder="Ваш відгук"
                value={draft.feedback}
                onChange={handleChange}
                className={`${css.text} ${errors.feedback ? css.errorInput : ""}`}
              />
            </div>
            {errors.feedback && (
              <span className={css.error}>{errors.feedback}</span>
            )}
          </div>

          <div>
            <div className={css.formGroup}>
              <label htmlFor="rate" className={css.label}>
                Оцінка
              </label>
              <input type="hidden" name="rate" value={draft.rate} />
              <div className={css.rating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    id="rate"
                    key={star}
                    type="button"
                    className={css.star}
                    onClick={() => setDraft({ rate: star })}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}>
                    <svg className={css.ratingIcon}>
                      <use
                        href={
                          star <= (hoverRating || draft.rate)
                            ? "/svg/sprite.svg#star-filled"
                            : "/svg/sprite.svg#star"
                        }
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            {errors.rate && <span className={css.error}>{errors.rate}</span>}
          </div>

          <button className={css.submitBtn} type="submit" disabled={isPending}>
            Надіслати
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};
