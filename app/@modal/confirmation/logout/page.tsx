"use client";

import { useParams, useRouter } from "next/navigation";
import ConfirmationModal from "@/components/modal/ConfirmationModal/ConfirmationModal";
import { confirmConfig } from "@/lib/confirmConfig";

export default function LogoutModal() {
  const router = useRouter();
  const config = confirmConfig.logout;

  return (
    <ConfirmationModal
      title={config.title}
      confirmButtonText={config.confirmText}
      cancelButtonText={config.cancelText}
      variant={config.variant}
      onConfirm={async () => {
        await config.onConfirm();
      }}
    />
  );
}
