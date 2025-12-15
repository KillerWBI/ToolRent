"use client";

import Link from "next/link";
import styles from "./Header.module.css";

// тимчасово, потім заміниш на auth store / context
const isAuth = false;
const user = { name: "Сергій" };

export default function Header() {
  return (
    <header className={styles.header}>
      {/* ЛОГО */}
      <Link
        href="/"
        className={styles.logo}
      >
        LOGO
      </Link>

      {/* НАВІГАЦІЯ (desktop) */}
      <nav className={styles.nav}>
        <Link href="/">Головна</Link>
        <Link href="/tools">Інструменти</Link>

        {isAuth && (
          <>
            <Link href="/profile">Мій профіль</Link>
            <Link href="/create">Опублікувати</Link>
          </>
        )}
      </nav>

      {/* AUTH BLOCK */}
      {!isAuth ? (
        <div className={styles.auth}>
          <Link href="/auth/login">Увійти</Link>
          <Link
            href="/auth/register"
            className={styles.primary}
          >
            Зареєструватися
          </Link>
        </div>
      ) : (
        <div className={styles.user}>
          <div className={styles.avatar}>{user.name[0]}</div>
          <span>{user.name}</span>

          <button className={styles.logout}>Вихід</button>
        </div>
      )}

      {/* BURGER MENU (tablet / mobile) */}
      <button className={styles.burger}>☰</button>
    </header>
  );
}
