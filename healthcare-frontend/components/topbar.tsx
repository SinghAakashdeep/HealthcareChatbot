"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

export function Topbar() {
  const pathname = usePathname()

  const isDoctor = pathname.startsWith("/doctor")
  const isPatient = pathname.startsWith("/patient")

  const title = isDoctor
    ? "Doctor Panel"
    : isPatient
    ? "Patient Panel"
    : "Dashboard"

  return (
    <header className="flex h-14 items-center gap-3 border-b bg-white px-6 shadow-sm">

      {/* Sidebar Toggle */}
      <SidebarTrigger />

      {/* Title */}
      <h1 className="text-sm font-semibold text-zinc-800">
        {title}
      </h1>

    </header>
  )
}
