"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import MobileMenu from "../MobileMenu/MobileMenu";
import styles from "./Header.module.css";

// Временно


export default function Header() {
const {user, isAuthenticated} = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerNavigation}>
          <div className={styles.logoWrapper}>
            <Link href="/">
              <img
                src="/svg/logo.svg"
                alt="LOGO"
                className={styles.logo}
                height={20}
              />
            </Link>
          </div>

          {/* Десктопная навигация */}
          <nav className={styles.navHeader}>
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

          {/* Бургер-кнопка */}
          <button
            className={styles.burger}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Мобильное меню */}
          <MobileMenu
            isOpen={isOpen}
            isAuth={isAuthenticated}
            onClose={() => setIsOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}
