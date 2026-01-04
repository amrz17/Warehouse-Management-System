import { create } from "zustand"
import { saveToken, removeToken } from "@/services/auth.service"

type AuthState = {
  login: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  login: (token) => {
    saveToken(token)
  },
  logout: () => {
    removeToken()
  },
}))
