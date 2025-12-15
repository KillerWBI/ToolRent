"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./AuthPage.module.css";

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

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setStatus(undefined);
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

        router.replace(redirectTo);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Сталася помилка";
        setStatus(message);
        if (typeof window !== "undefined") alert(message);
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
    status,
  } = formik;

  return (
    <main className={styles.container}>
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.formSection}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/svg/logo.svg"
                alt="ToolNext"
                width={28}
                height={28}
                className={styles.logoIcon}
                priority
              />
              <span>ToolNext</span>
            </Link>

            <div>
              <h1 className={styles.title}>Реєстрація</h1>
              <p className={styles.subtitle}>
                Заповніть форму, щоб створити акаунт та розпочати роботу з
                інструментами.
              </p>
            </div>

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
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "Реєстрація..." : "Зареєструватися"}
              </button>
              {status ? (
                <div className={styles.formStatus}>{status}</div>
              ) : null}
            </form>

            <div className={styles.switchAuth}>
              <span>Вже маєте акаунт?</span>
              <Link href="/login">Вхід</Link>
            </div>

            <p className={styles.footerNote}>© 2025 ToolNext</p>
          </div>

          <div className={styles.imageSection} aria-hidden>
            <Image
              src="/image/Placeholder Image-1.png"
              alt="Робочі інструменти на полицях"
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
