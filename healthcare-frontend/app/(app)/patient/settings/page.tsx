"use client"

import { ChangeEvent, useEffect, useState } from "react"

import { AppPage, PageHero, SectionHeading, SurfaceCard } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiRequest, BASE_URL } from "@/lib/api"

type PatientSettings = {
  name: string
  email: string
  profile_photo: string | null
  height_cm: number | null
  weight_kg: number | null
  allergies: string | null
  chronic_conditions: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
}

export default function PatientSettingsPage() {
  const [form, setForm] = useState<PatientSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await apiRequest<PatientSettings>("/patient/settings", undefined, "GET")
        setForm(res)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  function updateField<K extends keyof PatientSettings>(key: K, value: PatientSettings[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  async function handleSave() {
    if (!form) return
    setSaving(true)

    try {
      await apiRequest(
        "/patient/settings",
        {
          name: form.name,
          profile_photo: form.profile_photo,
          height_cm: form.height_cm,
          weight_kg: form.weight_kg,
          allergies: form.allergies,
          chronic_conditions: form.chronic_conditions,
          emergency_contact_name: form.emergency_contact_name,
          emergency_contact_phone: form.emergency_contact_phone,
        },
        "PUT"
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !form) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`${BASE_URL}/patient/upload-profile-photo`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")

      const data = (await res.json()) as { profile_photo: string }
      updateField("profile_photo", data.profile_photo)
    } finally {
      setUploading(false)
    }
  }

  if (loading || !form) {
    return (
      <AppPage>
        <SurfaceCard>
          <p className="text-sm tracking-[-0.01em] text-muted-foreground">Loading settings...</p>
        </SurfaceCard>
      </AppPage>
    )
  }

  return (
    <AppPage>
      <PageHero
        eyebrow="Profile"
        title="Keep your health profile current."
        description="These details shape how the assistant and care records appear across the app, so the page now prioritizes clarity over clutter."
        actions={
          <Button onClick={handleSave} disabled={saving} className="rounded-2xl font-heading">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <SurfaceCard>
          <SectionHeading title="Profile photo" description="This image appears in your workspace navigation." />
          <div className="mt-6 flex flex-col items-start gap-4">
            {form.profile_photo ? (
              <img
                src={form.profile_photo}
                alt="Profile"
                className="h-28 w-28 rounded-3xl border border-border object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl border border-border bg-black/15 font-heading text-2xl text-slate-300">
                {form.name.charAt(0).toUpperCase()}
              </div>
            )}

            <label className="inline-flex cursor-pointer items-center rounded-2xl border border-border bg-black/10 px-4 py-3 text-sm font-medium tracking-[-0.01em] text-slate-300 transition hover:border-slate-500">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              {uploading ? "Uploading..." : "Upload new photo"}
            </label>
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <SectionHeading
            title="Personal and medical details"
            description="All the fields that matter for continuity of care, arranged into one consistent form."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Name">
              <Input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="h-11 rounded-2xl"
              />
            </Field>

            <Field label="Email">
              <Input value={form.email} disabled className="h-11 rounded-2xl opacity-70" />
            </Field>

            <Field label="Height (cm)">
              <Input
                type="number"
                value={form.height_cm ?? ""}
                onChange={(e) => updateField("height_cm", e.target.value ? Number(e.target.value) : null)}
                className="h-11 rounded-2xl"
              />
            </Field>

            <Field label="Weight (kg)">
              <Input
                type="number"
                value={form.weight_kg ?? ""}
                onChange={(e) => updateField("weight_kg", e.target.value ? Number(e.target.value) : null)}
                className="h-11 rounded-2xl"
              />
            </Field>

            <Field label="Emergency Contact Name">
              <Input
                value={form.emergency_contact_name ?? ""}
                onChange={(e) => updateField("emergency_contact_name", e.target.value)}
                className="h-11 rounded-2xl"
              />
            </Field>

            <Field label="Emergency Contact Phone">
              <Input
                value={form.emergency_contact_phone ?? ""}
                onChange={(e) => updateField("emergency_contact_phone", e.target.value)}
                className="h-11 rounded-2xl"
              />
            </Field>

            <TextField
              label="Allergies"
              value={form.allergies ?? ""}
              onChange={(e) => updateField("allergies", e.target.value)}
            />

            <TextField
              label="Chronic Conditions"
              value={form.chronic_conditions ?? ""}
              onChange={(e) => updateField("chronic_conditions", e.target.value)}
            />
          </div>
        </SurfaceCard>
      </div>
    </AppPage>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium tracking-[-0.01em] text-slate-300">{label}</span>
      {children}
    </label>
  )
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
}) {
  return (
    <label className="space-y-2 md:col-span-2">
      <span className="text-sm font-medium tracking-[-0.01em] text-slate-300">{label}</span>
      <textarea
        value={value}
        onChange={onChange}
        className="min-h-28 w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm leading-7 tracking-[-0.01em] text-white outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      />
    </label>
  )
}
