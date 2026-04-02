"use client"

import { useEffect, useState } from "react"

import { AppPage, EmptyPanel, PageHero, SectionHeading, SurfaceCard } from "@/components/app-shell"
import { apiRequest } from "@/lib/api"

type Prescription = {
  medicine_name: string
  dosage: string
  frequency: string
  duration: string
}

type Visit = {
  visit_id: number
  visit_date: string | null
  diagnosis: string | null
  chief_complaint: string | null
  treatment_plan: string | null
  notes: string | null
  prescriptions: Prescription[]
}

type PatientRecordResponse = {
  records: Visit[]
}

export default function PatientRecordsPage() {
  const [records, setRecords] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRecords() {
      try {
        const data = await apiRequest<PatientRecordResponse>("/patient/records", undefined, "GET")
        setRecords(data.records ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch records")
      } finally {
        setLoading(false)
      }
    }

    loadRecords()
  }, [])

  return (
    <AppPage>
      <PageHero
        eyebrow="Patient Records"
        title="A more readable medical history."
        description="Each visit is grouped into a consistent clinical summary so diagnoses, complaints, and prescriptions stay easy to review."
      />

      {loading ? (
        <SurfaceCard>
          <p className="text-sm tracking-[-0.01em] text-muted-foreground">Loading medical records...</p>
        </SurfaceCard>
      ) : error ? (
        <SurfaceCard>
          <p className="text-sm tracking-[-0.01em] text-red-300">Error loading records: {error}</p>
        </SurfaceCard>
      ) : records.length === 0 ? (
        <EmptyPanel
          title="No medical records found"
          description="Once consultation notes are added, your timeline will appear here with diagnoses and prescribed medications."
        />
      ) : (
        <div className="space-y-5">
          <SectionHeading
            title="Visit timeline"
            description="Ordered from most recent to older visits so you can quickly scan what changed over time."
          />

          {records.map((visit) => (
            <SurfaceCard key={visit.visit_id}>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300/75">
                    {visit.visit_date ? new Date(visit.visit_date).toLocaleDateString() : "Unknown date"}
                  </p>
                  <h2 className="font-heading text-2xl font-semibold tracking-[-0.05em] text-white">
                    {visit.diagnosis ?? "Visit summary"}
                  </h2>
                  <p className="max-w-3xl text-sm leading-7 tracking-[-0.01em] text-slate-300">
                    {visit.chief_complaint ?? "No chief complaint recorded."}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-black/10 px-4 py-3 text-sm tracking-[-0.01em] text-slate-400">
                  Visit ID: {visit.visit_id}
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                <div className="rounded-2xl border border-border bg-black/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Treatment plan</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    {visit.treatment_plan ?? visit.notes ?? "No treatment plan recorded."}
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-black/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Prescriptions</p>
                  {visit.prescriptions.length > 0 ? (
                    <div className="mt-3 space-y-3">
                      {visit.prescriptions.map((prescription, index) => (
                        <div key={`${visit.visit_id}-${index}`} className="rounded-xl border border-border bg-background/50 p-3">
                          <p className="font-medium text-white">{prescription.medicine_name}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-400">
                            {prescription.dosage} · {prescription.frequency} · {prescription.duration}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-slate-400">No prescriptions were added for this visit.</p>
                  )}
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>
      )}
    </AppPage>
  )
}
