import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const { token, user, setAuth, logout } = useAuthStore();
  return {
    isAuthenticated: !!token,
    user,
    token,
    setAuth,
    logout,
  };
}
