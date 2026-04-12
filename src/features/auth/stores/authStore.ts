import { create } from 'zustand'
import type { AuthState, User } from '../../../types/auth'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setUser: (user: User | null) => set({ user }),
  setAccessToken: (accessToken: string | null) => set({ accessToken }),
  logout: () => set({ user: null, accessToken: null }),
}))
