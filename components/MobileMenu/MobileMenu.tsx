"use client";

import Link from "next/link";
import styles from "./MobileMenu.module.css";

interface MobileMenuProps {
  isOpen: boolean;
  isAuth: boolean;
  onClose: () => void;
}

export default function MobileMenu({
  isOpen,
  isAuth,
  onClose,
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.mobileMenu}>
      <div className="container">
        {/* Навигация мобильного меню */}
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
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
              >
                Увійти
              </Link>
              <Link
                href="/register"
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
