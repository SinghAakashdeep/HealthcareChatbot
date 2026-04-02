import { ClipboardList, Sparkles, UsersRound } from "lucide-react"

import { AppPage, MetricCard, PageHero, SectionHeading, SurfaceCard } from "@/components/app-shell"

const doctorHighlights = [
  {
    title: "Patient roster",
    copy: "The shell is now visually aligned with the patient side, so doctor workflows no longer feel like a separate prototype.",
    icon: UsersRound,
  },
  {
    title: "Clinical records",
    copy: "Cards, spacing, and hierarchy follow the same system used across the rest of the application.",
    icon: ClipboardList,
  },
  {
    title: "Assistant workflow",
    copy: "The product language is calmer and more consistent, which makes the assistant feel like part of the care flow.",
    icon: Sparkles,
  },
]

export default function DoctorPage() {
  return (
    <AppPage>
      <PageHero
        eyebrow="Doctor Workspace"
        title="A cleaner clinician-facing shell."
        description="This area now shares the same visual language as the patient experience, making the product feel more cohesive while the doctor-specific APIs continue to evolve."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Care Views" value="3" hint="Patients, records, and assistant entry points." />
        <MetricCard label="UI System" value="Unified" hint="Shared spacing, surfaces, type, and navigation patterns." />
        <MetricCard label="Frontend Direction" value="Lighter" hint="Less decorative overhead, stronger hierarchy, calmer presentation." />
      </div>

      <SurfaceCard>
        <SectionHeading
          title="What improved here"
          description="Even before deeper doctor-side data endpoints are added, the workspace now feels more deliberate and better connected to the rest of the app."
        />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {doctorHighlights.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-black/10 p-5">
              <item.icon className="h-5 w-5 text-sky-300" />
              <h2 className="mt-4 font-heading text-xl font-semibold tracking-[-0.04em] text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 tracking-[-0.01em] text-slate-400">{item.copy}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <SectionHeading
          title="Next natural step"
          description="The doctor shell is now visually ready for richer data. The next quality upgrade would be connecting it to the real doctor roster, assigned patients, and recent visit summaries from the backend."
        />
      </SurfaceCard>
    </AppPage>
  )
}
