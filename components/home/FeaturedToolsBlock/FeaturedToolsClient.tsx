"use client";

import { useEffect } from "react";
import Link from "next/link";
import ToolCard from "@/components/tools/ToolCard/ToolCard";
import { Tool } from "@/types/tool";
import { useToolsStore } from "@/store/tools.store";
import styles from "./FeaturedToolsBlock.module.css";

interface FeaturedToolsClientProps {
    initialTools: Tool[];
}

export default function FeaturedToolsClient({
    initialTools,
}: FeaturedToolsClientProps) {
    const storeTools = useToolsStore((state) => state.tools);
    const setStoreTools = useToolsStore((state) => state.setTools);

    // Синхронізація зі сторою при першому завантаженні
    useEffect(() => {
        if (storeTools.length === 0) {
            setStoreTools(initialTools);
        }
    }, []);

    // Використовуємо інструменти зі стору, якщо вони є, інакше — початкові
    const displayTools = storeTools.length > 0 ? storeTools : initialTools;

    const sortedAndFiltered = [...displayTools]
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
