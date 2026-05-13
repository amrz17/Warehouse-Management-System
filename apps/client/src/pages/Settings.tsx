import { useState } from "react"
import DahsboardLayout from "@/layout/DashboardLayout"
import { SettingsForm } from "@/components/settings-form"
import { ProfileForm } from "@/components/profile-form"
import { useAuth } from "@/hooks/useAuth"
import { TableTabsList, TableTabTrigger } from "@/components/ui/table"

export default function Settings() {
  const { isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState<"profile" | "company">("profile")

  return (
    <DahsboardLayout>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 md:px-6 lg:px-8">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Manage your personal profile and system configuration.
              </p>
            </div>

            {/* Content */}
            <TableTabsList>
              <TableTabTrigger
                isActive={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
              >
                My Profile
              </TableTabTrigger>
              {isAdmin && (
                <TableTabTrigger
                  isActive={activeTab === "company"}
                  onClick={() => setActiveTab("company")}
                >
                  Company Settings
                </TableTabTrigger>
              )}
            </TableTabsList>

            <div className="lg:mt-2 transition-all">
              {activeTab === "profile" && (
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                  <ProfileForm />
                </div>
              )}
              {isAdmin && activeTab === "company" && (
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Company Profile</h2>
                  <SettingsForm />
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </DahsboardLayout>
  )
}