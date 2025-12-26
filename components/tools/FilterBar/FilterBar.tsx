"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./FilterBar.module.css";
import { getCategories } from "@/lib/api/categories";
import type { Category } from "@/types/category";

const ALL_CATEGORIES_VALUE = "all";

const SORT_OPTIONS = [
  { value: "popular", label: "Популярні" },
  { value: "name_asc", label: "А–Я" },
  { value: "name_desc", label: "Я–А" },
  { value: "price_asc", label: "Спочатку дешевші" },
  { value: "price_desc", label: "Спочатку дорожчі" },
];

const FilterBar = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // ================== URL params ==================

  const currentCategory = searchParams.get("category") ?? ALL_CATEGORIES_VALUE;
  const priceFrom = searchParams.get("priceFrom") ?? "";
  const priceTo = searchParams.get("priceTo") ?? "";
  const sort = searchParams.get("sort") ?? "popular";
  const hasSearchFilter = !!searchParams.get("search");

  const hasCategoryFilter = currentCategory !== ALL_CATEGORIES_VALUE;
  const hasPriceFilter = !!priceFrom || !!priceTo;
  const hasSortFilter = sort !== "popular";

  // ==================== Load categories ====================

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const list = await getCategories();
        setCategories(list);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // ================= Close dropdown on outside click =================

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(e.target as Node)
      ) {
        setSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ========================= Helpers =========================

  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const changeCategory = (value: string) => {
    updateParam("category", value === ALL_CATEGORIES_VALUE ? undefined : value);
    setOpen(false);
  };

  const handleResetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("category");
    params.delete("search");
    params.delete("priceFrom");
    params.delete("priceTo");
    params.delete("sort");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const isResetDisabled =
    !hasCategoryFilter && !hasSearchFilter && !hasPriceFilter && !hasSortFilter;

  const currentLabel =
    currentCategory === ALL_CATEGORIES_VALUE
      ? "Всі категорії"
      : categories.find((c) => c._id === currentCategory)?.title ||
        "Всі категорії";

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        {/* CATEGORY */}
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
                  currentCategory === ALL_CATEGORIES_VALUE
                    ? styles.selectedOption
                    : ""
                }`}
                onClick={() => changeCategory(ALL_CATEGORIES_VALUE)}
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

        {/* PRICE */}
        <input
          type="number"
          placeholder="Ціна від"
          className={styles.input}
          value={priceFrom}
          onChange={(e) => updateParam("priceFrom", e.target.value)}
        />

        <input
          type="number"
          placeholder="Ціна до"
          className={styles.input}
          value={priceTo}
          onChange={(e) => updateParam("priceTo", e.target.value)}
        />
      </div>

      <div className={styles.right}>
        {/* SORT */}

        <div ref={sortDropdownRef} className={styles.selectWrapper}>
          <button
            type="button"
            className={`${styles.select} ${sortOpen ? styles.open : ""}`}
            onClick={() => setSortOpen((prev) => !prev)}
          >
            {SORT_OPTIONS.find((o) => o.value === sort)?.label}

            <svg className={`${styles.arrow} ${sortOpen ? styles.open : ""}`}>
              <use href="/svg/sprite.svg#icon-Vector" />
            </svg>
          </button>

          {sortOpen && (
            <div className={styles.dropdown}>
              {SORT_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  className={styles.option}
                  onClick={() => {
                    updateParam("sort", opt.value);
                    setSortOpen(false);
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RESET */}

        <button
          type="button"
          className={styles.resetButton}
          onClick={handleResetFilters}
          disabled={isResetDisabled}
        >
          Скинути фільтри
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
