"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import "../../styles/dashboard.scss";

type MeResponse = {
  id: string;
  email: string;
  role: "doctor" | "patient";
};

export default function DoctorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<MeResponse | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const me = await apiFetch<MeResponse>("/auth/me");
        if (me.role !== "doctor") throw new Error();
        setUser(me);
      } catch {
        router.replace("/login");
      }
    }
    init();
  }, [router]);

  async function logout() {
    await apiFetch("/auth/logout", { method: "POST" });
    router.replace("/login");
  }

  if (!user) return null;

  return (
    <div className="dashboard-root">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          <span className={`chevron ${collapsed ? "right" : "left"}`} />
        </button>

        <div className="sidebar-top">
          <button className="sidebar-new-chat">+ New Chat</button>
          <input className="sidebar-search" placeholder="Search chats..." />
        </div>

        <div className="sidebar-chats">
          <div className="sidebar-chat-item">Diabetes follow-up</div>
          <div className="sidebar-chat-item">Chest pain case</div>
          <div className="sidebar-chat-item">Medication advice</div>
        </div>

        <div className="sidebar-icon-stack">
          <button className="sidebar-icon-btn">✏️</button>
          <button className="sidebar-icon-btn">🔍</button>
          <button className="sidebar-icon-btn">💬</button>
          <button className="sidebar-icon-btn">👥</button>
        </div>

        <div className="sidebar-footer">
          <button
            className="patients-btn"
            onClick={() => router.push("/doctor/patients")}
          >
            Patients
          </button>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <h1>Doctor Assistant</h1>
        <p className="muted">Select or start a chat to begin.</p>

        <div className="chat-placeholder">
          Chat interface will live here.
        </div>
      </main>
    </div>
  );
}
