"use client";

import Link from "next/link";
import { useState } from "react";
import MobileMenu from "../MobileMenu/MobileMenu";
import styles from "./Header.module.css";

// Временно
const isAuth = false;
const user = { name: "Сергій" };

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerNavigation}>
          <div className={styles.logoWrapper}>
            <Link href="/">
              <img
                src="/svg/company-logo.svg"
                alt="Company logo"
                className={styles.companyHeder}
                width={124}
                height={20}
              />
            </Link>
          </div>

          {/* Десктопная навигация */}
          <nav className={styles.navHeader}>
            <Link href="/">Головна</Link>
            <Link href="/tools">Інструменти</Link>
            {isAuth ? (
              <>
                <Link href="/profile">Мій профіль</Link>
                <Link href="/create">Опублікувати оголошення</Link>
              </>
            ) : (
              <>
                <Link href="/login">Увійти</Link>
                <Link href="/register">Зареєструватися</Link>
              </>
            )}
          </nav>

          {/* Бургер-кнопка */}
          <button
            className={styles.burger}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
          >
            <svg className={styles.icon}>
              <use href={`/svg/sprite.svg#${isOpen ? "close" : "menu"}`} />
            </svg>
          </button>
          {/* Мобильное меню */}
          <MobileMenu
            isOpen={isOpen}
            isAuth={isAuth}
            onClose={() => setIsOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}
