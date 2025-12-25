import { create } from "zustand"
import { saveToken, removeToken } from "@/services/auth.service"

type AuthState = {
    isAuth: boolean
    login: (token: string) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuth: false,
    login: (token) => {
        saveToken(token)
        set({ isAuth: true })
    },
    logout: () => {
        removeToken()
        set({ isAuth: false })
    }
}))