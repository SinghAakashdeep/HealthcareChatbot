"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./styles/home.scss";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="home-root">
      <div className="home-container">
        <div className="home-grid">
          {/* LEFT CONTENT */}
          <section className="home-left">
            <h1>HealthcareChatbot</h1>

            <p>
              An AI-powered healthcare platform enabling smarter diagnoses,
              faster clinical decisions, and better patient outcomes.
            </p>

            <ul>
              <li>Secure JWT-based authentication</li>
              <li>Doctor dashboards with patient insights</li>
              <li>AI-assisted medical Q&amp;A</li>
              <li>Built with FastAPI, PostgreSQL, and Next.js</li>
            </ul>
          </section>
        </div>
      </div>

      {/* FLOATING ARROW */}
      <button
        className={`auth-arrow ${open ? "hidden" : ""}`}
        onClick={() => setOpen(true)}
        aria-label="Open authentication menu"
      >
        →
      </button>

      {/* EXPANDING AUTH PANEL */}
      <div className={`auth-reveal ${open ? "open" : ""}`}>
        <div className="auth-panel">
          <Link href="/login" className="auth-login">
            Login
          </Link>

          <Link href="/register" className="auth-register">
            Register
          </Link>

          <button
            className="auth-close"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </main>
  );
}
