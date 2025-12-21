"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./FilterBar.module.css";
import { getCategories } from "@/lib/api/categories";
import type { Category } from "@/types/category";

const ALL_CATEGORIES_VALUE = "all";

const FilterBar = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCategory = searchParams.get("category") ?? ALL_CATEGORIES_VALUE;

  const hasCategoryFilter = currentCategory !== ALL_CATEGORIES_VALUE;
  const hasSearchFilter = !!searchParams.get("search");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);

        const list = await getCategories();

        console.log("Loaded categories:", list);

        setCategories(list);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);
  // ===========================

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const changeCategory = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === ALL_CATEGORIES_VALUE) {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    setOpen(false);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleResetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("search");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const isResetDisabled = !hasCategoryFilter && !hasSearchFilter;

  const currentLabel =
    currentCategory === "all"
      ? "Всі категорії"
      : categories.find((c) => c._id === currentCategory)?.title ||
        "Всі категорії";

  return (
    <div className={styles.wrapper}>
      <div ref={dropdownRef} className={styles.selectWrapper}>
        <button
          type="button"
          className={`${styles.selectButton} ${open ? styles.open : ""}`}
          disabled={isLoading}
          onClick={() => setOpen((prev) => !prev)}
        >
          {currentLabel}
          <svg className={`${styles.arrow} ${open ? styles.open : ""}`}>
            <use href="/svg/sprite.svg#icon-Vector"></use>
          </svg>
        </button>

        {open && (
          <div className={styles.dropdown}>
            <div
              className={`${styles.option} ${
                currentCategory === "all" ? styles.selectedOption : ""
              }`}
              onClick={() => changeCategory("all")}
            >
              Всі категорії
            </div>

            {categories.map((cat) => (
              <div
                key={cat._id}
                className={`${styles.option} ${
                  currentCategory === cat._id ? styles.selectedOption : ""
                }`}
                onClick={() => changeCategory(cat._id)}
              >
                {cat.title}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        className={styles.resetButton}
        onClick={handleResetFilters}
        disabled={isResetDisabled}
      >
        Скинути фільтри
      </button>
    </div>
  );
};

export default FilterBar;
