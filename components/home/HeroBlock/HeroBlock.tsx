"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./HeroBlock.module.css";

export default function HeroBlock() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const value = query.trim();
    if (!value) return;

    router.push(`/tools?search=${encodeURIComponent(value)}`);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <h1 className={styles.title}>ToolNext — ваш надійний сусід</h1>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            className={styles.input}
            placeholder="Дриль алмазного свердління"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button
            type="button"
            className={styles.button}
            onClick={handleSearch}
          >
            Пошук
          </button>
        </div>
      </div>
    </section>
  );
}
