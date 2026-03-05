"use client";

import { useState } from "react";
import { apiFetch } from "@/app/lib/api";

type DoctorChatResponse = {
  answer: string;
};

export default function DoctorChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function ask() {
    const res = await apiFetch<DoctorChatResponse>("/doctor/chat", {
      method: "POST",
      body: JSON.stringify({ question }),
    });

    setAnswer(res.answer);
  }

  return (
    <div className="space-y-3">
      <h2 className="font-semibold">Doctor Chat</h2>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a medical question..."
        className="w-full rounded-md bg-black border border-white/20 p-2"
      />

      <button
        onClick={ask}
        className="bg-white text-black px-4 py-2 rounded-md"
      >
        Ask
      </button>

      {answer && (
        <div className="text-sm text-white/70 border border-white/10 p-2 rounded-md">
          {answer}
        </div>
      )}
    </div>
  );
}
