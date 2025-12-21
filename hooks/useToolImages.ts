import { useMemo } from "react";
import { Tool } from "@/types/tool";

/**
 * Хук для обробки зображень інструмента
 * Підтримує формати: string, string[], масив об'єктів з url
 */
export function useToolImages(tool: Tool) {
  // Допоміжна: витягти перше валідне зображення з різних форматів
  const extractImage = (value: any): string | null => {
    if (!value) return null;

    if (typeof value === "string") {
      const t = value.trim();
      return t || null;
    }

    if (Array.isArray(value)) {
      for (const img of value) {
        const fromItem = extractImage(img);
        if (fromItem) return fromItem;
      }
    }

    if (typeof value === "object" && "url" in value) {
      const t = String((value as any).url || "").trim();
      return t || null;
    }

    return null;
  };

  // Отримуємо перше зображення
  const firstImage = useMemo(() => {
    const imagesAny: any = (tool as any).images ?? (tool as any).image ?? null;
    const found = extractImage(imagesAny);
    return found || "/image/Placeholder Image.png";
  }, [tool]);

  // Отримуємо всі зображення для галереї
  const allImages = useMemo(() => {
    if (!tool.images) return [];
    if (typeof tool.images === "string") {
      return [tool.images].filter((img) => img && img.trim());
    }
    if (Array.isArray(tool.images)) {
      return tool.images
        .map((img) => extractImage(img))
        .filter((img): img is string => img !== null);
    }
    return [];
  }, [tool.images]);

  // Перевіряємо, чи приходить зображення з масиву
  const isFromArray = Array.isArray(tool.images);

  return {
    firstImage,
    allImages,
    isFromArray,
    extractImage,
  };
}
