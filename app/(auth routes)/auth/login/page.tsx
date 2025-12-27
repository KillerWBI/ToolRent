"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";
import styles from "../register/AuthPage.module.css";

const validationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Некоректна пошта")
    .required("Обов'язкове поле"),
  password: Yup.string()
    .min(8, "Мінімум 8 символів")
    .required("Обов'язкове поле"),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { fetchUser } = useAuthStore();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: values.email.trim(),
            password: values.password,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          const message = data?.message || data?.error || "Не вдалося увійти";
          throw new Error(message);
        }

        // Обновляем состояние авторизации перед редиректом
        await fetchUser();
        toast.success("Успішний вхід!");
        router.replace(redirectTo);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Сталася помилка";
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isValid,
  } = formik;

  return (
    <main className={styles.container}>
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.formSection}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/svg/company-logo.svg"
                alt="ToolNext"
                width={164}
                height={28}
                className={styles.logoIcon}
                priority
              />
            </Link>

            <div className="formatter">
              <div>
                <h1 className={styles.title}>Вхід</h1>
              </div>

              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                {[
                  {
                    name: "email",
                    label: "Пошта*",
                    type: "email",
                    placeholder: "Ваша пошта",
                    autoComplete: "email",
                  },
                  {
                    name: "password",
                    label: "Пароль*",
                    type: "password",
                    placeholder: "******",
                    autoComplete: "current-password",
                  },
                ].map((field) => {
                  const hasError =
                    touched[field.name as keyof typeof touched] &&
                    errors[field.name as keyof typeof errors];
                  return (
                    <label key={field.name} className={styles.field}>
                      <span className={styles.label}>{field.label}</span>
                      <input
                        className={`${styles.input} ${
                          hasError ? styles.inputError : ""
                        }`}
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        autoComplete={field.autoComplete}
                        value={values[field.name as keyof typeof values]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={Boolean(hasError)}
                        required
                      />
                      {hasError ? (
                        <span className={styles.errorText}>
                          {errors[field.name as keyof typeof errors] as string}
                        </span>
                      ) : null}
                    </label>
                  );
                })}

                <div className={styles.forgotPassword}>
                  <Link href="/auth/resetPassword">Забули пароль?</Link>
                </div>
                <button
                  type="submit"
                  className={styles.submit}
                  disabled={isSubmitting || !isValid}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? "Вхід..." : "Увійти"}
                </button>
              </form>

              <div className={styles.switchAuth}>
                <span>Не маєте акаунту?</span>
                <Link href="/auth/register">Реєстрація</Link>
              </div>
            </div>
            <p className={styles.footerNote}>© 2025 ToolNext</p>
          </div>

          <div className={styles.imageSection} aria-hidden>
            <Image
              src="/image/Placeholder-Image.webp"
              alt="Робоче місце з інструментами"
              fill
              priority
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
