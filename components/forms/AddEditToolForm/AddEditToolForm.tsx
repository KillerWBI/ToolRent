"use client";

import { createTool, updateTool } from "@/lib/api/tools";
import { getCategories } from "@/lib/api/categories";
import { Tool } from "@/types/tool";
import { Category } from "@/types/category";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import styles from "./AddEditToolForm.module.css";
import { useAuthStore } from "@/store/auth.store";

type Mode = "create" | "edit";

interface AddEditToolFormProps {
  mode?: Mode;
  initialTool?: Tool;
  onCancel?: () => void;
}

interface FormValues {
  name: string;
  pricePerDay: number | "";
  categoryId: string;
  terms: string;
  description: string;
  specifications: string;
  image: File | null;
}

const buildValidationSchema = (isEdit: boolean) =>
  Yup.object().shape({
    name: Yup.string()
      .trim()
      .min(3, "Мінімум 3 символи")
      .max(96, "Максимум 96 символів")
      .required("Обовʼязкове поле"),
    pricePerDay: Yup.number()
      .typeError("Введіть число")
      .positive("Повинно бути > 0")
      .required("Обовʼязкове поле"),
    categoryId: Yup.string().required("Оберіть категорію"),
    terms: Yup.string()
      .trim()
      .min(10, "Мінімум 10 символів")
      .required("Обовʼязкове поле"),
    description: Yup.string()
      .trim()
      .min(20, "Мінімум 20 символів")
      .max(2000, "Максимум 2000 символів")
      .required("Обовʼязкове поле"),
    specifications: Yup.string().trim().max(1000, "Максимум 1000 символів"),
    image: Yup.mixed<File>()
      .nullable()
      .test(
        "file-required",
        "Додайте фото інструменту",
        (value) => isEdit || value instanceof File
      ),
  });

