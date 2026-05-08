import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { LogoutButton } from "./logout-button"
import ThemeToggle from "./toggle-mode"
import React from "react";
import axios from "axios";
import { getToken } from "@/services/auth.service";

// TODO : Add title page on navbar
export function SiteHeader() {
  const [userName, setUserName] = React.useState(null);

  React.useEffect(() => {
  const fetchUserData = async (token: string) => {
    try {
      // Membuat objek Axios
      const instance = axios.create({
        baseURL: 'http://localhost:3000/api',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Mengirim GET request ke API
      const response = await instance.get('/user');

      // Mengambil data dari respons
      const userData = response.data.user.full_name;
      console.log('res user sidebar: ', userData);
      setUserName(userData);

      return userData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  const tokenNum = getToken()
  fetchUserData(tokenNum);
}, []);


  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          Hi, {userName}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
