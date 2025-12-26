"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as yup from "yup";
import css from "./resetPassword.module.css";

export const dynamic = "force-dynamic";

const resetPasswordSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Введіть коректну email-адресу")
    .required("Пошта є обовʼязковою"),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");

    try {
      await resetPasswordSchema.validate(
        { email },
        { abortEarly: false }
      );

      setIsLoading(true);

      const res = await fetch(
        "/api/auth/request-reset-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) {
        throw new Error("Помилка серверу");
      }

      toast.success(
        "Лист на зміну пароля успішно надісланий"
      );

      setTimeout(() => {
        router.replace("/auth/login");
      }, 1500);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setError(err.errors[0]);
        return;
      }

      toast.error("Не вдалося надіслати лист");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <section className={css.resetPassword}>
        <h1 className={css.title}>
          Зміна пароля
        </h1>

        <form
          className={css.form}
          onSubmit={handleSubmit}
          noValidate
        >
          <label className={css.field}>
            <input
              className={`${css.input} ${
                error ? css.inputError : ""
              }`}
              type="email"
              name="email"
              placeholder="Ваша пошта"
              autoComplete="email"
            />

            {error && (
              <span className={css.error}>
                {error}
              </span>
            )}
          </label>

          <button
            type="submit"
            className={css.submit}
            disabled={isLoading}
          >
            {isLoading
              ? "Надсилання..."
              : "Надіслати лист"}
          </button>
        </form>
      </section>
    </div>
  );
}