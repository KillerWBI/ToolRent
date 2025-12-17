import { Suspense } from "react";
import ToolCard from "@/components/tools/ToolCard/ToolCard";
import { ToolsResponse } from "@/lib/api/tools";
import { Tool } from "@/types/tool";
import Link from "next/link";
import Loader from "@/components/ui/Loader/Loader";
import styles from "./FeaturedToolsBlock.module.css";

// Компонент для відображення під час завантаження
function LoadingFallback() {
    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.heading}>Популярні інструменти</h2>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "16px",
                        padding: "40px 0",
                    }}
                >
                    <p>Завантаження інструментів...</p>
                    <Loader />
                </div>
            </div>
        </section>
    );
}

// Функція отримання даних на сервері

async function getFeaturedTools(): Promise<Tool[]> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/tools`,
            {
                next: { revalidate: 60 }, // Оновлювати дані раз на хвилину
            }
        );

        if (!res.ok) {
            throw new Error("Failed to fetch tools");
        }

        const data: ToolsResponse = await res.json();
        return data.tools;
    } catch (error) {
        console.error("Error fetching featured tools:", error);
        return [];
    }
}

export default function FeaturedToolsBlockWrapper() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <FeaturedToolsBlock />
        </Suspense>
    );
}

async function FeaturedToolsBlock() {
    const tools = await getFeaturedTools();

    if (!tools || tools.length === 0) {
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
                    {[...tools]
                        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
                        .slice(0, 8)
                        .map((tool, index) => (
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
