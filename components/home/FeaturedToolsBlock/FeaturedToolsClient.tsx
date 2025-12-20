"use client";

import Link from "next/link";
import ToolCard from "@/components/tools/ToolCard/ToolCard";
import { Tool } from "@/types/tool";
import styles from "./FeaturedToolsBlock.module.css";

interface FeaturedToolsClientProps {
  initialTools: Tool[];
}

export default function FeaturedToolsClient({
  initialTools,
}: FeaturedToolsClientProps) {
  // Відображаємо тільки передані інструменти, без глобального стора
  const sortedAndFiltered = [...initialTools]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 8);

  if (!sortedAndFiltered.length) {
    return (
      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.heading}>Популярні інструменти</h2>
          <p>На жаль, наразі немає доступних інструментів.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>Популярні інструменти</h2>

        <div className={styles.grid}>
          {sortedAndFiltered.map((tool, index) => (
            <ToolCard key={tool._id || index} tool={tool} />
          ))}
        </div>

        <div className={styles.buttonWrapper}>
          <Link href="/tools" className={styles.viewAllButton}>
            До всіх інструментів
          </Link>
        </div>
      </div>
    </section>
  );
}
