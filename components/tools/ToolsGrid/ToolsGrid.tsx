'use client';

import { useState, useEffect } from "react";
import ToolCard from "@/components/tools/ToolCard/ToolCard";
import Loader from "@/components/ui/Loader/Loader";
import FilterBar from "../FilterBar/FilterBar";
import styles from "./ToolsGrid.module.css";
import { Tool } from "@/types/tool";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useToolsStore } from "@/store/tools.store";

interface ApiResponse {
  tools: Tool[];
  totalTools: number;
  totalPages: number;
  page: number;
  limit: number;
}


async function fetchToolsPage(
  page: number = 1,
  limit: number = 8,
  category?: string
): Promise<ApiResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (category && category !== "all") {
    params.set("category", category);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tools?${params.toString()}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch tools");
  }

  return res.json();
}


function useWindowWidth() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

export default function ToolsListBlock() {
    const width = useWindowWidth();
    const limit = width >= 1400 ? 16 : 8;

    const { get, set } = useQueryParams({ category: "all", page: 1, limit: 8});
    const category = get("category") as string;
    const pageFromUrl = Number(get("page") ?? 1);

    const [tools, setTools] = useState<Tool[]>([]);
    const [currentPage, setCurrentPage] = useState(pageFromUrl);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalTools, setTotalTools] = useState(0);
    const storeTools = useToolsStore((state) => state.tools);
    const setStoreTools = useToolsStore((state) => state.setTools);


  useEffect(() => {
    let isMounted = true;

    const loadFirstPage = async () => {
    setLoading(true);
    set("page", 1);

    try {
        const data = await fetchToolsPage(1, limit, category);
        if (!isMounted) return;

          setTools(data.tools);
           setStoreTools(data.tools);
        setTotalTools(data.totalTools);
        setHasMore(data.page < data.totalPages);
        setCurrentPage(data.page);
        setLoading(false);
      } catch (error) {
        if (isMounted) setLoading(false);
      }
    };

    loadFirstPage();

    return () => {
      isMounted = false;
    };
  }, [category, limit]);


  const loadNextPage = async () => {
    if (loadingMore || !hasMore) return;

    const nextPage = currentPage + 1;
    set("page", nextPage); 

    setLoadingMore(true);
    try {
      const data = await fetchToolsPage(nextPage, limit, category);
        setTools(prev => [...prev, ...data.tools]);
        setStoreTools([...tools, ...data.tools]);
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
            <p className={styles.text}>
              Спробуйте змінити параметри пошуку або зайдіть пізніше.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>Усі інструменти</h2>
        <FilterBar />

        <div className={styles.grid}>
          {tools.map(tool => (
            <ToolCard key={tool._id} tool={tool} />
          ))}
        </div>

        {hasMore && (
          <div className={styles.buttonWrapper}>
            {loadingMore ? (
              <Loader />
            ) : (
              <button className={styles.viewButton} onClick={loadNextPage}>
                Показати більше
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
