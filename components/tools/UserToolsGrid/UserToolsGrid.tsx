// components/tools/UserToolsGrid/UserToolsGrid.tsx
"use client";

import { useEffect } from "react";
import ToolCard from "@/components/tools/ToolCard/ToolCard";
import type { Tool } from "@/types/tool";
import gridStyles from "@/components/tools/ToolsGrid/ToolsGrid.module.css";
import { useProfileToolsStore } from "@/store/profileTools.store";

type Props = {
  tools: Tool[];
};

export default function UserToolsGrid({ tools }: Props) {
  const storeTools = useProfileToolsStore((state) => state.tools);
  const setStoreTools = useProfileToolsStore((state) => state.setTools);
  const removeFromStore = useProfileToolsStore((state) => state.removeTool);
  const resetStore = useProfileToolsStore((state) => state.reset);

  // Инициализируем стор данными профиля, чтобы удаления отражались сразу
  useEffect(() => {
    if (tools && tools.length) {
      setStoreTools(tools);
    } else {
      setStoreTools([]);
    }
    return () => {
      resetStore();
    };
  }, [tools, setStoreTools, resetStore]);

  const renderList = storeTools.length ? storeTools : tools;
  if (!renderList.length) return null;

  return (
    <div className={gridStyles.grid}>
      {renderList.map((tool) => (
        <ToolCard
          key={tool._id}
          tool={tool}
          onDeleted={(id) => removeFromStore(id)}
        />
      ))}
    </div>
  );
}
