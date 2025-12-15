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
          <Link href="/">Головна</Link>
          <Link href="/tools">Інструменти</Link>
          {isAuth ? (
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
      </div>
    </div>
  );
}
