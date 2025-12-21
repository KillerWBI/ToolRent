"use client";

import ConfirmationModal from "@/components/modal/ConfirmationModal/ConfirmationModal";
import { confirmConfig } from "@/lib/confirmConfig";

// export default function LogoutModal() {
//   const router = useRouter();
//   const config = confirmConfig.logout;

//   return (
//     <ConfirmationModal
//       title={config.title}
//       confirmButtonText={config.confirmText}
//       cancelButtonText={config.cancelText}
//       variant={config.variant}
//       onConfirm={async () => {
//         await config.onConfirm();
//       }}
//     />
//   );
// }
interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LogoutModal({ open, onClose }: LogoutModalProps) {
  const config = confirmConfig.logout;
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
        onClose(); // закрываем через родителя
      }}
      onCancel={onClose} // закрываем через родителя
    />
  );
}
