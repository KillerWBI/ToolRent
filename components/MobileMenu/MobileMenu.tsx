"use client";

import Link from "next/link";
import styles from "./MobileMenu.module.css";
import { useAuthStore } from "@/store/auth.store";
import { PublicUser } from "@/types/user";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isOpen) return null;

  const userTyped = user as PublicUser | null;
  const firstLetter = user?.name?.charAt(0).toUpperCase() || "U";

  const handleLogout = () => {
    logout();
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

          {isAuthenticated ? (
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
                className={styles.socialButton}
              >
                Опублікувати оголошення
              </Link>

              {/* Блок пользователя */}
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

                <span className={styles.userName}>{user?.name || "User"}</span>
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
                className={styles.socialButton}
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
