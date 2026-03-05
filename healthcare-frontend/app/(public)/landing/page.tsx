"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

import { apiRequest } from "@/lib/api"

const Silk = dynamic(() => import("../../../components/Silk"), {
  ssr: false,
})

export default function HomePage() {
  const router = useRouter()

  const [mode, setMode] = useState<"login" | "register">("login")
  const [role, setRole] = useState<"doctor" | "patient">("patient")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
      if (mode === "login") {
        const res = await apiRequest("/auth/login", {
          email,
          password,
        })

        if (res.role === "doctor") {
          router.push("/doctor")
        } else {
          router.push("/patient")
        }

      } else {
        await apiRequest("/auth/register", {
          name,
          email,
          password,
          role, // ✅ selected role
        })

        alert("Registration successful. Please login.")

        setMode("login")
        setPassword("")
      }

    } catch (err: any) {
      setError(err.message || "Invalid credentials or server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="h-screen w-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">

      {/* LEFT: Silk Background */}
      <section className="relative bg-gray-200/30">


<Silk
  speed={3}
  scale={1.1}
  color="#32cee3"       // Tailwind gray-400
  noiseIntensity={0.8} // Softer
  rotation={0}
/>

<div className="absolute inset-0 bg-gradient-to-br from-gray-100/60 to-gray-300/40" />

        {/* Overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
          <div className="text-center space-y-4">

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
              Welcome
            </h1>

            <p className="text-xl md:text-2xl text-white/90 drop-shadow">
              Secure Healthcare Assistant
            </p>

          </div>
        </div>

      </section>

      {/* RIGHT: Auth Panel */}
<section className="bg-gray-100 flex items-center justify-center">

<div className="w-full max-w-md p-8 rounded-xl bg-white/90 backdrop-blur border border-gray-200 shadow-xl">

          {/* Header */}
          <div className="text-center mb-6">

            <h2 className="text-2xl font-semibold">
              {mode === "login" ? "Sign In" : "Create Account"}
            </h2>

            <p className="text-muted-foreground text-sm mt-1">
              Access your healthcare dashboard
            </p>

          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Role Selector (Register Only) */}
            {mode === "register" && (
              <div className="flex gap-4">

                <button
                  type="button"
                  onClick={() => setRole("patient")}
                  className={`flex-1 py-2 rounded-lg border font-medium transition ${
                    role === "patient"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background"
                  }`}
                >
                  Patient
                </button>

                <button
                  type="button"
                  onClick={() => setRole("doctor")}
                  className={`flex-1 py-2 rounded-lg border font-medium transition ${
                    role === "doctor"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background"
                  }`}
                >
                  Doctor
                </button>

              </div>
            )}

            {/* Name (Register Only) */}
            {mode === "register" && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
              />
            )}

            {/* Email */}
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Register"}
            </button>

          </form>

          {/* Error */}
          {error && (
            <p className="mt-4 text-sm text-red-500 text-center">
              {error}
            </p>
          )}

          {/* Switch Mode */}
          <div className="mt-6 text-center text-sm">

            {mode === "login" ? (
              <>
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-primary font-medium hover:underline"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-primary font-medium hover:underline"
                >
                  Sign In
                </button>
              </>
            )}

          </div>

        </div>

      </section>

    </main>
  )
}
