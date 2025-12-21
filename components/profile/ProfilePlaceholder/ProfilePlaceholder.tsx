// components/profile/ProfilePlaceholder/ProfilePlaceholder.tsx
import Link from "next/link";
import styles from "./ProfilePlaceholder.module.css";

type Props = {
  isAuthorized?: boolean;
};

export default function ProfilePlaceholder({ isAuthorized = false }: Props) {
  return (
    <div className={styles.wrap}>
      <p className={styles.text}>
        У цього користувача ще не опубліковано жодного інструменту
      </p>

      {isAuthorized ? (
        <>
          <p className={styles.subtext}>
            Опублікуйте свій перший інструмент та почніть заробляти
          </p>
          <Link className={styles.btn} href="/create">
            Опублікувати інструмент
          </Link>
        </>
      ) : (
        <>
          <p className={styles.subtext}>
            У нас є великий вибір інструментів від інших користувачів
          </p>
          <Link className={styles.btn} href="/tools">
            Всі інструменти
          </Link>
        </>
      )}
    </div>
  );
}
