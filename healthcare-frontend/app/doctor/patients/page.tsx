"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import "../../styles/patients.scss";

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  age?: number;
  gender?: string;
};

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await apiFetch<Patient[]>("/doctor/patients");
        setPatients(data);
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    loadPatients();
  }, [router]);

  return (
    <div className="patients-root">
      <div className="patients-header">
        <h1>Patients</h1>
        <button className="add-patient-btn">
          + Add Patient
        </button>
      </div>

      {loading && (
        <div className="patients-empty">
          Loading patients…
        </div>
      )}

      {!loading && patients.length === 0 && (
        <div className="patients-empty">
          No patients yet.
        </div>
      )}

      <div className="patients-list">
        {patients.map((p) => (
          <div
            key={p.id}
            className="patient-card"
            onClick={() => router.push(`/doctor/patients/${p.id}`)}
          >
            <div className="patient-name">
              {p.first_name} {p.last_name}
            </div>

            <div className="patient-meta">
              {p.gender && <span>{p.gender}</span>}
              {p.age !== undefined && <span>{p.age} yrs</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
