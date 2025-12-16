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
        <div className={styles.burgerHeader}>
          <Link href="/">
            <img
              src="/svg/logo.svg"
              alt="LOGO"
              className={styles.logo}
              height={20}
            />
          </Link>

          {/* Крестик для закрытия */}
          <button
            className={`${styles.closeButton} ${isOpen ? styles.open : ""}`}
            onClick={onClose}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Ссылки */}
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
