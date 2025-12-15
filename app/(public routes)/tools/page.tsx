// export default function Page() {
//   return null;
// }

// змінив щоб протестувати FilterBar на сторінці інструментів
import { getTools } from "@/lib/api/tools";
import FilterBar from "@/components/tools/FilterBar/FilterBar";
import ToolsGrid from "@/components/tools/ToolsGrid/ToolsGrid";

export default async function ToolsPage({ searchParams }: any) {
  const category = searchParams?.category || undefined;

  const data = await getTools({
    category,
    limit: 50,
    page: 1,
  });

  return (
    <div>
      <FilterBar />
      <ToolsGrid tools={data.tools} />
    </div>
  );
}
