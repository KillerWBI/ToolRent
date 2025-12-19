import type { Metadata } from "next";
import css from "./Home.module.css";

export const metadata: Metadata = {
  title: "not-found ToolNext",
  description: "ToolNext - сервіс оренди інструментів",
  openGraph : {
    title: 'ToolNext - Page Not Found',
    description: "Платформа для оренди інструментів. Дрилі, пили, генератори та інше обладнання для вашого ремонту та будівництва.",
  },
};


export default function NotFoundPage() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
}
