import { ToolGallery } from "@/components/tools/ToolGallery/ToolGallery";
import { ToolInfoBlock } from "@/components/tools/ToolInfoBlock/ToolInfoBlock";
import css from "./page.module.css";
import { getToolById } from "@/lib/api/tools";
import { getPublicUserById } from "@/lib/api/users";
import { FeedbackSectionClient } from "@/components/FeedbackSectionClient/FeedbackSectionClient";
import { getFeedbacksByToolId } from "@/lib/api/feedbacks";
import { Metadata } from "next";

interface DetailsPageProps {
  params: Promise<{ toolId: string }>;
}

export async function generateMetadata({
  params,
}: DetailsPageProps): Promise<Metadata> {
  const { toolId } = await params;
  const tool = await getToolById(toolId);

  return {
    title: `${tool?.name}`,
    description: `${tool?.description.slice(0, 60)}`,
    openGraph: {
      title: `${tool?.name}`,
      description: `${tool?.description.slice(0, 60)}`,
      url: `https://tool-next-mauve.vercel.app/tools/${toolId}`,
      images: [
        {
          url: `${tool?.images}`,
          width: 1200,
          height: 630,
          alt: "Tool image",
        },
      ],
    },
  };
}

export default async function DetailsPage({ params }: DetailsPageProps) {
  const { toolId } = await params;

  const tool = await getToolById(toolId);
  const feedbacksById = await getFeedbacksByToolId(toolId);

  if (!tool) {
    return (
      <div className="container">
        <p>Інструмент не знайдено.</p>
      </div>
    );
  }

  const owner = await getPublicUserById(tool.owner);

  return (
    <>
      <div className="container">
        <div className={css.detailsPage}>
          <div className={css.detailsPageWrap}>
            <ToolGallery tool={tool} />
            <ToolInfoBlock tool={tool} owner={owner} />
          </div>
        </div>
        <FeedbackSectionClient feedbacks={feedbacksById} toolId={toolId} />
      </div>
    </>
  );
}
