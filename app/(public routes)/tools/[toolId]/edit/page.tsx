import AddEditToolForm from "@/components/forms/AddEditToolForm/AddEditToolForm";
import { getToolById } from "@/lib/api/tools";

type PageProps = {
  params: Promise<{ toolId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { toolId } = await params;

  if (!toolId) {
    return (
      <main className="container">
        <p>Інструмент не знайдено.</p>
      </main>
    );
  }

  let tool = null;
  try {
    tool = await getToolById(toolId);
  } catch (error) {
    console.error("Не вдалося завантажити інструмент: ", error);
  }

  if (!tool) {
    return (
      <main className="container">
        <p>Інструмент не знайдено.</p>
      </main>
    );
  }

  return (
    <main className="container">
      <AddEditToolForm mode="edit" initialTool={tool} />
    </main>
  );
}
