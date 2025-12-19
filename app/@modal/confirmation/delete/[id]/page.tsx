"use client";

import { useParams, useRouter } from "next/navigation";
import ConfirmationModal from "@/components/modal/ConfirmationModal/ConfirmationModal";
import { confirmConfig } from "@/lib/confirmConfig";

export default function DeleteModal() {
  const { id } = useParams();
  const router = useRouter();
  const config = confirmConfig.delete;

  return (
    <ConfirmationModal
      title={config.title}
      confirmButtonText={config.confirmText}
      cancelButtonText={config.cancelText}
      variant={config.variant}
      onConfirm={async () => {
        await config.onConfirm(id as string);
      }}
    />
  );
}
