"use client";

import styles from "./AddEditToolForm.module.css";
import React, { useEffect, useMemo } from "react";

interface PhotoManagerProps {
  mode: "create" | "edit";
  existingImages: string[];
  selectedFiles: File[];
  imagesToDelete: string[];
  onExistingImagesChange: (images: string[]) => void;
  onSelectedFilesChange: (files: File[]) => void;
  onImagesToDeleteChange: (urls: string[]) => void;
  onPreviewChange?: (preview: string | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function PhotoManager({
  mode,
  existingImages,
  selectedFiles,
  imagesToDelete,
  onExistingImagesChange,
  onSelectedFilesChange,
  onImagesToDeleteChange,
  onPreviewChange,
  fileInputRef,
}: PhotoManagerProps) {
  const remainingExisting = existingImages.length - imagesToDelete.length;
  const maxNew = Math.max(0, 5 - remainingExisting);
  const totalFinal = remainingExisting + selectedFiles.length;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (!files) return;

    // Режим создания - простая замена
    if (mode === "create") {
      const file = files[0] || null;
      if (file) {
        onSelectedFilesChange([file]);
        // Обновляем preview в режиме создания
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === "string" && onPreviewChange) {
            onPreviewChange(result);
          }
        };
        reader.readAsDataURL(file);
      } else {
        onSelectedFilesChange([]);
        if (onPreviewChange) {
          onPreviewChange(null);
        }
      }
    } else {
      // Режим редактирования - комбинируем файлы
      const newFiles = Array.from(files);
      const available = 5 - (existingImages.length - imagesToDelete.length);
      const combined = [...selectedFiles, ...newFiles];
      onSelectedFilesChange(combined.slice(0, available));
    }
    // Очищаем input, чтобы можно было выбрать файлы ещё раз
    event.currentTarget.value = "";
  };

  const toggleDeleteImage = (url: string) => {
    if (imagesToDelete.includes(url)) {
      onImagesToDeleteChange(imagesToDelete.filter((u) => u !== url));
    } else {
      onImagesToDeleteChange([...imagesToDelete, url]);
    }
  };

  const removeNewFile = (index: number) => {
    onSelectedFilesChange(selectedFiles.filter((_, i) => i !== index));
  };

  // Memoize blob URLs for new files in edit mode
  const newFileUrls = useMemo(() => {
    return selectedFiles.map((file) => URL.createObjectURL(file));
  }, [selectedFiles]);

  // Cleanup blob URLs for new files
  useEffect(() => {
    return () => {
      newFileUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [newFileUrls]);

  // For create mode - use first file URL as preview
  const previewUrl =
    mode === "create" && newFileUrls.length > 0 ? newFileUrls[0] : null;

  if (mode === "create") {
    return (
      <div className={styles.photoBlock}>
        <label className={styles.label}>Фото інструменту</label>
        <div className={styles.photoArea}>
          <div className={styles.photoInput}>
            {previewUrl ? (
              <div className={styles.preview}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Превью"
                  className={styles.previewImage}
                />
              </div>
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
            onChange={handleFileSelect}
          />
          <button
            type="button"
            className={styles.uploadButton}
            onClick={() => fileInputRef.current?.click()}
          >
            Завантажити фото
          </button>
        </div>
      </div>
    );
  }

  // Режим редактирования
  return (
    <div className={styles.photoBlock}>
      <label className={styles.label}>Управління фото</label>

      {/* Текущие фото */}
      {existingImages.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>
              Поточні фото ({remainingExisting})
            </h4>
            {imagesToDelete.length > 0 && (
              <span style={{ fontSize: 12, color: "#d32f2f" }}>
                Позначено на видалення: {imagesToDelete.length}
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {existingImages.map((img, idx) => {
              const isDeleted = imagesToDelete.includes(img);
              return (
                <div
                  key={img + idx}
                  style={{
                    position: "relative",
                    opacity: isDeleted ? 0.5 : 1,
                    border: isDeleted
                      ? "2px solid #d32f2f"
                      : "2px solid #e0e0e0",
                    borderRadius: 8,
                    overflow: "hidden",
                    transition: "all 0.2s",
                  }}
                >
                  <img
                    src={img}
                    alt={`Фото ${idx + 1}`}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                    }}
                  />
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: 6,
                      fontSize: 12,
                      background: isDeleted ? "#ffe0e0" : "#f5f5f5",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isDeleted}
                      onChange={() => toggleDeleteImage(img)}
                      style={{ cursor: "pointer" }}
                    />
                    <span>
                      {isDeleted ? "Скасувати видалення" : "Видалити"}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Добавление новых фото */}
      {maxNew > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 12 }}>
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>
              Додати нові фото ({selectedFiles.length} вибрано)
            </h4>
            <p style={{ fontSize: 12, color: "#666", marginTop: 4, margin: 0 }}>
              Можна додати до {maxNew} фото
            </p>
          </div>
          <button
            type="button"
            className={styles.uploadButton}
            onClick={() => fileInputRef.current?.click()}
            style={{ marginBottom: 12, padding: "10px 24px" }}
          >
            + Виберіть фото ({selectedFiles.length}/{maxNew})
          </button>
          <input
            ref={fileInputRef}
            className={styles.fileInput}
            type="file"
            name="images"
            id="imageUploadEdit"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />

          {selectedFiles.length > 0 && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {selectedFiles.map((file, idx) => (
                <div
                  key={file.name + idx}
                  style={{
                    position: "relative",
                    border: "2px solid #4caf50",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={newFileUrls[idx]}
                    alt={`Нове фото ${idx + 1}`}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeNewFile(idx)}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: "#ff5252",
                      color: "#fff",
                      border: "none",
                      borderRadius: "0 6px 0 6px",
                      padding: "2px 6px",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Статистика */}
      <div
        style={{
          padding: 12,
          background: "#f5f5f5",
          borderRadius: 6,
          fontSize: 12,
        }}
      >
        <div style={{ marginBottom: 6 }}>
          <strong>Загальний результат:</strong>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div>
            📸 Поточні: <strong>{remainingExisting}</strong>
          </div>
          <div>
            🗑️ На видалення:{" "}
            <strong style={{ color: "#d32f2f" }}>
              {imagesToDelete.length}
            </strong>
          </div>
          <div>
            ✨ Нові:{" "}
            <strong style={{ color: "#4caf50" }}>{selectedFiles.length}</strong>
          </div>
          <div>
            📊 Всього: <strong>{totalFinal}/5</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
