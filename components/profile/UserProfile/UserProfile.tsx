// components/profile/UserProfile/UserProfile.tsx
import Image from "next/image";
import type { PublicUser } from "@/lib/api/users";
import styles from "./UserProfile.module.css";

type Props = {
  user: PublicUser;
};

export default function UserProfile({ user }: Props) {
  const letter = (user?.name?.trim()?.[0] || "?").toUpperCase();
  const hasAvatar = Boolean(user.avatarUrl);

  return (
    <div className={styles.wrap}>
      {hasAvatar ? (
        <Image
          className={styles.avatarImg}
          src={user.avatarUrl as string}
          alt={user.name}
          width={96}
          height={96}
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
