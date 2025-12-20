"use client";

import ConfirmationModal from "@/components/modal/ConfirmationModal/ConfirmationModal";
import { confirmConfig } from "@/lib/confirmConfig";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function DeleteModal() {
  const { id } = useParams();
  const config = confirmConfig.delete;
  const [open, setOpen] = useState(true);

  const uiVariant: "danger" | "default" =
    config.variant === "delete" ? "danger" : "default";

  return (
    <ConfirmationModal
      open={open}
      title={config.title}
      confirmButtonText={config.confirmText}
      cancelButtonText={config.cancelText}
      variant={uiVariant}
      onConfirm={async () => {
        await config.onConfirm(id as string);
        setOpen(false);
      }}
      onCancel={() => setOpen(false)}
    />
  );
}
