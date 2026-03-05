"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "app/lib/api";
import { Patient } from "app/types/patient";
import { MedicalRecord } from "app/types/medical";

type PatientDetailsResponse = {
  medical_records: MedicalRecord[];
};

export default function PatientDetails({
  patient,
}: {
  patient: Patient;
}) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [diagnosis, setDiagnosis] = useState("");

  useEffect(() => {
    apiFetch<PatientDetailsResponse>(`/doctor/patients/${patient.id}`)
      .then((res) => setRecords(res.medical_records))
      .catch(() => {});
  }, [patient.id]);

  async function addDiagnosis() {
    await apiFetch(`/doctor/patients/${patient.id}/diagnosis`, {
      method: "POST",
      body: JSON.stringify({ diagnosis }),
    });

    setDiagnosis("");

    const res = await apiFetch<PatientDetailsResponse>(
      `/doctor/patients/${patient.id}`
    );
    setRecords(res.medical_records);
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">
        {patient.full_name ?? "Patient"}
      </h2>

      <ul className="space-y-2">
        {records.map((r) => (
          <li
            key={r.id}
            className="border border-white/10 p-2 rounded-md"
          >
            <p className="text-sm">{r.diagnosis}</p>
            <p className="text-xs text-white/50">
              {new Date(r.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      <textarea
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
        placeholder="Add diagnosis..."
        className="w-full rounded-md bg-black border border-white/20 p-2"
      />

      <button
        onClick={addDiagnosis}
        className="bg-white text-black px-4 py-2 rounded-md"
      >
        Save Diagnosis
      </button>
    </div>
  );
}
