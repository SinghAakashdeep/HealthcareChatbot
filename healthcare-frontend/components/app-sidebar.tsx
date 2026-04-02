"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { apiRequest } from "@/lib/api"

import {
  LayoutDashboard,
  FileText,
  Bot,
  Users,
  Calendar,
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
  const isDoctor = pathname.startsWith("/doctor")

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)

  useEffect(() => {
    if (isDoctor) return

    async function fetchProfile() {
      try {
        const res = await apiRequest<{ profile_photo?: string }>("/patient/settings", undefined, "GET")
        if (res) setProfilePhoto(res.profile_photo || null)
      } catch {
        console.error("Failed to load profile photo")
      }
    }

    fetchProfile()
  }, [isDoctor])

  const displayedProfilePhoto = isDoctor ? null : profilePhoto

  const items = isDoctor
    ? [
        { title: "Dashboard", url: "/doctor", icon: LayoutDashboard },
        { title: "Patients", url: "/doctor/patients", icon: Users },
        { title: "Records", url: "/doctor/records", icon: FileText },
        { title: "AI Assistant", url: "/doctor/assistant", icon: Bot },
      ]
    : [
        { title: "Dashboard", url: "/patient", icon: LayoutDashboard },
        { title: "Appointments", url: "/patient/appointments", icon: Calendar },
        { title: "My Records", url: "/patient/records", icon: FileText },
        { title: "AI Assistant", url: "/patient/assistant", icon: Bot },
      ]

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
    >
      <SidebarContent className="flex flex-col justify-between h-full">

        {/* TOP SECTION */}
        <div>

          {/* Header */}
          <div className="flex h-18 flex-col justify-center gap-1 border-b border-sidebar-border px-4 py-4">
            <span className="font-heading text-sm font-semibold tracking-[0.08em] text-sky-200/75">
              CARESPACE
            </span>
            <span className="text-sm font-medium tracking-[-0.01em] text-sidebar-foreground/90">
              {isDoctor ? "Clinician Workspace" : "Patient Workspace"}
            </span>
          </div>

          {/* Menu */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="px-2 py-3 space-y-1">

                {items.map((item) => {
                  const active = pathname === item.url

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className="px-3 py-2 rounded-md text-[0.95rem] font-medium tracking-[-0.01em]"
                      >
                        <Link href={item.url} className="flex items-center gap-3">
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

        </div>

        {/* BOTTOM PROFILE */}
        <SidebarFooter>
          <div className="flex items-center justify-between px-4 py-3 border-t border-sidebar-border">

            <div className="flex items-center gap-3">
              {displayedProfilePhoto ? (
                <img
                  src={displayedProfilePhoto}
                  alt="Profile photo"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-sidebar-accent" />
              )}

              <span className="text-xs font-medium tracking-[-0.01em] text-sidebar-foreground/70">
                {isDoctor ? "Doctor" : "Profile"}
              </span>
            </div>

            <button
              onClick={async () => {
                await apiRequest("/auth/logout", undefined, "POST")
                router.push("/landing")
              }}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Logout
            </button>

          </div>
        </SidebarFooter>

      </SidebarContent>
    </Sidebar>
  )
}
