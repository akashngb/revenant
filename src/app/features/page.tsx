"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { Brain, Terminal, Github, Cpu, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const features = [
  { icon: Brain,    title: "Moorcheh Memory Engine",  desc: "Multi-layered semantic persistence. Anna remembers every interaction, every architectural decision, and your specific coding preferences across all sessions." },
  { icon: Terminal, title: "NanoClaw Execution",       desc: "Complete autonomous control — from executing terminal commands to git operations and browser-based research, all with precision." },
  { icon: Github,   title: "GitHub Scout",             desc: "Instant codebase comprehension. Provide a repository URL, and Anna indexes the structure, commits, and PRs in seconds." },
  { icon: Cpu,      title: "Neural Synergy",          desc: "Anthropic Claude powers the reasoning engine, synced with Tavus for high-fidelity voice and visual presence." },
  { icon: Shield,   title: "Secure Sandbox",          desc: "All operations execute in an isolated environment — ensuring your local system remains fully protected at all times." },
  { icon: Zap,      title: "Instant Response",        desc: "Ultra-low latency transmissions for a fluid, natural collaborative experience that never breaks your flow." },
];

export default function FeaturesPage() {
  return (
    <div style={{ background: "#0c0905", minHeight: "100vh", color: "#e8e0d0" }}>
      <Navbar />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 32px 100px" }}>
        {/* Header */}
        <div style={{ marginBottom: 72 }}>
          <span style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "#d97706", marginBottom: 16 }}>Capabilities</span>
          <h1 style={{ fontFamily: "var(--font-playfair, Georgia)", fontStyle: "italic", fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1.1, marginBottom: 20 }}>
            Engineered for <span style={{ color: "#d97706" }}>Autonomous</span> Excellence.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#6b6456", maxWidth: 520 }}>
            Revenant isn&apos;t just a chatbot. It&apos;s a sentient developer clone designed to observe, reason, remember, and act within your architecture.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {features.map(f => (
            <div
              key={f.title}
              style={{ padding: "32px", borderRadius: 24, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.015)", transition: "border-color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(217,119,6,0.3)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <f.icon style={{ width: 20, height: 20, color: "#d97706" }} />
              </div>
              <h3 style={{ fontFamily: "var(--font-playfair, Georgia)", fontStyle: "italic", fontSize: 20, marginBottom: 12 }}>{f.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "#6b6456" }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 72, display: "flex", alignItems: "center", gap: 20, paddingTop: 48, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <Link href="/app" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 32px", borderRadius: 999, background: "#d97706", color: "#0c0905", fontWeight: 800, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", whiteSpace: "nowrap" }}>
            Try It Now <ArrowRight style={{ width: 15, height: 15 }} />
          </Link>
          <span style={{ fontSize: 14, color: "#3a342a" }}>Experience the full capability suite.</span>
        </div>
      </main>
    </div>
  );
}
