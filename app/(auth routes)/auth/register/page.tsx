"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";
import styles from "./AuthPage.module.css";

const currentYear = new Date().getFullYear();

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Мінімум 2 символи")
    .required("Обов'язкове поле"),
  email: Yup.string()
    .trim()
    .email("Некоректна пошта")
    .required("Обов'язкове поле"),
  password: Yup.string()
    .min(8, "Мінімум 8 символів")
    .required("Обов'язкове поле"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Паролі не співпадають")
    .required("Обов'язкове поле"),
});

export default function RegisterPage() {
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
        const res = await fetch(`/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: values.name.trim(),
            email: values.email.trim(),
            password: values.password,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          const message =
            data?.message || data?.error || "Не вдалося зареєструватися";
          throw new Error(message);
        }

        // Обновляем состояние авторизации перед редиректом
        await fetchUser();
        toast.success("Успішна реєстрація!");
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
    dirty,
  } = formik;

  return (
    <div className={`${styles.container} ${styles.fadeIn}`}>
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.formSection}>
            <div className="formatter">
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
            </div>
            <div className="formatter">
              <h1 className={styles.title}>Реєстрація</h1>

              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                {[
                  {
                    name: "name",
                    label: "Ім'я*",
                    type: "text",
                    placeholder: "Ваше ім'я",
                    autoComplete: "name",
                  },
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
                    autoComplete: "new-password",
                  },
                  {
                    name: "confirmPassword",
                    label: "Підтвердіть пароль*",
                    type: "password",
                    placeholder: "******",
                    autoComplete: "new-password",
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

                <button
                  type="submit"
                  className={styles.submit}
                  disabled={isSubmitting || !isValid}
                >
                  {isSubmitting ? "Зачекайте..." : "Зареєструватись"}
                </button>
              </form>

              <div className={styles.switchAuth}>
                <span>Вже маєте акаунт?</span>
                <Link href="/auth/login">Вхід</Link>
              </div>
            </div>
            <p className={styles.footerNote}>© {currentYear} ToolNext</p>
          </div>

          <div className={styles.imageSection}>
            <Image
              src="/image/Placeholder-Image-1.webp"
              alt="Робочі інструменти на полицях"
              fill
              priority
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
