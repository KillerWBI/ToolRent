import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.logowrapper}>
          <img
            src="svg/logo.svg"
            alt="ToolNext"
            className={styles.logo}
          />
        </div>
        <nav className={styles.nav}>
          <a href="/">Головна</a>
          <a href="/tools">Інструменти</a>
          <a href="#">Увійти</a>
          <a href="#">Зареєствуватися</a>
        </nav>
        <div className={styles.logowrapper}>
          <img
            src="svg/Vector-1.svg"
            alt="ToolNext"
            className={styles.logo}
          />
          <img
            src="svg/Vector-2.svg"
            alt="ToolNext"
            className={styles.logo}
          />
        </div>
        <div className={styles.line}></div>
        <div className={styles.copy}>© 2025 ToolNext. Всі права захищені.</div>
      </div>
    </footer>
  );
}
