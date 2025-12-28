"use client";

import { Tool } from "@/types/tool";
import { PublicUser } from "@/types/user";
import Link from "next/link";
import css from "./ToolInfoBlock.module.css";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthRequiredModal } from "@/components/modal/AuthRequiredModal/AuthRequiredModal";

type ToolInfoBlockProps = {
  tool: Tool;
  owner: PublicUser;
};

export const ToolInfoBlock = ({ tool, owner }: ToolInfoBlockProps) => {
  const { isAuthenticated } = useAuthStore();

  const router = useRouter();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const specifications = Object.entries(tool.specifications ?? {});

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRentClick = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    router.push(`/dashboard/booking/${tool._id}`);
  };

  const closeModal = () => setIsAuthModalOpen(false);
  const handleLoginClick = () => router.push(`/auth/login`);
  const handleRegisterClick = () => router.push(`/auth/register`);

  if (!mounted) return null;

  return (
    <>
      <div className={css.wrapper}>
        <h2 className={css.title}>{tool.name}</h2>
        <p className={css.price}>{tool.pricePerDay} грн/день</p>

        <div className={css.userProfile}>
          <div className={css.userIconWrap}>
            <img
              className={css.avatar}
              src={owner.avatarUrl}
              alt={owner.name}
            />
          </div>

          <div className={css.userInfo}>
            <p className={css.userName}>{owner.name}</p>
            <Link
              href={`/profile/${owner._id}`}
              className={css.profileBtn}
              type="button">
              Переглянути профіль
            </Link>
          </div>
        </div>

        <p className={css.description}>{tool.description}</p>

        <ul className={css.specificationsList}>
          {specifications.map(([label, value], index) => (
            <li key={index} className={css.specItem}>
              <span className={css.speclabel}>{label}: </span>
              {value}
            </li>
          ))}
        </ul>

        <button onClick={handleRentClick} className={css.rentBtn}>
          Забронювати
        </button>
      </div>
      {isAuthModalOpen && (
        <AuthRequiredModal
          onRegisterBtn={handleRegisterClick}
          onLoginBtn={handleLoginClick}
          onCloseModal={closeModal}
          description={
            "Щоб забрронювати інструмент, треба спочатку зареєструватись, або авторизуватись на платформі"
          }
        />
      )}
    </>
  );
};
