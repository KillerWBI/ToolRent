// hooks/useAuth.ts
import { useAuthStore } from "@/store/auth.store";

export default function useAuth() {
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  return {
    isAuthenticated: Boolean(user),
    user,
    fetchUser,
  };
}
