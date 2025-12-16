import ToolsGrid from "@/components/tools/ToolsGrid/ToolsGrid";

export const metadata = {
  title: "Усі інструменти | ToolNext",
  description: "Перегляньте всі доступні інструменти для оренди",
};

export default function Page() {
  return (
    <main>
      <ToolsGrid />
    </main>
  );
}

