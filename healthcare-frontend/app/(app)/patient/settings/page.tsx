"use client"

import { useEffect, useState } from "react"
import { apiRequest } from "@/lib/api"

export default function PatientSettingsPage() {
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await apiRequest("/patient/settings", undefined, "GET")
        setForm(res)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  function handleChange(e: any) {
    const { name, value } = e.target
    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await apiRequest(
        "/patient/settings",
        {
          name: form.name,
          profile_photo: form.profile_photo,
          height_cm: form.height_cm ? Number(form.height_cm) : null,
          weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
          allergies: form.allergies,
          chronic_conditions: form.chronic_conditions,
          emergency_contact_name: form.emergency_contact_name,
          emergency_contact_phone: form.emergency_contact_phone,
        },
        "PUT"
      )

      alert("Settings updated successfully")
    } catch (err) {
      console.error(err)
      alert("Update failed")
    } finally {
      setSaving(false)
    }
  }

  async function handleImageUpload(e: any) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(
        "http://localhost:8000/patient/upload-profile-photo",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      )

      if (!res.ok) throw new Error("Upload failed")

      const data = await res.json()

      setForm((prev: any) => ({
        ...prev,
        profile_photo: data.profile_photo,
      }))
    } catch (err) {
      console.error(err)
      alert("Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (!form) return <div className="p-6">Error loading settings</div>

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* Profile Photo */}
      <div className="flex items-center gap-6">
        {form.profile_photo ? (
          <img
            src={form.profile_photo}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300" />
        )}

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        </div>
      </div>

      <div className="space-y-4">

        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            value={form.email || ""}
            disabled
            className="w-full border rounded p-2 bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Height (cm)</label>
          <input
            name="height_cm"
            type="number"
            step="0.1"
            value={form.height_cm || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Weight (kg)</label>
          <input
            name="weight_kg"
            type="number"
            step="0.1"
            value={form.weight_kg || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Allergies</label>
          <textarea
            name="allergies"
            value={form.allergies || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Chronic Conditions</label>
          <textarea
            name="chronic_conditions"
            value={form.chronic_conditions || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Emergency Contact Name
          </label>
          <input
            name="emergency_contact_name"
            value={form.emergency_contact_name || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Emergency Contact Phone
          </label>
          <input
            name="emergency_contact_phone"
            value={form.emergency_contact_phone || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>
    </div>
  )
}
