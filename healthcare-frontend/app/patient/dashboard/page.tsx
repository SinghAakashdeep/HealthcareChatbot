"use client";

import PatientGuard from "app/components/auth/PatientGuard";
import "app/styles/patients.scss";

export default function PatientDashboardPage() {
  return (
    <PatientGuard>
      <div className="patient-dashboard-root">
        {/* HEADER */}
        <header className="patient-header">
          <h1>Your Health Assistant</h1>
          <p className="muted">
            View your records and ask questions about your condition.
          </p>
        </header>

        {/* MAIN GRID */}
        <div className="patient-grid">
          {/* LEFT: MEDICAL SUMMARY */}
          <section className="patient-card">
            <h2>Medical Summary</h2>
            <div className="placeholder">
              Your diagnosis, vitals, and notes will appear here.
            </div>
          </section>

          {/* RIGHT: AI CHAT */}
          <section className="patient-card chat-card">
            <h2>AI Assistant</h2>
            <div className="chat-placeholder">
              Ask questions about your condition, medications, or reports.
            </div>
          </section>
        </div>
      </div>
    </PatientGuard>
  );
}
