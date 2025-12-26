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
import toast from "react-hot-toast";
import { useToolsStore } from "@/store/tools.store";
import { useProfileToolsStore } from "@/store/profileTools.store";
import PhotoManager from "./PhotoManager";

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

const getCategoryId = (tool?: Tool | null): string => {
  if (!tool) return "";
  const cat: any = (tool as any).category;
  if (!cat) return "";
  if (typeof cat === "string") return cat;
  return cat._id || cat.id || cat.value || "";
};

export default function AddEditToolForm({
  mode = "create",
  initialTool,
  onCancel,
}: AddEditToolFormProps) {
  const router = useRouter();
  const userId = useAuthStore((state) => state.user?.id);
  const updateToolsStore = useToolsStore((state) => state.setTools);
  const toolsStoreItems = useToolsStore((state) => state.tools);
  const updateProfileStore = useProfileToolsStore((state) => state.setTools);
  const profileStoreItems = useProfileToolsStore((state) => state.tools);
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
  const formikRef = useRef<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(() => {
    if (Array.isArray(initialTool?.images)) return initialTool?.images ?? [];
    return initialTool?.images ? [String(initialTool.images)] : [];
  });
  const categoryDropdownRef = useRef<HTMLDivElement | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const initialValues: FormValues = useMemo(
    () => ({
      name: initialTool?.name || "",
      pricePerDay: initialTool?.pricePerDay ?? "",
      categoryId: getCategoryId(initialTool),
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

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }
    router.back();
  };

  useEffect(() => {
    // Keep existing images in sync with the tool being edited
    if (mode === "edit") {
      const arr = Array.isArray(initialTool?.images)
        ? (initialTool?.images ?? [])
        : initialTool?.images
          ? [String(initialTool.images)]
          : [];
      setExistingImages(arr);
      setImagesToDelete([]);
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hook to update Formik field when selectedFiles change in create mode
  useEffect(() => {
    if (mode === "create" && formikRef.current && selectedFiles.length > 0) {
      formikRef.current.setFieldValue("image", selectedFiles[0]);
    }
  }, [selectedFiles, mode]);

  const sortedCategories = useMemo(
    () =>
      [...categories].sort((a, b) =>
        a.title.localeCompare(b.title, "uk", { sensitivity: "base" })
      ),
    [categories]
  );

  return (
    <div className={styles.section}>
      <h1 className={styles.title}>
        {mode === "edit" ? "Редагувати інструмент" : "Публікація інструменту"}
      </h1>

      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={buildValidationSchema(mode === "edit")}
        enableReinitialize
        onSubmit={async (values, helpers) => {
          helpers.setStatus(null);
          try {
            if (!userId) {
              throw new Error("Користувач не авторизований");
            }

            const specsObject = values.specifications.trim()
              ? parseSpecifications(values.specifications)
              : undefined;

            let savedTool: Tool;

            if (mode === "edit" && initialTool?._id) {
              const existingImagesArr = existingImages;

              const updatePayload: Record<string, unknown> = {
                name: values.name.trim(),
                pricePerDay: Number(values.pricePerDay),
                category: values.categoryId,
                rentalTerms: values.terms.trim(),
                description: values.description.trim(),
              };

              // Validate that at least one image will be submitted (with deletions)
              const remainingExistingCount = existingImagesArr.filter(
                (u) => !imagesToDelete.includes(u)
              ).length;
              const totalImagesCount =
                remainingExistingCount + selectedFiles.length;
              if (totalImagesCount === 0) {
                throw new Error("Потрібно додати хоча б одне фото");
              }

              // Upload newly selected images (if any) and combine with existing (after deletions)
              let finalImages = existingImagesArr.filter(
                (u) => !imagesToDelete.includes(u)
              );
              if (selectedFiles.length > 0) {
                const uploadToastId = toast.loading("📤 Завантаження фото...");
                try {
                  const dataUrls = await Promise.all(
                    selectedFiles.map((f) => fileToDataUrl(f))
                  );
                  const res = await fetch("/api/uploads", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      images: dataUrls,
                    }),
                  });
                  if (!res.ok) {
                    const err = await res.json().catch(() => ({
                      message: "Upload failed",
                    }));
                    throw new Error(err.message || "Upload failed");
                  }
                  const payload = await res.json();
                  const uploaded: string[] = Array.isArray(payload?.urls)
                    ? payload.urls
                    : [];
                  finalImages = [...finalImages, ...uploaded].slice(0, 5);
                  toast.success("✅ Фото успішно завантажено", {
                    id: uploadToastId,
                  });
                } catch (uploadError) {
                  toast.error(
                    uploadError instanceof Error
                      ? uploadError.message
                      : "❌ Помилка при завантаженні фото",
                    { id: uploadToastId }
                  );
                  throw uploadError;
                }
              }
              if (finalImages.length) {
                updatePayload.images =
                  finalImages.length === 1 ? finalImages[0] : finalImages;
              }
              if (specsObject && Object.keys(specsObject).length > 0) {
                updatePayload.specifications = specsObject;
              }

              savedTool = await updateTool(initialTool._id, updatePayload);
              toast.success("✅ Інструмент успішно оновлено!");
            } else {
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

              savedTool = await createTool(formData);
              toast.success("✅ Інструмент успішно опубліковано!");
            }

            // Обновляем сторы, чтобы карточки и профили сразу показали новые данные
            const applyUpdate = (list: Tool[] | undefined) => {
              if (!list || !list.length || !savedTool?._id) return list;
              return list.map((t) => (t._id === savedTool._id ? savedTool : t));
            };

            const updatedTools = applyUpdate(toolsStoreItems);
            if (updatedTools) updateToolsStore(updatedTools);

            const updatedProfile = applyUpdate(profileStoreItems);
            if (updatedProfile) updateProfileStore(updatedProfile);

            const targetId = savedTool?._id ?? initialTool?._id;
            const fallback = `/profile/${userId ?? ""}`;
            // Після публікації/редагування перенаправляємо на сторінку інструменту
            router.push(targetId ? `/tools/${targetId}` : fallback);
            router.refresh();
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : "❌ Не вдалося зберегти інструмент. Спробуйте ще раз.";
            helpers.setStatus({ error: message });
            toast.error(message);
          } finally {
            helpers.setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue, status, values, errors, touched }) => {
          const currentCategoryLabel =
            values.categoryId && categories.length
              ? categories.find((c) => c._id === values.categoryId)?.title ||
                "Оберіть категорію"
              : categoriesLoading
                ? "Завантаження..."
                : "Оберіть категорію";
          const hasError = (field: keyof FormValues) =>
            Boolean(touched[field] && errors[field]);

          return (
            <Form className={styles.form}>
              <div className={styles.grid}>
                <div>
                  <PhotoManager
                    mode={mode}
                    existingImages={existingImages}
                    selectedFiles={selectedFiles}
                    imagesToDelete={imagesToDelete}
                    onExistingImagesChange={setExistingImages}
                    onSelectedFilesChange={setSelectedFiles}
                    onImagesToDeleteChange={setImagesToDelete}
                    onPreviewChange={setPreview}
                    fileInputRef={fileInputRef}
                  />

                  <div className={styles.fields}>
                    <label className={styles.label} htmlFor="name">
                      Назва
                    </label>
                    <Field
                      id="name"
                      name="name"
                      placeholder="Наприклад, Перфоратор Bosch"
                      className={`${styles.input} ${
                        hasError("name") ? styles.inputError : ""
                      }`}
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
                      placeholder="300"
                      className={`${styles.input} ${
                        hasError("pricePerDay") ? styles.inputError : ""
                      }`}
                    />
                    <ErrorMessage
                      name="pricePerDay"
                      component="p"
                      className={styles.error}
                    />

                    <label className={styles.label} htmlFor="categoryId">
                      Категорія
                    </label>
                    <div
                      className={styles.selectWrapper}
                      ref={categoryDropdownRef}
                    >
                      <button
                        type="button"
                        className={`${styles.selectButton} ${
                          categoryOpen ? styles.selectOpen : ""
                        } ${hasError("categoryId") ? styles.selectError : ""}`}
                        onClick={() =>
                          !categoriesLoading && setCategoryOpen((prev) => !prev)
                        }
                        disabled={categoriesLoading}
                      >
                        {currentCategoryLabel}
                        <svg
                          className={`${styles.arrow} ${
                            categoryOpen ? styles.open : ""
                          }`}
                        >
                          <use href="/svg/sprite.svg#icon-Vector"></use>
                        </svg>
                      </button>

                      {categoryOpen && (
                        <div className={styles.dropdown}>
                          <div
                            className={`${styles.option} ${
                              !values.categoryId ? styles.selectedOption : ""
                            }`}
                            onClick={() => {
                              setFieldValue("categoryId", "");
                              setCategoryOpen(false);
                            }}
                          >
                            {categoriesLoading
                              ? "Завантаження..."
                              : "Оберіть категорію"}
                          </div>
                          {sortedCategories.map((category) => (
                            <div
                              key={category._id}
                              className={`${styles.option} ${
                                values.categoryId === category._id
                                  ? styles.selectedOption
                                  : ""
                              }`}
                              onClick={() => {
                                setFieldValue("categoryId", category._id);
                                setCategoryOpen(false);
                              }}
                            >
                              {category.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <Field type="hidden" name="categoryId" />
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
                      placeholder="Застава 8000 грн. Станина та бак для води надаються."
                      className={`${styles.terms} ${
                        hasError("terms") ? styles.termsError : ""
                      }`}
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
                      className={`${styles.textarea} ${
                        hasError("description") ? styles.textareaError : ""
                      }`}
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
                      placeholder={
                        "Потужність: 2кВт\nВага: 1 кг\nДвигун: щітковий"
                      }
                      className={`${styles.textarea} ${
                        hasError("specifications") ? styles.textareaError : ""
                      }`}
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
              </div>
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
          );
        }}
      </Formik>
    </div>
  );
}
