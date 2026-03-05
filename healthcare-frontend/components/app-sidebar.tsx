"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { apiRequest } from "@/lib/api"

import {
  LayoutDashboard,
  FileText,
  Bot,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import Link from "next/link"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await apiRequest("/patient/settings", undefined, "GET")
        if (res?.profile_photo) {
          setProfilePhoto(res.profile_photo)
        }
      } catch (err) {
        console.error("Failed to load profile photo")
      }
    }

    fetchProfile()
  }, [])

  const isDoctor = pathname.startsWith("/doctor")

  const doctorItems = [
    { title: "Dashboard", url: "/doctor", icon: LayoutDashboard },
    { title: "Patients", url: "/doctor/patients", icon: Users },
    { title: "Records", url: "/doctor/records", icon: FileText },
    { title: "AI Assistant", url: "/doctor/assistant", icon: Bot },
  ]

  const patientItems = [
    { title: "Dashboard", url: "/patient", icon: LayoutDashboard },
    { title: "My Records", url: "/patient/records", icon: FileText },
    { title: "AI Assistant", url: "/patient/assistant", icon: Bot },
  ]

  const items = isDoctor ? doctorItems : patientItems
  const panelTitle = isDoctor ? "Explorer" : "Explorer"

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-800 bg-[#0F172A] text-slate-200"
    >
      <SidebarContent>
        {/* Header */}
        <div className="flex h-14 items-center justify-center border-b border-slate-800">
          <span className="font-semibold text-sm text-slate-300">
            {panelTitle}
          </span>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      data-active={active}
                      className="
                        text-slate-400
                        hover:text-white
                        hover:bg-slate-800
                        data-[active=true]:text-white
                        data-[active=true]:bg-slate-800
                        transition
                      "
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Profile Footer */}
      <SidebarFooter>
        <div className="relative flex justify-center py-4">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="focus:outline-none"
          >
            {profilePhoto ? (
              <img
                src={profilePhoto}
                className="h-10 w-10 rounded-full border border-teal-500/40 object-cover hover:scale-105 transition"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-slate-700" />
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute bottom-16 w-44 bg-[#1E293B] rounded-lg shadow-xl border border-slate-700 text-sm overflow-hidden">
              <button
                onClick={() => {
                  setDropdownOpen(false)
                  router.push(isDoctor ? "/doctor/settings" : "/patient/settings")
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-800 transition"
              >
                Profile
              </button>

              <button
                onClick={async () => {
                  await apiRequest("/auth/logout", undefined, "POST")
                  router.push("/landing")
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-800 transition text-red-400"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
