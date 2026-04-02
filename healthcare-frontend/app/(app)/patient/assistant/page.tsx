"use client"

import { useState, useRef, useEffect, memo, useCallback } from "react"
import ReactMarkdown from "react-markdown"

import { AppPage } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiRequest } from "@/lib/api"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  triage_score?: number
}

type AssistantResponse = {
  reply: string
  triage_score?: number
}

const MessageItem = memo(({ msg }: { msg: Message }) => (
  <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-[82%] rounded-[1.4rem] px-5 py-4 text-[0.95rem] leading-7 tracking-[-0.01em] shadow-sm ${
        msg.role === "user"
          ? "bg-primary text-primary-foreground"
          : "border border-blue-500/12 bg-[linear-gradient(180deg,rgba(20,29,48,0.96),rgba(15,23,38,0.98))] text-foreground"
      }`}
    >
      {msg.role === "assistant" ? (
        <div className="assistant-prose text-slate-100">
          <ReactMarkdown>{msg.content}</ReactMarkdown>
        </div>
      ) : (
        <p className="font-medium">{msg.content}</p>
      )}
    </div>
  </div>
))

MessageItem.displayName = "MessageItem"

export default function PatientAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [emergency, setEmergency] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const hasConversation = messages.length > 0

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return

    const messageContent = input
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: messageContent,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await apiRequest<AssistantResponse>("/patient/assistant", { message: messageContent }, "POST")
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: res.reply,
        triage_score: res.triage_score,
      }

      if ((res.triage_score ?? 0) >= 8) {
        setEmergency(true)
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-error`,
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [input])

  if (!hasConversation) {
    return (
      <AppPage className="min-h-[calc(100vh-112px)] justify-center">
        <section className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-8 py-10 text-center">
          <div className="space-y-4">
            <p className="font-heading text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-sky-300/75">
              Assistant
            </p>
            <div className="space-y-3">
              <h1 className="font-heading text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
                Structured guidance, without the noise.
              </h1>
              <p className="mx-auto max-w-2xl text-[1.04rem] leading-8 tracking-[-0.015em] text-slate-300">
                Describe symptoms, triggers, and timing to get a cleaner next-step response with self-care guidance
                and warning signs.
              </p>
            </div>
          </div>

          <div className="w-full max-w-3xl rounded-[2rem] border border-blue-500/15 bg-[linear-gradient(180deg,rgba(17,24,39,0.94),rgba(10,14,24,0.98))] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col gap-3 rounded-[1.4rem] border border-white/6 bg-black/10 p-3 sm:flex-row sm:items-center">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage()
                }}
                placeholder="Describe your symptoms..."
                className="h-14 rounded-[1.2rem] border-white/8 bg-white/3 px-5 text-[0.98rem]"
              />
              <Button
                onClick={sendMessage}
                disabled={loading}
                className="h-14 rounded-[1.2rem] px-6 font-heading text-[0.95rem]"
              >
                {loading ? "Starting..." : "Send"}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-sm tracking-[-0.01em] text-slate-400">
            <span className="rounded-full border border-border bg-white/4 px-4 py-2">Back pain after gym</span>
            <span className="rounded-full border border-border bg-white/4 px-4 py-2">Fever since morning</span>
            <span className="rounded-full border border-border bg-white/4 px-4 py-2">Headache and nausea</span>
          </div>
        </section>
      </AppPage>
    )
  }

  return (
    <AppPage className="min-h-[calc(100vh-112px)] max-w-none px-0 py-0">
      <section className="relative flex min-h-[calc(100vh-112px)] flex-col overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.14),_transparent_26%),linear-gradient(180deg,#0b0f14_0%,#0a0e15_100%)]">
        {emergency ? (
          <div className="mx-auto mt-6 flex w-full max-w-5xl items-center justify-between rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-medium tracking-[-0.01em] text-red-100">
            <span>This response may indicate urgent medical attention is needed.</span>
            <button onClick={() => setEmergency(false)} className="text-red-200 hover:text-white">
              Dismiss
            </button>
          </div>
        ) : null}

        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 pb-36 pt-8">
          <div className="flex-1 space-y-5 overflow-y-auto pr-1">
          {messages.map((msg) => (
            <MessageItem key={msg.id} msg={msg} />
          ))}

          {loading ? (
            <p className="text-sm tracking-[-0.01em] text-muted-foreground">Assistant is analyzing your symptoms...</p>
          ) : null}

          <div ref={bottomRef} />
        </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-[linear-gradient(180deg,rgba(10,14,21,0)_0%,rgba(10,14,21,0.82)_30%,rgba(10,14,21,0.98)_100%)] px-6 pb-8 pt-16">
          <div className="pointer-events-auto w-full max-w-4xl rounded-[2rem] border border-blue-500/15 bg-[linear-gradient(180deg,rgba(17,24,39,0.94),rgba(10,14,24,0.98))] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.34)]">
            <div className="flex flex-col gap-3 rounded-[1.4rem] border border-white/6 bg-black/10 p-3 sm:flex-row sm:items-center">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage()
                }}
                placeholder="Describe your symptoms..."
                className="h-14 rounded-[1.2rem] border-white/8 bg-white/3 px-5 text-[0.98rem]"
              />
              <Button
                onClick={sendMessage}
                disabled={loading}
                className="h-14 rounded-[1.2rem] px-6 font-heading text-[0.95rem]"
              >
                {loading ? "Thinking..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </AppPage>
  )
}
