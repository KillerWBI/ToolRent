// components/tools/UserToolsGrid/UserToolsGrid.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import ToolCard from "@/components/tools/ToolCard/ToolCard";
import type { Tool } from "@/types/tool";
import gridStyles from "@/components/tools/ToolsGrid/ToolsGrid.module.css";
import { useProfileToolsStore } from "@/store/profileTools.store";

type Props = {
  tools: Tool[];
};

const PAGE_SIZE = 8;

export default function UserToolsGrid({ tools }: Props) {
  const storeTools = useProfileToolsStore((state) => state.tools);
  const setStoreTools = useProfileToolsStore((state) => state.setTools);
  const removeFromStore = useProfileToolsStore((state) => state.removeTool);
  const resetStore = useProfileToolsStore((state) => state.reset);

  // ✅ скільки показуємо зараз
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Ініціалізуємо стор даними профіля, щоб видалення відображались одразу
  useEffect(() => {
    setStoreTools(tools && tools.length ? tools : []);
    setVisibleCount(PAGE_SIZE);

    return () => {
      resetStore();
    };
  }, [tools, setStoreTools, resetStore]);

  const renderList = useMemo(() => {
    const list = storeTools.length ? storeTools : tools;
    return list.slice(0, visibleCount);
  }, [storeTools, tools, visibleCount]);

  const totalListLength = (storeTools.length ? storeTools : tools).length;
  const hasMore = visibleCount < totalListLength;

  if (!renderList.length) return null;

  return (
    <>
      <div className={gridStyles.grid}>
        {renderList.map((tool) => (
          <ToolCard
            key={tool._id}
            tool={tool}
            onDeleted={(id) => removeFromStore(id)}
          />
        ))}
      </div>

      {hasMore && (
        <div className={gridStyles.loadMoreWrap}>
          <button
            className={gridStyles.loadMoreBtn}
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
          >
            Показати більше
          </button>
        </div>
      )}
    </>
  );
}
