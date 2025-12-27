"use client";

import { useEffect, useState } from "react";
import FeedbacksBlock from "../home/FeedbacksBlock/FeedbacksBlock";
import { FeedbackFormModal } from "../modal/FeedbackFormModal/FeedbackFormModal";
import { Feedback } from "@/types/feedback";

interface FeedbackClientModal {
  feedbacks: Feedback[];
  toolId: string;
}

export function FeedbackClientModal({
  feedbacks,
  toolId,
}: FeedbackClientModal) {
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* <FeedbacksBlock
        feedbacks={feedbacks}
        // onLeaveFeedback={() => setOpen(true)}
      /> */}

      {mounted && open && (
        <FeedbackFormModal
          toolId={toolId}
          onCloseModal={() => setOpen(false)}
        />
      )}
    </>
  );
}
