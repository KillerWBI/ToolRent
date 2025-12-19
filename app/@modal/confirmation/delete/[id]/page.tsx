"use client";

import ConfirmationModal from "@/components/modal/ConfirmationModal/ConfirmationModal";
import { confirmConfig } from "@/lib/confirmConfig";
import { useParams } from "next/navigation";

export default function DeleteModal() {
  const { id } = useParams();
  const config = confirmConfig.delete;
const uiVariant =
  config.variant === "delete" ? "danger" : "default";

  return (
    <ConfirmationModal
  title={config.title}
  confirmButtonText={config.confirmText}
  cancelButtonText={config.cancelText}
  variant={config.variant === "delete" ? "danger" : "default"}
  onConfirm={async () => {
    await config.onConfirm(id as string);
  }}
/>
  );
}
