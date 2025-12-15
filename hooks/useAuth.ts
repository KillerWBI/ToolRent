// hooks/useAuth.ts
import { useAuthStore } from "@/store/auth.store";

export default function useAuth() {
  const user = useAuthStore((state) => state.user);

  return {
    isAuthenticated: Boolean(user),
    user,
  };
}
