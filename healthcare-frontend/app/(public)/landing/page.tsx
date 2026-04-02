"use client"

import { ShieldCheck, Stethoscope, Activity, ArrowRight } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiRequest } from "@/lib/api"

type AuthMode = "login" | "register"
type Role = "doctor" | "patient"

type LoginResponse = {
  message: string
  role: Role
}

const highlights = [
  {
    icon: ShieldCheck,
    title: "Secure patient journeys",
    description: "Patient records, triage guidance, and settings all live in one calm clinical workspace.",
  },
  {
    icon: Stethoscope,
    title: "Built for real care flows",
    description: "Visits, vitals, prescriptions, and messaging are structured around outpatient follow-up.",
  },
  {
    icon: Activity,
    title: "Fast, lighter interface",
    description: "A simpler visual system keeps the frontend focused, faster, and easier to maintain.",
  },
]

export default function LandingPage() {
  const router = useRouter()

  const [mode, setMode] = useState<AuthMode>("login")
  const [role, setRole] = useState<Role>("patient")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (mode === "login") {
        const res = await apiRequest<LoginResponse>("/auth/login", { email, password }, "POST")
        router.push(res.role === "doctor" ? "/doctor" : "/patient")
      } else {
        await apiRequest<{ message: string }>(
          "/auth/register",
          { name, email, password, role },
          "POST"
        )
        setMode("login")
        setPassword("")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_28%),#071018] text-white">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <section className="flex flex-col justify-between">
          <div className="space-y-10">
            <div className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-200/85">
              Healthcare Assistant Platform
            </div>

            <div className="max-w-3xl space-y-5">
              <h1 className="font-heading text-5xl font-semibold leading-[1.02] tracking-[-0.07em] text-white md:text-7xl">
                A cleaner patient experience for modern clinics.
              </h1>
              <p className="max-w-2xl text-lg leading-8 tracking-[-0.02em] text-slate-300">
                One interface for records, guidance, appointments, and clinician workflows. Designed to feel calm,
                trustworthy, and lightweight from the first screen onward.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {highlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-sm"
                >
                  <item.icon className="h-6 w-6 text-sky-300" />
                  <h2 className="mt-4 font-heading text-xl font-semibold tracking-[-0.04em] text-white">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 tracking-[-0.01em] text-slate-300">{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200/75">Demo Patient</p>
              <p className="mt-3 font-heading text-xl tracking-[-0.04em] text-white">`aakash@gmail.com`</p>
              <p className="mt-1 text-sm text-slate-400">Realistic visit history, prescriptions, and assistant chat.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200/75">Demo Doctors</p>
              <p className="mt-3 font-heading text-xl tracking-[-0.04em] text-white">Password: `Health@123`</p>
              <p className="mt-1 text-sm text-slate-400">Use any seeded doctor account to enter the clinician shell.</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(10,15,24,0.98))] p-7 shadow-[0_24px_90px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <div className="space-y-2">
              <p className="font-heading text-sm font-semibold uppercase tracking-[0.16em] text-sky-300/80">
                {mode === "login" ? "Sign In" : "Create account"}
              </p>
              <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-white">
                {mode === "login" ? "Welcome back" : "Set up your workspace"}
              </h2>
              <p className="text-sm leading-6 tracking-[-0.01em] text-slate-400">
                {mode === "login"
                  ? "Enter your account details to continue into the care platform."
                  : "Register as a patient or doctor and start using the platform immediately."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {mode === "register" ? (
                <div className="grid grid-cols-2 gap-3">
                  {(["patient", "doctor"] as Role[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRole(option)}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold tracking-[-0.01em] transition ${
                        role === option
                          ? "border-sky-400/50 bg-sky-400/10 text-white"
                          : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20"
                      }`}
                    >
                      {option === "patient" ? "Patient" : "Doctor"}
                    </button>
                  ))}
                </div>
              ) : null}

              {mode === "register" ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500"
                  required
                />
              ) : null}

              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500"
                required
              />

              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500"
                required
              />

              {error ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm tracking-[-0.01em] text-red-200">
                  {error}
                </div>
              ) : null}

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="h-12 w-full rounded-2xl font-heading text-sm font-semibold tracking-[-0.02em]"
              >
                {loading ? "Please wait..." : mode === "login" ? "Enter platform" : "Create account"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 text-sm tracking-[-0.01em] text-slate-400">
              {mode === "login" ? "Need an account?" : "Already registered?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="font-semibold text-sky-300 hover:text-sky-200"
              >
                {mode === "login" ? "Create one" : "Sign in"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
