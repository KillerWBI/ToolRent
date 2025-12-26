"use client";

import Link from "next/link";
import styles from "./Footer.module.css";
import { useAuthStore } from "@/store/auth.store";
import ScrollToTop from "../ui/Button/Button";

export default function Footer() {
  const { isAuthenticated } = useAuthStore();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerNavigation}>
          <div className={styles.logowrapper}>
            <Link href="/">
              <svg
                className={styles.companyFooter}
                width={238}
                height={39}
                aria-label="Company logo"
              >
                <use href="/svg/sprite.svg#icon-custom-logo" />
              </svg>
            </Link>
          </div>

          <nav className={styles.nav}>
            <Link href="/">Головна</Link>
            <Link href="/tools">Інструменти</Link>
            {isAuthenticated ? (
              <>
                <Link href="/profile">Мій профіль</Link>
                <Link href="/create">Опублікувати оголошення</Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">Увійти</Link>
                <Link href="/auth/register">Зареєструватися</Link>
              </>
            )}
          </nav>

          <div className={styles.socialLink}>
            <a
              href="//facebook.com"
              target="_blank"
              aria-label="Facebook"
              className={styles.socialList}
              rel="noopener noreferrer"
            >
              <svg
                className={styles.logo}
                height={20}
                width={20}
              >
                <use href="/svg/sprite.svg#facebook" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              aria-label="Instagram"
              className={styles.socialList}
              rel="noopener noreferrer"
            >
              <svg
                className={styles.logo}
                height={20}
                width={20}
              >
                <use href="/svg/sprite.svg#instagram" />
              </svg>
            </a>
          </div>
        </div>

        <div className={styles.line}></div>
        <div className={styles.copy}>
          © {currentYear} ToolNext. Всі права захищені.
        </div>
      </div>
      <ScrollToTop />
    </footer>
  );
}
