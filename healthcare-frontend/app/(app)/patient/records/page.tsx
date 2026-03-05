"use client"

import { useEffect, useState } from "react"

type Prescription = {
  medicine_name: string
  dosage: string
  frequency: string
  duration: string
}

type Visit = {
  visit_id: number
  visit_date: string
  diagnosis: string
  chief_complaint: string
  prescriptions: Prescription[]
}

export default function PatientRecordsPage() {
  const [records, setRecords] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("http://localhost:8000/patient/records", {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch records")
        return res.json()
      })
      .then((data) => {
        setRecords(data.records || [])
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading)
    return <div className="p-6 text-zinc-600">Loading medical records...</div>

  if (error)
    return (
      <div className="p-6 text-red-500">
        Error loading records: {error}
      </div>
    )

  if (records.length === 0)
    return (
      <div className="p-6 text-zinc-500">
        No medical records found.
      </div>
    )

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-800">
        Medical Records
      </h1>

      {records.map((visit) => (
        <div
          key={visit.visit_id}
          className="rounded-xl bg-white shadow-sm border p-5"
        >
          <h2 className="font-semibold text-lg text-zinc-800">
            Visit on{" "}
            {new Date(visit.visit_date).toLocaleDateString()}
          </h2>

          <div className="mt-2 text-sm text-zinc-700">
            <p>
              <strong>Chief Complaint:</strong>{" "}
              {visit.chief_complaint}
            </p>

            <p className="mt-1">
              <strong>Diagnosis:</strong> {visit.diagnosis}
            </p>
          </div>

          {visit.prescriptions?.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-zinc-800">
                Prescriptions
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-zinc-700">
                {visit.prescriptions.map((p, index) => (
                  <li
                    key={index}
                    className="border rounded-md p-2 bg-zinc-50"
                  >
                    {p.medicine_name} — {p.dosage} —{" "}
                    {p.frequency} — {p.duration}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}