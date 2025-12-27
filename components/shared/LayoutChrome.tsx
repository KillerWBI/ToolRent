"use client";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import styles from "./LayoutChrome.module.css";

type LayoutChromeProps = PropsWithChildren<{
  modal?: React.ReactNode;
}>;

const AUTH_PATHS = ["/auth/login", "/auth/register"];

export default function LayoutChrome({ children, modal }: LayoutChromeProps) {
  const pathname = usePathname();
  const hideChrome = AUTH_PATHS.some((path) => pathname?.startsWith(path));

  if (hideChrome) {
    return (
      <>
        <main>{children}</main>
        {modal}
      </>
    );
  }

  return (
    <div className={styles.appLayout}>
      <Header />

      <main className={styles.appMain}>{children}</main>

      {modal}

      <Footer />
    </div>
  );
}
