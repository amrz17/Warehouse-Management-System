import { useForm } from "react-hook-form"
import { registerApi } from "@/api/auth.api"

import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterPayload } from "@/schemas/schema"
import { toast } from "sonner"

export function useRegister(onSuccess?: () => void) {
// removed unused navigate

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState,
    } = useForm<RegisterPayload>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            full_name: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "STAFF_GUDANG",
        }
    })

    const onSubmit = async (data: RegisterPayload) => {
        try {
            await registerApi({
                full_name: data.full_name,
                username: data.username,
                email: data.email,
                password: data.password,
                role: data.role,
            })
            
            toast.success("Account created successfully")
            reset()
            if (onSuccess) {
                onSuccess()
            }
        } catch (error: any) {
            const message = error.response?.data?.message || "Registration failed"
            toast.error(Array.isArray(message) ? message[0] : message)
            console.error("Registration failed", error)
        }
    }

    return {
        register,
        handleSubmit,
        watch,
        reset,
        formState,
        onSubmit,
    }
}