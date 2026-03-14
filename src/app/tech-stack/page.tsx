"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { Brain, Database, Cpu, UserCheck, Layout, ShieldCheck } from "lucide-react";

const stack = [
  { icon: Brain,      name: "Anthropic Claude 3.5 Sonnet", role: "Core Reasoning Engine",      desc: "Multi-layered reasoning for architectural decisions and code generation across your entire codebase." },
  { icon: Database,   name: "Moorcheh AI",                 role: "Semantic Persistence Layer", desc: "RAG-driven memory for consistent long-term context and knowledge retrieval across all sessions." },
  { icon: Cpu,        name: "NanoClaw Engine",             role: "Autonomous Execution",       desc: "High-performance bridge between LLM reasoning and system-level execution — terminal, git, browser." },
  { icon: UserCheck,  name: "Tavus Conversations",         role: "High-Fidelity Persona",      desc: "Realistic video and voice presence for a natural human-AI synergy that doesn't feel robotic." },
  { icon: Layout,     name: "Next.js 15 & React 19",      role: "UI Infrastructure",          desc: "Modern rendering architecture for speed, stability, and premium aesthetics across all devices." },
  { icon: ShieldCheck,name: "Secure Sandboxing",          role: "Safety Layer",               desc: "Isolated environments for all autonomous operations — your system remains fully protected." },
];

export default function TechStackPage() {
  return (
    <div style={{ background: "#0c0905", minHeight: "100vh", color: "#e8e0d0" }}>
      <Navbar />

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "120px 32px 100px" }}>
        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <span style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "#d97706", marginBottom: 16 }}>Architecture</span>
          <h1 style={{ fontFamily: "var(--font-playfair, Georgia)", fontStyle: "italic", fontSize: "clamp(38px, 5vw, 60px)", lineHeight: 1.1, marginBottom: 20 }}>
            The <span style={{ color: "#d97706" }}>Infrastructure</span> of Intelligence.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#6b6456", maxWidth: 500 }}>
            A meticulously crafted stack combining neural reasoning with robust autonomous execution frameworks.
          </p>
        </div>

        {/* Stack list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {stack.map((item, i) => (
            <div
              key={item.name}
              style={{ display: "flex", alignItems: "flex-start", gap: 24, padding: "28px 32px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.015)", transition: "border-color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(217,119,6,0.3)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <item.icon style={{ width: 22, height: 22, color: "#d97706" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#e8e0d0" }}>{item.name}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6b6456" }}>{item.role}</span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "#6b6456" }}>{item.desc}</p>
              </div>
              <span style={{ fontSize: 12, color: "#3a342a", flexShrink: 0, paddingTop: 4 }}>0{i + 1}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
