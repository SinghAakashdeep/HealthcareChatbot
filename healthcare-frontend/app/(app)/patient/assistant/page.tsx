"use client"

import { useState, useRef, useEffect } from "react"
import { apiRequest } from "@/lib/api"
import ReactMarkdown from "react-markdown"

type Message = {
  role: "user" | "assistant"
  content: string
  triage_score?: number
}

type AssistantResponse = {
  reply: string
  triage_score?: number
}

export default function PatientAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [emergency, setEmergency] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage() {
    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res: AssistantResponse = await apiRequest(
        "/patient/assistant",
        { message: input },
        "POST"
      )

      const assistantMessage: Message = {
        role: "assistant",
        content: res.reply,
        triage_score: res.triage_score
      }

      if (res.triage_score && res.triage_score >= 8) {
        setEmergency(true)
      }

      setMessages((prev) => [...prev, assistantMessage])

    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again."
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-gradient-to-br from-slate-50 to-slate-100">

      <div className="px-8 py-6 border-b bg-white shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">
          AI Health Assistant
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Describe your symptoms and get guidance
        </p>
      </div>

      {emergency && (
        <div className="bg-red-600 text-white px-8 py-4 text-sm font-medium flex justify-between items-center">
          <span>
            ⚠️ This may require urgent medical attention. Please seek immediate care.
          </span>
          <button
            onClick={() => setEmergency(false)}
            className="ml-4 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

        {messages.length === 0 && (
          <div className="text-slate-400 text-sm">
            Start by describing how you're feeling.
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] px-5 py-4 rounded-2xl text-sm shadow-md transition-all ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                  : "bg-white text-slate-800 border border-slate-200"
              }`}
            >
              {msg.role === "assistant" ? (
                <ReactMarkdown>
                  {msg.content}
                </ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-sm text-slate-400 animate-pulse">
            Assistant is analyzing your symptoms...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="px-8 py-5 bg-white border-t shadow-inner">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your symptoms..."
            className="flex-1 border border-slate-300 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-sm font-medium transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

    </div>
  )
}