"use client";

import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/modal/ConfirmationModal/ConfirmationModal";
import { confirmConfig } from "@/lib/confirmConfig";
import { useAuthStore } from "@/store/auth.store";

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
export default function LogoutModal() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const config = confirmConfig.logout;

  return (
    <ConfirmationModal
      open={true}
      // message={}
      title={config.title}
      confirmButtonText={config.confirmText}
      cancelButtonText={config.cancelText}
      variant={config.variant}
      onConfirm={async () => {
        await logout();
        router.back(); // закриває модалку
      }}
      onCancel={() => router.back()}
    />
  );
}
