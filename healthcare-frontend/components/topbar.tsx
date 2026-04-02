"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

const titleMap: Record<string, { title: string; subtitle: string }> = {
  "/doctor": { title: "Doctor Dashboard", subtitle: "Review patients, records, and care activity." },
  "/patient": { title: "Patient Dashboard", subtitle: "Track your visits, guidance, and personal health details." },
  "/patient/records": { title: "Medical Records", subtitle: "A clear timeline of visits, diagnoses, and prescriptions." },
  "/patient/assistant": { title: "AI Health Assistant", subtitle: "Describe symptoms and get structured next-step guidance." },
  "/patient/appointments": { title: "Appointments", subtitle: "Manage upcoming visits and explore nearby clinic options." },
  "/patient/settings": { title: "Profile & Settings", subtitle: "Keep your personal and medical profile up to date." },
}

export function Topbar() {
  const pathname = usePathname()
  const content = titleMap[pathname] ?? {
    title: pathname.startsWith("/doctor") ? "Doctor Workspace" : "Patient Workspace",
    subtitle: "A connected healthcare workspace designed to stay focused and easy to navigate.",
  }

  return (
    <header className="border-b border-border bg-background/90 px-6 py-4 backdrop-blur">
      <div className="flex items-start gap-4">
        <SidebarTrigger className="mt-1 text-muted-foreground hover:text-foreground" />
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold tracking-[-0.05em] text-white">{content.title}</h1>
          <p className="text-sm tracking-[-0.01em] text-muted-foreground">{content.subtitle}</p>
        </div>
      </div>
    </header>
  )
}
