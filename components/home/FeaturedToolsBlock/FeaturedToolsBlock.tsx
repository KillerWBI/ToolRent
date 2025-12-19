import { Suspense } from "react";
import Loader from "@/components/ui/Loader/Loader";
import FeaturedToolsClient from "./FeaturedToolsClient";
import styles from "./FeaturedToolsBlock.module.css";
import { getFeaturedTools } from "@/lib/api/featuredTools";

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

  return <FeaturedToolsClient initialTools={tools} />;
}
