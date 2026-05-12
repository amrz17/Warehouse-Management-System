import { useCallback, useEffect, useState } from "react"
import { fetchSettings, updateSettingsApi } from "@/api/settings.api"
import { toast } from "sonner"

export interface SettingsData {
    company_name: string
    warehouse_address: string
    timezone: string
    logo_url: string | null
}

const DEFAULTS: SettingsData = {
    company_name: "My Company",
    warehouse_address: "",
    timezone: "Asia/Jakarta",
    logo_url: null,
}

export function useSettings() {
    const [settings, setSettings] = useState<SettingsData>(DEFAULTS)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const loadSettings = useCallback(async () => {
        setIsLoading(true)
        try {
            const data = await fetchSettings()
            if (data) setSettings(data)
        } catch {
            toast.error("Failed to load settings")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        loadSettings()
    }, [loadSettings])

    const saveSettings = async (formData: FormData) => {
        const previous = { ...settings }

        // Optimistic update (text fields only)
        setSettings((prev) => ({
            ...prev,
            company_name: formData.get("company_name") as string || prev.company_name,
            warehouse_address: formData.get("warehouse_address") as string || prev.warehouse_address,
            timezone: formData.get("timezone") as string || prev.timezone,
        }))

        setIsSaving(true)
        try {
            const updated = await updateSettingsApi(formData)
            setSettings(updated)
            toast.success("Settings updated successfully")
        } catch (error: any) {
            // Rollback on failure
            setSettings(previous)
            const message = error.response?.data?.message || "Failed to update settings"
            toast.error(Array.isArray(message) ? message[0] : message)
            throw error
        } finally {
            setIsSaving(false)
        }
    }

    return {
        settings,
        isLoading,
        isSaving,
        loadSettings,
        saveSettings,
    }
}
