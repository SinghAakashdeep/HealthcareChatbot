"use client"

import { Calendar, Clock3, MapPin, Plus } from "lucide-react"
import { useMemo, useState } from "react"

import { AppPage, EmptyPanel, MetricCard, PageHero, SectionHeading, SurfaceCard } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { clinicLocations } from "@/lib/clinic-locations"
import {
  buildAppointment,
  findClinicByName,
  getUpcomingAppointments,
  validateAppointmentForm,
} from "@/lib/patient-activities"

type AppointmentStatus = "scheduled" | "completed" | "cancelled"

type Appointment = {
  id: string
  date: string
  time: string
  doctor: string
  specialty: string
  location: string
  status: AppointmentStatus
}

const doctors = [
  { id: "1", name: "Dr. Aisha Mehta", specialty: "General Medicine" },
  { id: "2", name: "Dr. Rohan Iyer", specialty: "Internal Medicine" },
  { id: "3", name: "Dr. Kavya Nair", specialty: "Family Medicine" },
  { id: "4", name: "Dr. Arjun Rao", specialty: "Sports Medicine" },
]

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "sample-1",
      date: "2026-04-04",
      time: "10:30",
      doctor: "Dr. Aisha Mehta",
      specialty: "General Medicine",
      location: clinicLocations[0].name,
      status: "scheduled",
    },
  ])
  const [showBooking, setShowBooking] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    doctor: "",
    specialty: "",
    location: "",
  })

  const upcomingAppointments = useMemo(() => getUpcomingAppointments(appointments), [appointments])

  function handleBookAppointment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const validation = validateAppointmentForm(formData)
    if (!validation.valid) {
      setFormError(validation.message)
      return
    }

    setFormError("")
    setLoading(true)
    window.setTimeout(() => {
      setAppointments((prev) => [
        buildAppointment(formData),
        ...prev,
      ])
      setFormData({ date: "", time: "", doctor: "", specialty: "", location: "" })
      setShowBooking(false)
      setLoading(false)
    }, 300)
  }

  return (
    <AppPage>
      <PageHero
        eyebrow="Appointments"
        title="Plan visits without the clutter."
        description="The booking flow is lighter now and the appointment screen uses the same calm structure as the rest of the product."
        actions={
          <Button onClick={() => setShowBooking((value) => !value)} className="rounded-2xl font-heading">
            <Plus className="h-4 w-4" />
            {showBooking ? "Close booking" : "Book appointment"}
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Upcoming" value={String(upcomingAppointments.length)} hint="Visits currently scheduled." />
        <MetricCard label="Nearby Clinics" value={String(clinicLocations.length)} hint="Available sample clinic locations." />
        <MetricCard label="Specialties" value={String(new Set(doctors.map((doctor) => doctor.specialty)).size)} hint="Consultation areas currently shown." />
      </div>

      {showBooking ? (
        <SurfaceCard>
          <SectionHeading
            title="Book a new appointment"
            description="Choose a doctor, time, and location. The form keeps the same visual rhythm as the rest of the frontend."
          />

          <form onSubmit={handleBookAppointment} className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Date">
              <Input
                type="date"
                value={formData.date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="h-11 rounded-2xl"
              />
            </Field>

            <Field label="Time">
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                className="h-11 rounded-2xl"
              />
            </Field>

            <Field label="Doctor">
              <select
                value={formData.doctor}
                onChange={(e) => {
                  const doctor = doctors.find((item) => item.name === e.target.value)
                  setFormData((prev) => ({
                    ...prev,
                    doctor: e.target.value,
                    specialty: doctor?.specialty ?? "",
                  }))
                }}
                className="h-11 w-full rounded-2xl border border-input bg-transparent px-4 text-sm text-white outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.name} className="bg-slate-900">
                    {doctor.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Specialty">
              <Input value={formData.specialty} disabled className="h-11 rounded-2xl opacity-75" />
            </Field>

            <Field label="Clinic" className="md:col-span-2">
              <select
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                className="h-11 w-full rounded-2xl border border-input bg-transparent px-4 text-sm text-white outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <option value="">Select a clinic</option>
                {clinicLocations.map((location) => (
                  <option key={location.id} value={location.name} className="bg-slate-900">
                    {location.name}
                  </option>
                ))}
              </select>
            </Field>

            {formError ? (
              <p className="md:col-span-2 text-sm tracking-[-0.01em] text-red-300">{formError}</p>
            ) : null}

            <div className="md:col-span-2 flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="rounded-2xl font-heading">
                {loading ? "Booking..." : "Confirm appointment"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowBooking(false)} className="rounded-2xl">
                Cancel
              </Button>
            </div>
          </form>
        </SurfaceCard>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <SurfaceCard>
          <SectionHeading
            title="Upcoming visits"
            description="Appointments are presented as clean cards instead of oversized, mismatched panels."
          />
          <div className="mt-5 space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="rounded-2xl border border-border bg-black/10 p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-heading text-xl tracking-[-0.04em] text-white">{appointment.doctor}</p>
                      <p className="text-sm text-sky-300">{appointment.specialty}</p>
                    </div>
                    <span className="w-fit rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-sky-200">
                      Scheduled
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <Meta icon={Calendar} label="Date" value={new Date(appointment.date).toLocaleDateString()} />
                    <Meta icon={Clock3} label="Time" value={appointment.time} />
                    <Meta icon={MapPin} label="Location" value={appointment.location} />
                  </div>
                </div>
              ))
            ) : (
              <EmptyPanel
                title="No appointments scheduled"
                description="Create a sample appointment to preview the lighter booking flow and card layout."
                action={
                  <Button onClick={() => setShowBooking(true)} className="rounded-2xl font-heading">
                    <Plus className="h-4 w-4" />
                    Book appointment
                  </Button>
                }
              />
            )}
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <SectionHeading
            title="Recommended clinics"
            description="A smaller, more useful companion panel instead of another disconnected full-screen section."
          />
          <div className="mt-5 space-y-3">
            {clinicLocations.slice(0, 4).map((location) => (
              <div key={location.id} className="rounded-2xl border border-border bg-black/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{location.name}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{location.address}</p>
                  </div>
                  <span className="rounded-full border border-border px-3 py-1 text-xs text-slate-300">
                    {location.distance} km
                  </span>
                </div>
                <p className="mt-3 text-sm text-sky-300">{location.specialties.join(" · ")}</p>
              </div>
            ))}

            {formData.location ? (
              <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-200/80">Selected clinic</p>
                <p className="mt-2 font-medium text-white">{findClinicByName(clinicLocations, formData.location)?.phone ?? "Phone unavailable"}</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  {findClinicByName(clinicLocations, formData.location)?.hours ?? "Hours unavailable"}
                </p>
              </div>
            ) : null}
          </div>
        </SurfaceCard>
      </div>
    </AppPage>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-medium tracking-[-0.01em] text-slate-300">{label}</span>
      {children}
    </label>
  )
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-xl border border-border bg-background/40 p-2">
        <Icon className="h-4 w-4 text-sky-300" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
        <p className="text-sm text-slate-200">{value}</p>
      </div>
    </div>
  )
}
