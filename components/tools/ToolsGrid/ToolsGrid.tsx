import styles from "./ToolsGrid.module.css";
import ToolCard from "@/components/tools/ToolCard/ToolCard";
import type { Tool } from "@/types/tool";

type Props = {
  tools?: Tool[];
};

export default function ToolsGrid({ tools = [] }: Props) {
  if (!Array.isArray(tools) || tools.length === 0) {
    return null;
  }

  return (
    <div className={styles.grid}>
      {tools.map((tool) => (
        <ToolCard key={tool._id} tool={tool} />
      ))}
    </div>
  );
}
//цей файл я создав для тесту, можете його змінювати 