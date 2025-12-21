"use client";

import ConfirmationModal from "@/components/modal/ConfirmationModal/ConfirmationModal";
import { confirmConfig } from "@/lib/confirmConfig";
import { useState } from "react";

export default function LogoutModal() {
  const config = confirmConfig.logout;
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
        await config.onConfirm();
        setOpen(false);
      }}
      onCancel={() => setOpen(false)}
    />
  );
}
