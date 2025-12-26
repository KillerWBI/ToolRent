"use client";

import { useState } from "react";
import FeedbacksBlock from "../home/FeedbacksBlock/FeedbacksBlock";
import { FeedbackFormModal } from "../modal/FeedbackFormModal/FeedbackFormModal";
import { Feedback } from "@/types/feedback";

interface FeedbackClientModal {
  feedbacks: Feedback[];
}

export function FeedbackClientModal({ feedbacks }: FeedbackClientModal) {
  const [open, setOpen] = useState(true);

  return (
    <>
      <FeedbacksBlock
        feedbacks={feedbacks}
        // onLeaveFeedback={() => setOpen(true)}
      />

      {open && <FeedbackFormModal onCloseModal={() => setOpen(false)} />}
    </>
  );
}
