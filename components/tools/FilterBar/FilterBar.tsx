"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./FilterBar.module.css";
import { getCategories, type Category } from "@/lib/api/categories";

const ALL_CATEGORIES_VALUE = "all";

const FilterBar = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // що зараз у URL
  const currentCategory = searchParams.get("category") ?? ALL_CATEGORIES_VALUE;

  // 1) тягнемо список категорій з бекенду
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
        // тут можна додати toast, коли підключите
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // 2) зміна категорії
  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (value === ALL_CATEGORIES_VALUE) {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // 3) скидання фільтрів
  const handleResetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const isResetDisabled = currentCategory === ALL_CATEGORIES_VALUE;

  return (
    <div className={styles.wrapper}>
      <div className={styles.selectWrapper}>
        <select
          className={styles.select}
          value={currentCategory}
          onChange={handleCategoryChange}
          disabled={isLoading}
        >
          <option value={ALL_CATEGORIES_VALUE}>Всі категорії</option>

          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.title}
            </option>
          ))}
        </select>
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
