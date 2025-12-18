// components/tools/UserToolsGrid/UserToolsGrid.tsx
import ToolCard from "@/components/tools/ToolCard/ToolCard";
import type { Tool } from "@/types/tool";
import gridStyles from "@/components/tools/ToolsGrid/ToolsGrid.module.css";

type Props = {
  tools: Tool[];
};

export default function UserToolsGrid({ tools }: Props) {
  if (!tools.length) return null;

  return (
    <div className={gridStyles.grid}>
      {tools.map((tool) => (
        <ToolCard key={tool._id} tool={tool} />
      ))}
    </div>
  );
}
