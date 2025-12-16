import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerNavigation}>
          <div className={styles.logowrapper}>
            <Link href="/">
              <img
                src="/svg/company-logo.svg"
                alt="Company logo"
                className={styles.companyFooter}
                width={238}
                height={39}
              />
            </Link>
          </div>
          <nav className={styles.nav}>
            <Link href="/">Головна</Link>
            <Link href="/tools">Інструменти</Link>
            <Link href="/login">Увійти</Link>
            <Link href="/register">Зареєструватися</Link>
          </nav>
          <div className={styles.socialLink}>
            <svg
              className={styles.logo}
              height={20}
              width={20}
            >
              <use href="/svg/sprite.svg#facebook" />
            </svg>
            <svg
              className={styles.logo}
              height={20}
              width={20}
            >
              <use href="/svg/sprite.svg#instagram" />
            </svg>
          </div>
        </div>
        <div className={styles.line}></div>
        <div className={styles.copy}>© 2025 ToolNext. Всі права захищені.</div>
      </div>
    </footer>
  );
}
