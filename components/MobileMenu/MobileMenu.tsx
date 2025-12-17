"use client";

import Link from "next/link";
import styles from "./MobileMenu.module.css";
import { PublicUser } from "@/types/user";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user?: PublicUser | null;
  isAuth?: boolean;
  logout?: () => void; // передаем из Header
}

export default function MobileMenu({
  isOpen,
  onClose,
  user,
  isAuth,
  logout,
}: MobileMenuProps) {
  if (!isOpen) return null;

  const firstLetter = user?.name?.charAt(0).toUpperCase() || "U";

  const handleLogout = () => {
    if (logout) logout();
    onClose();
  };

  return (
    <div className={styles.mobileMenu}>
      <div className="container">
        {/* Логотип + кнопка закрытия */}
        <div className={styles.headerNavigation}>
          <Link
            href="/"
            onClick={onClose}
          >
            <svg
              width={162}
              height={26}
              aria-label="Company logo"
            >
              <use href="/svg/sprite.svg#icon-custom-logo" />
            </svg>
          </Link>

          <button
            className={styles.burger}
            onClick={onClose}
            aria-label="Закрити меню"
          >
            <svg
              width={24}
              height={24}
            >
              <use href="/svg/sprite.svg#close" />
            </svg>
          </button>
        </div>

        {/* Навигация */}
        <nav className={styles.navMobile}>
          <Link
            href="/"
            onClick={onClose}
          >
            Головна
          </Link>
          <Link
            href="/tools"
            onClick={onClose}
          >
            Інструменти
          </Link>

          {isAuth ? (
            <>
              <Link
                href="/profile"
                onClick={onClose}
              >
                Мій профіль
              </Link>
              <Link
                href="/create"
                onClick={onClose}
              >
                Опублікувати оголошення
              </Link>

              {/* Блок пользователя */}
              <div className={styles.userBlock}>
                <div className={styles.userAvatar}>
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
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

                <span className={styles.userName}>{user?.name || "User"}</span>

                {/* Separator */}
                <span className={styles.separator}></span>

                <button
                  className={styles.logoutBtn}
                  onClick={handleLogout}
                  aria-label="Вийти"
                >
                  Вийти
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={onClose}
              >
                Увійти
              </Link>
              <Link
                href="/auth/register"
                onClick={onClose}
              >
                Зареєструватися
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
