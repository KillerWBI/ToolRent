import BenefitsBlock from "@/components/home/BenefitsBlock/BenefitsBlock";
import FeaturedToolsBlock from "@/components/home/FeaturedToolsBlock/FeaturedToolsBlock";
import RegistrationBlock from "@/components/home/RegistrationBlock/RegistrationBlock";
import FeedbacksBlock from "../components/home/FeedbacksBlock/FeedbacksBlock";
import { getFeedbacks } from "@/lib/api/feedbacks";


const feedbacks = await getFeedbacks();

export const metadata = {
    title: "ToolNext - Оренда інструментів",
    description: "Знайдіть потрібний інструмент або здайте свій в оренду",
};

export default function HomePage() {
    return (
        <main>
            <BenefitsBlock />
            <FeaturedToolsBlock />
            <FeedbacksBlock feedbacks={feedbacks} />
            <RegistrationBlock />
        </main>
    );
}
