"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconInnerShadowTop,
  IconListDetails,
  IconPackages,
  IconReceiptDollar,
  IconSettings,
  IconTransferIn,
  IconTransferOut,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useAuth } from '../hooks/useAuth.ts'
import { UserRoleEnum } from '../schemas/schema.ts'

const { ADMIN, MANAGER, STAFF_GUDANG, PICKER } = UserRoleEnum.enum;

const navMain = [
  {
    title: "Dashboard",
    url: "/",
    icon: IconDashboard,
    roles: [ADMIN, MANAGER, STAFF_GUDANG, PICKER], // Semua role
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: IconPackages,
    roles: [ADMIN, MANAGER, STAFF_GUDANG],
  },
  {
    title: "Purchase",
    url: "/purchase",
    icon: IconListDetails,
    roles: [ADMIN, MANAGER, STAFF_GUDANG],
  },
  {
    title: "Inbound",
    url: "/inbound",
    icon: IconTransferIn,
    roles: [ADMIN, MANAGER, STAFF_GUDANG],
  },
  {
    title: "Sales",
    url: "/sales",
    icon: IconReceiptDollar,
    roles: [ADMIN, MANAGER, PICKER],
  },
  {
    title: "Outbound",
    url: "/outbound",
    icon: IconTransferOut,
    roles: [ADMIN, MANAGER, PICKER],
  },
  {
    title: "Reporting",
    url: "/reporting",
    icon: IconChartBar,
    roles: [ADMIN, MANAGER],
  },
  {
    title: "Support",
    url: "/support",
    icon: IconUsers,
    roles: [ADMIN, MANAGER, STAFF_GUDANG, PICKER],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: IconSettings,
    roles: [ADMIN, MANAGER, STAFF_GUDANG, PICKER],
  },
]


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { role } = useAuth();
  console.log('Role dari useAuth:', role); 

  // Filter nav berdasarkan role user
  const filteredNav = navMain.filter(item => 
    role ? item.roles.includes(role) : false
  );

  const data = {
    user: {
      name: "admin",
      email: "admin@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: filteredNav,
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Lumbung Digital solution</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}