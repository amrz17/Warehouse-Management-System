import { useCallback, useEffect, useState } from "react"
import { getCurrentUserApi, updateProfileApi } from "@/api/auth.api"
import { getToken } from "@/services/auth.service"
import { toast } from "sonner"

export interface ProfileData {
    username: string
    email: string
    avatar_url: string | null
}

const DEFAULTS: ProfileData = {
    username: "",
    email: "",
    avatar_url: null,
}

export function useProfile() {
    const [profile, setProfile] = useState<ProfileData>(DEFAULTS)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const loadProfile = useCallback(async () => {
        setIsLoading(true)
        try {
            const token = getToken()
            if (!token) return
            const data = await getCurrentUserApi(token)
            if (data?.data?.user) {
                setProfile({
                    username: data.data.user.username,
                    email: data.data.user.email,
                    avatar_url: data.data.user.avatar_url || null,
                })
            }
        } catch {
            toast.error("Failed to load profile")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        loadProfile()
    }, [loadProfile])

    const saveProfile = async (formData: FormData) => {
        setIsSaving(true)
        try {
            const updatedUser = await updateProfileApi(formData)
            setProfile({
                username: updatedUser.username,
                email: updatedUser.email,
                avatar_url: updatedUser.avatar_url || null,
            })
            // Update localStorage to reflect the changes in sidebar and other places
            localStorage.setItem("username", updatedUser.username)
            localStorage.setItem("email", updatedUser.email)
            if (updatedUser.avatar_url) {
                localStorage.setItem("avatar_url", updatedUser.avatar_url)
            } else {
                localStorage.removeItem("avatar_url")
            }
            
            toast.success("Profile updated successfully")
            return true;
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to update profile"
            toast.error(Array.isArray(message) ? message[0] : message)
            throw error
        } finally {
            setIsSaving(false)
        }
    }

    return {
        profile,
        isLoading,
        isSaving,
        loadProfile,
        saveProfile,
    }
}
