import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { profileSchema, type ProfilePayload } from "@/schemas/schema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useProfile } from "@/hooks/use-profile"
import { Loader2, Upload, X } from "lucide-react"

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") || "http://localhost:3000"

export function ProfileForm() {
    const { profile, isLoading, isSaving, saveProfile } = useProfile()
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfilePayload>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })

    // Populate form when profile loads
    useEffect(() => {
        if (!isLoading && profile) {
            reset({
                username: profile.username || "",
                email: profile.email || "",
                password: "", // never populate password
            })
            if (profile.avatar_url) {
                setAvatarPreview(`${API_BASE}${profile.avatar_url}`)
            }
        }
    }, [isLoading, profile, reset])

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("File size must be less than 2MB")
                e.target.value = ""
                return
            }
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    const removeAvatar = () => {
        setAvatarPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const onSubmit = async (values: ProfilePayload) => {
        const formData = new FormData()
        formData.append("username", values.username)
        formData.append("email", values.email)
        
        if (values.password) {
            formData.append("password", values.password)
        }

        const fileInput = fileInputRef.current
        if (fileInput?.files?.[0]) {
            formData.append("avatar", fileInput.files[0])
        }

        try {
            const success = await saveProfile(formData)
            if (success && values.password) {
                // Clear password field after successful update
                reset({ ...values, password: "" })
            }
        } catch {
            // Error handled in hook
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 max-w-2xl">
            {/* Avatar Upload */}
            <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex items-start gap-4">
                    {/* Preview */}
                    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/25 bg-muted/50 overflow-hidden">
                        {avatarPreview ? (
                            <>
                                <img
                                    src={avatarPreview}
                                    alt="Avatar preview"
                                    className="h-full w-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeAvatar}
                                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs hover:bg-destructive/90"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </>
                        ) : (
                            <Upload className="h-8 w-8 text-muted-foreground/50" />
                        )}
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Choose File
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            PNG, JPG, WebP. Max 2MB.
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                    </div>
                </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    {...register("username")}
                    placeholder="Enter your username"
                />
                {errors.username && (
                    <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
            </div>

            {/* Email */}
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email"
                />
                {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
            </div>

            {/* Password */}
            <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    placeholder="Leave blank to keep current password"
                />
                {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                    Only fill this out if you want to change your password.
                </p>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Update Profile"
                    )}
                </Button>
            </div>
        </form>
    )
}
