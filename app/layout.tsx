// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    weight: ["400", "500", "600", "700"], // Regular, Medium, SemiBold, Bold
    subsets: ["latin", "cyrillic"],
    display: "swap",
    variable: "--font-Inter",
});

export const metadata: Metadata = {
    title: {
        template: "%s | ToolNext",
        default: "ToolNext — Оренда професійних інструментів",
    },
    description:
        "Зручний сервіс для оренди та здачі будівельних інструментів. Широкий вибір категорій, чесні рейтинги та відгуки. Знайдіть потрібний інструмент або заробляйте на власному обладнанні.",
    openGraph: {
        title: "ToolNext — Оренда професійних інструментів",
        description:
            "Платформа для оренди інструментів. Дрилі, пили, генератори та інше обладнання для вашого ремонту та будівництва.",
        siteName: "ToolNext",
        locale: "uk_UA",
        type: "website",
    },
};

export default function RootLayout({
    children,
    modal,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable}`}>
                <main>{children}</main>
                {modal}
            </body>
        </html>
    );
}
