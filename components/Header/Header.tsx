"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import MobileMenu from "../MobileMenu/MobileMenu";
import styles from "./Header.module.css";
import { PublicUser } from "@/types/user";

export default function Header() {
  const { user, isAuthenticated, loading, logout } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (loading) return null;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/");
  };

  const userTyped = user as PublicUser | null;
  const firstLetter = userTyped?.name?.charAt(0).toUpperCase() || "U";

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerNavigation}>
          {/* Логотип */}
          <div className={styles.logoWrapper}>
            <Link href="/">
              <svg width={162} height={26} aria-label="Company logo">
                <use href="/svg/sprite.svg#icon-custom-logo" />
              </svg>
            </Link>
          </div>

          {/* Навигация */}
          <div className={styles.navUserWrapper}>
            <nav className={styles.navHeader}>
              <Link href="/" className={styles.headLink}>
                Головна
              </Link>
              <Link href="/tools" className={styles.headLink}>
                Інструменти
              </Link>

              {isAuthenticated ? (
                <>
                  <Link href="/profile" className={styles.headLink}>
                    Мій профіль
                  </Link>
                  <Link href="/create" className={styles.socialButton}>
                    Опублікувати оголошення
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className={styles.headLink}>
                    Увійти
                  </Link>
                  <Link href="/auth/register" className={styles.listButton}>
                    Зареєструватися
                  </Link>
                </>
              )}
            </nav>

            {/* Блок пользователя */}
            {isAuthenticated && (
              <div className={styles.userBlock}>
                <div className={styles.userAvatar}>
                  {userTyped?.avatar ? (
                    <img
                      src={userTyped.avatar}
                      alt={userTyped.name}
                      className={styles.avatarImage}
                    />
                  ) : (
                    <span
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      {firstLetter}
                    </span>
                  )}
                </div>

                <span className={styles.userName}>
                  {userTyped?.name || "User"}
                </span>

                <span className={styles.separator}></span>

                <button
                  className={styles.logoutBtn}
                  onClick={handleLogout}
                  aria-label="Вихід"
                >
                  <svg
                    className={styles.logoutIcon}
                    width={18}
                    height={18}
                    aria-hidden="true"
                  >
                    <use href="/svg/sprite.svg#logout" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Бургер для мобильного меню */}
          <button
            className={styles.burger}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Відкрити меню"
          >
            <svg className={styles.icon} width={40} height={40}>
              <use href="/svg/sprite.svg#menu" />
            </svg>
          </button>

          {/* Мобильное меню */}
          <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
      </div>
    </header>
  );
}
