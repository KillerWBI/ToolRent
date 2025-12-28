"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./FilterBar.module.css";
import { getCategories } from "@/lib/api/categories";
import type { Category } from "@/types/category";

const ALL = "all";

const SORT_OPTIONS = [
  { value: "popular", label: "Популярні" },
  { value: "name_asc", label: "А–Я" },
  { value: "name_desc", label: "Я–А" },
  { value: "price_asc", label: "Спочатку дешевші" },
  { value: "price_desc", label: "Спочатку дорожчі" },
];

export default function FilterBar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const catRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = params.get("category") ?? ALL;
  const priceFrom = params.get("priceFrom") ?? "";
  const priceTo = params.get("priceTo") ?? "";
  const sort = params.get("sort") ?? "popular";
  const search = params.get("search");

  const hasFilters =
    category !== ALL || priceFrom || priceTo || sort !== "popular" || search;

  // ===== локальний стан input =====
  const [localPriceFrom, setLocalPriceFrom] = useState(priceFrom);
  const [localPriceTo, setLocalPriceTo] = useState(priceTo);

  // ===== Commit (оновлюємо URL тільки коли ввод завершено) =====
  const commitPriceFrom = () => {
    update("priceFrom", localPriceFrom || undefined);
  };

  const commitPriceTo = () => {
    update("priceTo", localPriceTo || undefined);
  };

  // ===== Load categories =====
  useEffect(() => {
    const load = async () => {
      setLoadingCategories(true);
      try {
        const data = await getCategories();
        setCategories(data);
      } finally {
        setLoadingCategories(false);
      }
    };
    load();
  }, []);

  // ===== Close dropdowns =====
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node))
        setCatOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node))
        setSortOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // ===== Update URL =====
  const update = (key: string, value?: string) => {
    const next = new URLSearchParams(params.toString());
    next.set("page", "1");

    if (!value) next.delete(key);
    else next.set(key, value);

    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const reset = () => {
    const next = new URLSearchParams();
    next.set("page", "1");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });

    setLocalPriceFrom("");
    setLocalPriceTo("");
  };

  const currentLabel =
    category === ALL
      ? "Всі категорії"
      : (categories.find((c) => c._id === category)?.title ?? "Всі категорії");

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        {/* Category */}
        <div ref={catRef} className={styles.selectWrapper}>
          <button
            disabled={loadingCategories}
            className={styles.selectButton}
            onClick={() => setCatOpen((p) => !p)}
          >
            {currentLabel}
            <svg className={styles.arrow}>
              <use href="/svg/sprite.svg#icon-Vector" />
            </svg>
          </button>

          {catOpen && (
            <div className={styles.dropdown}>
              <div className={styles.option} onClick={() => update("category")}>
                Всі категорії
              </div>
              {categories.map((c) => (
                <div
                  key={c._id}
                  className={styles.option}
                  onClick={() => update("category", c._id)}
                >
                  {c.title}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <input
          className={styles.input}
          type="text"
          placeholder="Ціна від"
          value={localPriceFrom}
          onChange={(e) => setLocalPriceFrom(e.target.value.replace(/\D/g, ""))}
          onBlur={commitPriceFrom}
          onKeyDown={(e) => e.key === "Enter" && commitPriceFrom()}
        />

        <input
          className={styles.input}
          type="text"
          placeholder="Ціна до"
          value={localPriceTo}
          onChange={(e) => setLocalPriceTo(e.target.value.replace(/\D/g, ""))}
          onBlur={commitPriceTo}
          onKeyDown={(e) => e.key === "Enter" && commitPriceTo()}
        />
      </div>

      <div className={styles.right}>
        {/* Sort */}
        <div ref={sortRef} className={styles.selectWrapper}>
          <button
            className={styles.select}
            onClick={() => setSortOpen((p) => !p)}
          >
            {SORT_OPTIONS.find((o) => o.value === sort)?.label}
            <svg className={styles.arrow}>
              <use href="/svg/sprite.svg#icon-Vector" />
            </svg>
          </button>

          {sortOpen && (
            <div className={styles.dropdown}>
              {SORT_OPTIONS.map((o) => (
                <div
                  key={o.value}
                  className={styles.option}
                  onClick={() => {
                    update("sort", o.value);
                    setSortOpen(false);
                  }}
                >
                  {o.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          className={styles.resetButton}
          disabled={!hasFilters}
          onClick={reset}
        >
          Скинути фільтри
        </button>
      </div>
    </div>
  );
}
