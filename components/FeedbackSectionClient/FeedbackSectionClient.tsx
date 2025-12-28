"use client";

import { useEffect, useState } from "react";
import { FeedbackFormModal } from "../modal/FeedbackFormModal/FeedbackFormModal";
import FeedbacksBlock from "../home/FeedbacksBlock/FeedbacksBlock";
import { Feedback } from "@/types/feedback";
import { useAuthStore } from "@/store/auth.store";
import { AuthRequiredModal } from "../modal/AuthRequiredModal/AuthRequiredModal";
import { useRouter } from "next/navigation";

interface FeedbackClientModal {
  toolId: string;
  feedbacks: Feedback[];
}

export function FeedbackSectionClient({
  toolId,
  feedbacks,
}: FeedbackClientModal) {
  const { isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const openModal = () => setIsOpen(true);

  const closeModal = () => setIsOpen(false);
  const handleLoginClick = () => router.push(`/auth/login`);
  const handleRegisterClick = () => router.push(`/auth/register`);

  return (
    <>
      <FeedbacksBlock
        isShowFeedbackBtn={true}
        title={"Відгуки"}
        feedbacks={feedbacks}
        onOpenFeedbackModal={openModal}
      />
      {isOpen &&
        (!isAuthenticated ? (
          <AuthRequiredModal
            onRegisterBtn={handleRegisterClick}
            onLoginBtn={handleLoginClick}
            onCloseModal={closeModal}
            description={
              "Щоб залишити відгук, треба спочатку зареєструватись, або авторизуватись на платформі"
            }
          />
        ) : (
          <FeedbackFormModal
            toolId={toolId}
            onCloseModal={() => setIsOpen(false)}
          />
        ))}
    </>
  );
}
