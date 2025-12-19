import { ConfirmType, ConfirmVariant } from "@/types/confirm";

type ConfirmConfigItem = {
  title: string;
  confirmText: string;
  cancelText: string;
  variant: ConfirmVariant;
  onConfirm: (id?: string) => Promise<void>;
};

export const confirmConfig: Record<ConfirmType, ConfirmConfigItem> = {
  logout: {
    title: "Ви впевнені, що хочете вийти?",
    confirmText: "Вийти",
    cancelText: "Залишитись",
    variant: "default",
    onConfirm: async () => {
      await fetch("/api/auth/logout", { method: "POST" });
    },
  },

  delete: {
    title: "Ви впевнені, що хочете видалити інструмент?",
    confirmText: "Видалити",
    cancelText: "Скасувати",
    variant: "delete",
    onConfirm: async (id?: string) => {
      if (!id) throw new Error("Missing id");
      const res = await fetch(`/api/tools/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    },
  },
};
