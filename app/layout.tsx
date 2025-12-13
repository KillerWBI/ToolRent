// app/layout.tsx
import Footer from "@/components/layout/Footer/Footer";
import Header from "@/components/layout/Header/Header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const roboto = Inter({
  weight: ["400", "500", "700"], // какие начертания нужны
  subsets: ["latin", "cyrillic"], // можно оставить только "latin", если кириллица не нужна
  display: "swap",               // чтобы не было задержки при загрузке
  variable: "--font-Inter",     // создаст CSS-переменную для использования
});


export const metadata: Metadata = {
  title: "Tools – Create Tools",
  description: "Create, organize and manage your notes easily with Tools.",
  openGraph: {
    title: "NoteHub – Create Tools",
    description: "Create, organize and manage your notes easily with Tools.",
    url: "",
    images: [
      {
        url: "",
        width: 1200,
        height: 630,
        alt: "Tools gifts",
      },
    ],
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
          <Header/>
            <main>{children}</main>
            {modal}
          <Footer/>
      </body>
    </html>
  );
}
