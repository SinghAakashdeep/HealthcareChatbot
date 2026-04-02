export function formatDisplayDate(value) {
  if (!value) return "Unknown date"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Unknown date"

  return date.toLocaleDateString()
}

export function getUpcomingAppointments(appointments) {
  return appointments.filter((appointment) => appointment.status === "scheduled")
}

export function validateAppointmentForm(formData) {
  if (!formData.date || !formData.time || !formData.doctor || !formData.specialty || !formData.location) {
    return {
      valid: false,
      message: "Please complete all appointment details.",
    }
  }

  const selectedDate = new Date(`${formData.date}T${formData.time}`)
  if (Number.isNaN(selectedDate.getTime())) {
    return {
      valid: false,
      message: "Please enter a valid date and time.",
    }
  }

  if (selectedDate.getTime() < Date.now()) {
    return {
      valid: false,
      message: "Appointments must be scheduled for a future time.",
    }
  }

  return { valid: true, message: "" }
}

export function buildAppointment(formData) {
  return {
    id: `appointment-${Date.now()}`,
    date: formData.date,
    time: formData.time,
    doctor: formData.doctor,
    specialty: formData.specialty,
    location: formData.location,
    status: "scheduled",
  }
}

export function findClinicByName(clinics, clinicName) {
  return clinics.find((clinic) => clinic.name === clinicName) ?? null
}

export function calculateRecordMetrics(records) {
  const totalVisits = records.length
  const totalPrescriptions = records.reduce(
    (sum, visit) => sum + (visit.prescriptions?.length ?? 0),
    0
  )
  const lastVisit = records[0] ?? null

  return {
    totalVisits,
    totalPrescriptions,
    lastVisit,
    activeConcern: lastVisit?.chief_complaint ?? "No recent concern recorded",
  }
}

export function getRecentVisits(records, limit = 4) {
  return records.slice(0, limit)
}

export function getMedicationSummary(records) {
  const names = new Set()

  records.forEach((visit) => {
    visit.prescriptions?.forEach((item) => {
      if (item.medicine_name) {
        names.add(item.medicine_name)
      }
    })
  })

  return {
    totalUniqueMedications: names.size,
    medications: Array.from(names),
  }
}

export function createChatMessage(role, content, triageScore) {
  return {
    id: `msg-${Date.now()}-${role}`,
    role,
    content,
    triage_score: triageScore,
  }
}

export function shouldEscalateAssistantResponse(triageScore) {
  return (triageScore ?? 0) >= 8
}
