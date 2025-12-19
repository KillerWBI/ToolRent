"use client";

import { useParams, useRouter } from "next/navigation";
import ConfirmationModal from "@/components/modal/ConfirmationModal/ConfirmationModal";
import { confirmConfig } from "@/lib/confirmConfig";

export default function DeleteModal() {
  const { _id } = useParams();
  const router = useRouter();
  const config = confirmConfig.delete;
  const id = Array.isArray(_id) ? _id[0] : _id;

  return (
    <ConfirmationModal
      open={true}
      title={config.title}
      confirmButtonText={config.confirmText}
      cancelButtonText={config.cancelText}
      variant={config.variant}
      onConfirm={async () => {
        await config.onConfirm(id); // 🔥 delete API
        router.refresh(); // 🔄 оновити список
        router.back(); // ❌ закрити модалку
      }}
      onCancel={() => router.back()}
    />
  );
}
