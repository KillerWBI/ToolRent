import { ToolGallery } from "@/components/tools/ToolGallery/ToolGallery";
import { ToolInfoBlock } from "@/components/tools/ToolInfoBlock/ToolInfoBlock";
import css from "./page.module.css";
import { getToolById } from "@/lib/api/tools";
import { getPublicUserById } from "@/lib/api/users";
import { useAuthStore } from "@/store/auth.store";

interface DetailsPageProps {
    params: Promise<{ toolId: string }>;
}

export default async function DetailsPage({ params }: DetailsPageProps) {
    const { toolId } = await params;

    const tool = await getToolById(toolId);

    if (!tool) {
        return (
            <div className="container">
                <p>Інструмент не знайдено.</p>
            </div>
        );
    }

    const owner = await getPublicUserById(tool.owner);

    return (
        <div className="container">
            <div className={css.detailsPage}>
                <ToolGallery tool={tool} />
                <ToolInfoBlock tool={tool} owner={owner} />
            </div>
        </div>
    );
}
