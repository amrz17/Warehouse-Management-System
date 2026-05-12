import { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { settingsSchema, type SettingsPayload } from "@/schemas/schema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useSettings } from "@/hooks/use-settings"
import { Loader2, Upload, X } from "lucide-react"

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") || "http://localhost:3000"

export function SettingsForm() {
    const { settings, isLoading, isSaving, saveSettings } = useSettings()
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const timezones = useMemo(() => {
        try {
            return Intl.supportedValuesOf("timeZone")
        } catch {
            return ["Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura", "UTC"]
        }
    }, [])

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SettingsPayload>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            company_name: "",
            warehouse_address: "",
            timezone: "Asia/Jakarta",
        },
    })

    // Populate form when settings load
    useEffect(() => {
        if (!isLoading && settings) {
            reset({
                company_name: settings.company_name || "",
                warehouse_address: settings.warehouse_address || "",
                timezone: settings.timezone || "Asia/Jakarta",
            })
            if (settings.logo_url) {
                setLogoPreview(`${API_BASE}${settings.logo_url}`)
            }
        }
    }, [isLoading, settings, reset])

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("File size must be less than 2MB")
                e.target.value = ""
                return
            }
            setLogoPreview(URL.createObjectURL(file))
        }
    }

    const removeLogo = () => {
        setLogoPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const onSubmit = async (values: SettingsPayload) => {
        const formData = new FormData()
        formData.append("company_name", values.company_name)
        formData.append("warehouse_address", values.warehouse_address)
        formData.append("timezone", values.timezone)

        const fileInput = fileInputRef.current
        if (fileInput?.files?.[0]) {
            formData.append("logo", fileInput.files[0])
        }

        try {
            await saveSettings(formData)
        } catch {
            // error already handled in hook
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
            {/* Logo Upload */}
            <div className="space-y-2">
                <Label>Company Logo</Label>
                <div className="flex items-start gap-4">
                    {/* Preview */}
                    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 overflow-hidden">
                        {logoPreview ? (
                            <>
                                <img
                                    src={logoPreview}
                                    alt="Logo preview"
                                    className="h-full w-full object-contain"
                                />
                                <button
                                    type="button"
                                    onClick={removeLogo}
                                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs hover:bg-destructive/90"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </>
                        ) : (
                            <Upload className="h-8 w-8 text-muted-foreground/50" />
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Choose File
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            PNG, JPG, WebP, or SVG. Max 2MB.
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                            className="hidden"
                            onChange={handleLogoChange}
                        />
                    </div>
                </div>
            </div>

            {/* Company Name */}
            <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                    id="company_name"
                    {...register("company_name")}
                    placeholder="Enter company name"
                />
                {errors.company_name && (
                    <p className="text-sm text-destructive">{errors.company_name.message}</p>
                )}
            </div>

            {/* Warehouse Address */}
            <div className="space-y-2">
                <Label htmlFor="warehouse_address">Warehouse Address</Label>
                <textarea
                    id="warehouse_address"
                    {...register("warehouse_address")}
                    placeholder="Enter warehouse address"
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                {errors.warehouse_address && (
                    <p className="text-sm text-destructive">{errors.warehouse_address.message}</p>
                )}
            </div>

            {/* Timezone */}
            <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                    id="timezone"
                    {...register("timezone")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    {timezones.map((tz) => (
                        <option key={tz} value={tz}>
                            {tz}
                        </option>
                    ))}
                </select>
                {errors.timezone && (
                    <p className="text-sm text-destructive">{errors.timezone.message}</p>
                )}
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
                        "Save Settings"
                    )}
                </Button>
            </div>
        </form>
    )
}
