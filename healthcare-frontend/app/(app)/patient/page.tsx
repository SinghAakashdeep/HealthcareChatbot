"use client"

import { useEffect, useState } from "react"
import { Activity, FileText, Pill, TrendingUp } from "lucide-react"

import { AppPage, EmptyPanel, MetricCard, PageHero, SectionHeading, SurfaceCard } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { apiRequest } from "@/lib/api"

type Prescription = {
  medicine_name: string
  dosage: string
  frequency: string
  duration: string
}

type RecordItem = {
  visit_id: number
  visit_date: string | null
  diagnosis: string | null
  chief_complaint: string | null
  treatment_plan: string | null
  notes: string | null
  prescriptions: Prescription[]
}

type PatientRecordResponse = {
  records: RecordItem[]
}

export default function PatientDashboardPage() {
  const [records, setRecords] = useState<RecordItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecords() {
      try {
        const data = await apiRequest<PatientRecordResponse>("/patient/records", undefined, "GET")
        setRecords(data.records ?? [])
      } catch {
        setRecords([])
      } finally {
        setLoading(false)
      }
    }

    loadRecords()
  }, [])

  const totalVisits = records.length
  const totalPrescriptions = records.reduce((sum, visit) => sum + visit.prescriptions.length, 0)
  const lastVisit = records[0]
  const activeConcern = lastVisit?.chief_complaint ?? "No recent concern recorded"

  return (
    <AppPage>
      <PageHero
        eyebrow="Patient Overview"
        title="Your care timeline, simplified."
        description="Review recent visits, follow active treatment plans, and keep the most important health details in one place."
        actions={
          <Button asChild className="rounded-2xl font-heading">
            <a href="/patient/records">Open Records</a>
          </Button>
        }
      />

      {loading ? (
        <SurfaceCard>
          <p className="text-sm tracking-[-0.01em] text-muted-foreground">Loading your dashboard...</p>
        </SurfaceCard>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total Visits" value={String(totalVisits)} hint="Recorded consultations in your history." />
            <MetricCard label="Medications Logged" value={String(totalPrescriptions)} hint="Prescription entries across recent visits." />
            <MetricCard
              label="Latest Visit"
              value={lastVisit?.visit_date ? new Date(lastVisit.visit_date).toLocaleDateString() : "No visits"}
              hint="Most recent clinical entry on file."
            />
            <MetricCard
              label="Current Focus"
              value={totalVisits ? "Monitoring" : "Start care"}
              hint={activeConcern}
              accent="text-sky-300"
            />
          </div>

          {records.length > 0 ? (
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <SurfaceCard>
                <SectionHeading
                  title="Latest visit summary"
                  description="A quick read on your most recent consultation and what to keep in mind next."
                />
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-border bg-black/10 p-4">
                    <Activity className="h-5 w-5 text-sky-300" />
                    <p className="mt-3 text-xs uppercase tracking-[0.14em] text-slate-500">Chief complaint</p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{lastVisit?.chief_complaint ?? "Not recorded"}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-black/10 p-4">
                    <TrendingUp className="h-5 w-5 text-emerald-300" />
                    <p className="mt-3 text-xs uppercase tracking-[0.14em] text-slate-500">Assessment</p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{lastVisit?.diagnosis ?? "Not recorded"}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-black/10 p-4">
                    <Pill className="h-5 w-5 text-amber-300" />
                    <p className="mt-3 text-xs uppercase tracking-[0.14em] text-slate-500">Plan</p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      {lastVisit?.treatment_plan ?? lastVisit?.notes ?? "No treatment plan recorded"}
                    </p>
                  </div>
                </div>
              </SurfaceCard>

              <SurfaceCard>
                <SectionHeading
                  title="Recent history"
                  description="The latest records at a glance so you can spot trends quickly."
                />
                <div className="mt-5 space-y-3">
                  {records.slice(0, 4).map((visit) => (
                    <div key={visit.visit_id} className="rounded-2xl border border-border bg-black/10 p-4">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                        {visit.visit_date ? new Date(visit.visit_date).toLocaleDateString() : "Unknown date"}
                      </p>
                      <p className="mt-2 font-medium tracking-[-0.01em] text-white">{visit.diagnosis ?? "Assessment pending"}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{visit.chief_complaint ?? "No complaint recorded"}</p>
                    </div>
                  ))}
                </div>
              </SurfaceCard>
            </div>
          ) : (
            <EmptyPanel
              title="No medical records yet"
              description="Once visits are added, your dashboard will summarize diagnoses, treatments, and prescriptions here."
            />
          )}

          <SurfaceCard>
            <SectionHeading
              title="What this area is for"
              description="The patient dashboard is now focused on clarity first: fewer distractions, stronger hierarchy, and fast access to the screens you’ll actually use."
            />
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-black/10 p-4">
                <FileText className="h-5 w-5 text-sky-300" />
                <p className="mt-3 font-medium text-white">Records</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">Visit history, diagnoses, and prescriptions with less clutter.</p>
              </div>
              <div className="rounded-2xl border border-border bg-black/10 p-4">
                <Activity className="h-5 w-5 text-emerald-300" />
                <p className="mt-3 font-medium text-white">Guidance</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">Assistant responses are easier to scan and connect to care actions.</p>
              </div>
              <div className="rounded-2xl border border-border bg-black/10 p-4">
                <TrendingUp className="h-5 w-5 text-violet-300" />
                <p className="mt-3 font-medium text-white">Continuity</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">Recent care stays visible so the app feels connected across pages.</p>
              </div>
            </div>
          </SurfaceCard>
        </>
      )}
    </AppPage>
  )
}