export default function AddEditToolForm({
  mode = "create",
  initialTool,
  onCancel,
}: AddEditToolFormProps) {
  const router = useRouter();
  const userId = useAuthStore((state) => state.user?.id);
  const [preview, setPreview] = useState<string | null>(() => {
    if (Array.isArray(initialTool?.images)) {
      return initialTool?.images?.[0] || null;
    }
    return initialTool?.images || null;
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initialValues: FormValues = useMemo(
    () => ({
      name: initialTool?.name || "",
      pricePerDay: initialTool?.pricePerDay ?? "",
      categoryId: initialTool?.category || "",
      terms: initialTool?.rentalTerms || "",
      description: initialTool?.description || "",
      specifications: initialTool?.specifications
        ? Object.entries(initialTool.specifications)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n")
        : "",
      image: null,
    }),
    [initialTool]
  );

  useEffect(() => {
    const controller = new AbortController();
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const received = await getCategories(controller.signal);
        setCategories(received);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Помилка під час завантаження категорій";
        setCategoriesError(message);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const parseSpecifications = (input: string) => {
    const lines = input
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
    const entries = lines.map((line, idx) => {
      const [key, ...rest] = line.split(":");
      if (rest.length > 0) {
        return [key.trim(), rest.join(":").trim()];
      }
      return [`spec${idx + 1}`, line];
    });
    return Object.fromEntries(entries);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }
    router.back();
  };

  return (
    <div>
      <h1 className={styles.title}>
        {mode === "edit" ? "Редагувати інструмент" : "Публікація інструменту"}
      </h1>

      <Formik
        initialValues={initialValues}
        validationSchema={buildValidationSchema(mode === "edit")}
        enableReinitialize
        onSubmit={async (values, helpers) => {
          helpers.setStatus(null);
          try {
            if (!userId) {
              throw new Error("Користувач не авторизований");
            }

            // Debug preview of what we send to backend (files are logged with basic metadata)
            const specsObject = values.specifications.trim()
              ? parseSpecifications(values.specifications)
              : undefined;

            const formData = new FormData();
            formData.append("owner", userId);
            formData.append("name", values.name.trim());
            formData.append("pricePerDay", values.pricePerDay.toString());
            formData.append("category", values.categoryId);
            formData.append("rentalTerms", values.terms.trim());
            formData.append("description", values.description.trim());
            if (values.specifications.trim()) {
              formData.append(
                "specifications",
                JSON.stringify(specsObject ?? {})
              );
            }
            if (values.image) {
              formData.append("images", values.image);
            }

            const savedTool =
              mode === "edit" && initialTool?._id
                ? await updateTool(initialTool._id, formData)
                : await createTool(formData);

            router.push(`/tools/${savedTool._id}`);
            router.refresh();
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : "Не вдалося зберегти інструмент. Спробуйте ще раз.";
            helpers.setStatus({ error: message });
            // Просте пуш-повідомлення для користувача
            if (typeof window !== "undefined") {
              window.alert(message);
            }
          } finally {
            helpers.setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue, status }) => (
          <Form className={styles.form}>
            <div className={styles.grid}>
              <div className={styles.photoBlock}>
                <label className={styles.label}>Фото інструменту</label>
                <div className={styles.photoArea}>
                  <div
                    className={styles.photoInput}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={preview}
                        alt="Попередній перегляд"
                        className={styles.preview}
                      />
                    ) : (
                      <div className={styles.placeholder}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/image/PlaceholderAddPhoto.jpg"
                          alt="Додайте зображення"
                          className={styles.placeholderImage}
                        />
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    className={styles.fileInput}
                    type="file"
                    name="image"
                    id="imageUpload"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0] || null;
                      setFieldValue("image", file);
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setPreview(url);
                      }
                    }}
                  />
                </div>
                <button
                  type="button"
                  className={styles.uploadButton}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Завантажити фото
                </button>
                <ErrorMessage
                  name="image"
                  component="p"
                  className={styles.error}
                />
              </div>

              <div className={styles.fields}>
                <label className={styles.label} htmlFor="name">
                  Назва
                </label>
                <Field
                  id="name"
                  name="name"
                  placeholder="Наприклад, Перфоратор Bosch"
                  className={styles.input}
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className={styles.error}
                />

                <label className={styles.label} htmlFor="pricePerDay">
                  Ціна/день
                </label>
                <Field
                  id="pricePerDay"
                  name="pricePerDay"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="300"
                  className={styles.input}
                />
                <ErrorMessage
                  name="pricePerDay"
                  component="p"
                  className={styles.error}
                />

                <label className={styles.label} htmlFor="categoryId">
                  Категорія
                </label>
                <Field
                  as="select"
                  id="categoryId"
                  name="categoryId"
                  className={styles.select}
                  disabled={categoriesLoading}
                >
                  <option value="">
                    {categoriesLoading
                      ? "Завантаження..."
                      : "Оберіть категорію"}
                  </option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="categoryId"
                  component="p"
                  className={styles.error}
                />
                {categoriesError && (
                  <p className={styles.hint}>{categoriesError}</p>
                )}

                <label className={styles.label} htmlFor="terms">
                  Умови оренди
                </label>
                <Field
                  as="textarea"
                  id="terms"
                  name="terms"
                  rows={2}
                  placeholder="Застава 8000 грн. Станина та бак для води надаються окремо."
                  className={styles.textarea}
                />
                <ErrorMessage
                  name="terms"
                  component="p"
                  className={styles.error}
                />

                <label className={styles.label} htmlFor="description">
                  Опис
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Ваш опис"
                  className={styles.textarea}
                />
                <ErrorMessage
                  name="description"
                  component="p"
                  className={styles.error}
                />

                <label className={styles.label} htmlFor="specifications">
                  Характеристики
                </label>
                <Field
                  as="textarea"
                  id="specifications"
                  name="specifications"
                  rows={3}
                  placeholder="Характеристики інструменту"
                  className={styles.textarea}
                />
                <ErrorMessage
                  name="specifications"
                  component="p"
                  className={styles.error}
                />
              </div>
            </div>

            {status?.error && (
              <div className={styles.statusError}>{status.error}</div>
            )}

            <div className={styles.actions}>
              <button
                type="submit"
                className={styles.submit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.loader} />
                    {mode === "edit" ? "Оновлюємо..." : "Публікуємо..."}
                  </>
                ) : (
                  "Опублікувати"
                )}
              </button>
              <button
                type="button"
                className={styles.cancel}
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Відмінити
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
