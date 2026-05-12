import DahsboardLayout from "@/layout/DashboardLayout"
import { SettingsForm } from "@/components/settings-form"
import { useAuth } from "@/hooks/useAuth"

export default function Settings() {
  const { isAdmin } = useAuth()

  return (
    <DahsboardLayout>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 md:px-6 lg:px-8">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Manage your company profile and warehouse configuration.
              </p>
            </div>

            {/* Content */}
            {isAdmin ? (
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Company Profile</h2>
                <SettingsForm />
              </div>
            ) : (
              <div className="rounded-lg border bg-card p-8 text-center shadow-sm">
                <p className="text-muted-foreground">
                  You don't have permission to access settings. Contact your administrator.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DahsboardLayout>
  )
}