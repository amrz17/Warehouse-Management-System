import { useForm } from "react-hook-form"
import { loginApi } from "@/api/auth.api"
import { useAuthStore } from "@/store/auth.store"
import { useNavigate } from "react-router-dom"

type LoginFormValues = {
  email: string
  password: string
}

export function useLogin() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const {
    register,
    handleSubmit,
    formState,
  } = useForm<LoginFormValues>()

  const onSubmit = async (data: LoginFormValues) => {

    try {
      const res = await loginApi(data)
      login(res.data.access_token)
      navigate("/")
    } catch (error) {
      console.error("Login failed", error)
    }
  }

  return {
    register,
    handleSubmit,
    formState,
    onSubmit,
  }
}
