"use client";

import { useState, useEffect } from "react";
import ToolCard from "@/components/tools/ToolCard/ToolCard";
import { ToolsResponse } from "@/lib/api/tools";
import { Tool } from "@/types/tool";
import styles from "./ToolsGrid.module.css";
import Loader from "@/components/ui/Loader/Loader";


interface ApiResponse extends ToolsResponse {
    totalTools: number;
    totalPages: number;
    page: number;
    limit: number;
}

async function fetchToolsPage(page: number = 1, limit: number = 16): Promise<ApiResponse> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/tools?page=${page}&limit=${limit}`
        );

        if (!res.ok) {
            throw new Error("Failed to fetch tools");
        }

        return await res.json();
    } catch (error) {
        console.error("Error fetching tools:", error);
        throw error;
    }
}

export default function ToolsListBlock() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalTools, setTotalTools] = useState(0);

    useEffect(() => {
        let isMounted = true;
        
        const loadFirstPage = async () => {
            try {
                setLoading(true);
                const data = await fetchToolsPage(1, 16);
                
                if (isMounted) {
                    setTools(data.tools);
                    setTotalTools(data.totalTools);
                    setHasMore(data.page < data.totalPages);
                    setCurrentPage(data.page);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Помилка завантаження першої сторінки:", error);
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadFirstPage();

        return () => {
            isMounted = false;
        };
    }, []);

    const loadNextPage = async () => {
        if (loadingMore || !hasMore) return;
        
        try {
            setLoadingMore(true);
            const nextPage = currentPage + 1;
            
            const data = await fetchToolsPage(nextPage, 16);
            
            setTools(prev => [...prev, ...data.tools]);
            setCurrentPage(nextPage);
            setHasMore(data.page < data.totalPages);
            setLoadingMore(false);
            
        } catch (error) {
            console.error("Помилка завантаження наступної сторінки:", error);
            setLoadingMore(false);
        }
    };

    if (loading) {
        return (
            <section className={styles.section}>
                <div className="container">
                    <h2 className={styles.heading}>Усі інструменти</h2>
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Завантаження інструментів...</p>
                        <Loader />
                    </div>
                </div>
            </section>
        );
    }

    if (!tools.length) {
        return (
            <section className={styles.section}>
                <div className="container">
                    <h2 className={styles.heading}>Усі інструменти</h2>
                    <div className={styles.empty}>
      <h3 className={styles.title}>Інструментів не знайдено</h3>
      <p className={styles.text}>Спробуйте змінити параметри пошуку або зайдіть пізніше.</p>
    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.heading}>
                    Усі інструменти
                </h2>

                
                <div className={styles.grid}>
                    {tools.map((tool) => (
                        <ToolCard key={tool._id} tool={tool} />
                    ))}
                </div>
    {hasMore && (
        <div className={styles.buttonWrapper}>
            {loadingMore ? (
                <Loader />
            ) : (
                <button
                className={styles.viewButton}
                onClick={loadNextPage}
                >
                Показати більше
                </button>
            )}
        </div>
    )} 
            </div>
        </section>
    );
}