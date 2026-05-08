import { getCurrentUserApi } from "@/api/auth.api"
import { useState } from "react"

export function useUser() {
    const [isLoading, setIsLoading] = useState(false)
    
    const getCurrentUser = async (token: string): Promise<string> => {
        setIsLoading(true)
        try {
            const res = await getCurrentUserApi(token)
            return res.data
        } finally {
            setIsLoading(false)
        }
    }

    return {
        getCurrentUser,
        isLoading
    }
}