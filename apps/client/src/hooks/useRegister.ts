import { useForm } from "react-hook-form"
import { registerApi } from "@/api/auth.api"
import { useNavigate } from "react-router-dom"

type RegisterFormValues = {
    name: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    role: string,
}

export function useRegister() {
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        watch,
        formState,
    } = useForm<RegisterFormValues>()

    const onSubmit = async (data: RegisterFormValues) => {

        try {
            const res = await registerApi({
                name: data.name,
                username: data.username,
                email: data.email,
                password: data.confirmPassword,
                role: data.role,
            })
            console.log("Registration successful", res.data)
            // registerUser(res.data.access_token)
            navigate("/login")
        } catch (error) {
            console.error("Registration failed", error)
        }
    }

    return {
        register,
        handleSubmit,
        watch,
        formState,
        onSubmit,
    }
}