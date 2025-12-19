"use client";

import ConfirmationModal from "@/components/modal/ConfirmationModal/ConfirmationModal";
import { confirmConfig } from "@/lib/confirmConfig";

export default function LogoutModal() {
  const config = confirmConfig.logout;
const uiVariant =
  config.variant === "delete" ? "danger" : "default";

  return (
    <ConfirmationModal
  title={config.title}
  confirmButtonText={config.confirmText}
  cancelButtonText={config.cancelText}
  variant="default"
  onConfirm={async () => {
    await config.onConfirm();
  }}
/>
  );
}
