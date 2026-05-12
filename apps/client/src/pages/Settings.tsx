import DahsboardLayout from "@/layout/DashboardLayout"
import { SettingsForm } from "@/components/settings-form"
import { ProfileForm } from "@/components/profile-form"
import { useAuth } from "@/hooks/useAuth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
                Manage your personal profile and system configuration.
              </p>
            </div>

            {/* Content */}
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">My Profile</TabsTrigger>
                {isAdmin && <TabsTrigger value="company">Company Settings</TabsTrigger>}
              </TabsList>

              <TabsContent value="profile" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                  <ProfileForm />
                </div>
              </TabsContent>

              {isAdmin && (
                <TabsContent value="company" className="focus-visible:outline-none focus-visible:ring-0">
                  <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Company Profile</h2>
                    <SettingsForm />
                  </div>
                </TabsContent>
              )}
            </Tabs>

          </div>
        </div>
      </div>
    </DahsboardLayout>
  )
}