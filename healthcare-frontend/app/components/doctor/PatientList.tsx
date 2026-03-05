"use client";

import { Patient } from "app/types/patient";

type PatientListProps = {
  patients: Patient[];
  onSelect: (patient: Patient) => void;
};

export default function PatientList({
  patients,
  onSelect,
}: PatientListProps) {
  return (
    <ul className="space-y-2">
      {patients.map((patient) => (
        <li
          key={patient.id}
          onClick={() => onSelect(patient)}
          className="cursor-pointer rounded-md px-3 py-2 hover:bg-white/10"
        >
          {patient.full_name ?? "Unnamed Patient"}
        </li>
      ))}
    </ul>
  );
}
