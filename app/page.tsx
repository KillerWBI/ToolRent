import BenefitsBlock from "@/components/home/BenefitsBlock/BenefitsBlock";
import FeaturedToolsBlock from "@/components/home/FeaturedToolsBlock/FeaturedToolsBlock";
import RegistrationBlock from "@/components/home/RegistrationBlock/RegistrationBlock";

export const metadata = {
    title: "ToolNext - Оренда інструментів",
    description: "Знайдіть потрібний інструмент або здайте свій в оренду",
};

export default function HomePage() {
    return (
        <main>
            <BenefitsBlock />
            <FeaturedToolsBlock />
            <RegistrationBlock />
        </main>
    );
}
