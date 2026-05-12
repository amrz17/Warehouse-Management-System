import api from "./axios"

export const fetchSettings = async () => {
    const response = await api.get("/settings")
    return response.data.settings
}

export const updateSettingsApi = async (formData: FormData) => {
    const response = await api.patch("/settings", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return response.data.settings
}
