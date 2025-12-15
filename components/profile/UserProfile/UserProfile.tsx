import type { PublicUser } from "@/types/user";
import styles from "./UserProfile.module.css";

type Props = {
  user: PublicUser;
};

export default function UserProfile({ user }: Props) {
  const letter = (user?.name?.trim()?.[0] || "?").toUpperCase();
  const hasAvatar = Boolean((user as any)?.avatarUrl);

  return (
    <div className={styles.wrap}>
      {hasAvatar ? (
        <img
          className={styles.avatarImg}
          src={(user as any).avatarUrl}
          alt={user.name}
          width={96}
          height={96}
          loading="lazy"
        />
      ) : (
        <div className={styles.avatarLetter} aria-label={`Аватар ${user.name}`}>
          {letter}
        </div>
      )}

      <h1 className={styles.name}>{user.name}</h1>
    </div>
  );
}
