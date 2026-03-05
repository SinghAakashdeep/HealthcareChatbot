"use client"

import { useEffect, useState } from "react"

export default function PatientRecordsPage() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch("http://localhost:8000/patient/records", {
          credentials: "include",
        })

        const data = await res.json()

        // Handle both possible backend formats:
        // 1) { records: [...] }
        // 2) [...]
        if (Array.isArray(data)) {
          setRecords(data)
        } else {
          setRecords(data.records || [])
        }
      } catch (err) {
        console.error("Failed to fetch records:", err)
        setRecords([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
  }, [])

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Medical Records</h1>

      {records.length === 0 && (
        <div className="text-muted-foreground">
          No medical records found.
        </div>
      )}

      {records.map((visit: any) => (
        <div
          key={visit.visit_id}
          className="border rounded-xl p-4 shadow-sm bg-white"
        >
          <h2 className="font-semibold">
            Visit on{" "}
            {visit.visit_date
              ? new Date(visit.visit_date).toDateString()
              : "Unknown Date"}
          </h2>

          <p><strong>Diagnosis:</strong> {visit.diagnosis || "N/A"}</p>
          <p><strong>Complaint:</strong> {visit.chief_complaint || "N/A"}</p>

          <div className="mt-2">
            <strong>Prescriptions:</strong>

            {visit.prescriptions && visit.prescriptions.length > 0 ? (
              <ul className="list-disc ml-5">
                {visit.prescriptions.map((p: any, i: number) => (
                  <li key={i}>
                    {p.medicine_name} — {p.dosage} — {p.frequency}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No prescriptions.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
