"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { Shield, Cpu, Sparkles, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div style={{ background: "#0c0905", minHeight: "100vh", color: "#e8e0d0", overflowX: "hidden" }}>
      <Navbar />

      {/* ─── Hero ────────────────────────────────── */}
      <section style={{ paddingTop: 160, paddingBottom: 120, paddingLeft: 32, paddingRight: 32, position: "relative", textAlign: "center" }}>
        {/* Glow */}
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, background: "radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", marginBottom: 48 }}>
            <Sparkles style={{ width: 12, height: 12, color: "#d97706" }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#6b6456" }}>Autonomous Intelligence Protocol</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: "var(--font-playfair, Georgia)", fontStyle: "italic", fontSize: "clamp(52px, 8vw, 108px)", lineHeight: 1, letterSpacing: "-0.02em", marginBottom: 32 }}>
            The <span style={{ color: "#d97706" }}>Revenant</span>
            <br />Perspective.
          </h1>

          {/* Subhead */}
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "#6b6456", maxWidth: 520, margin: "0 auto 48px" }}>
            A sentient developer clone designed to observe, reason, and act within your architecture — with absolute autonomy.
          </p>

          {/* CTA */}
          <Link href="/app" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 36px", borderRadius: 999, background: "#d97706", color: "#0c0905", fontWeight: 800, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", boxShadow: "0 16px 48px rgba(217,119,6,0.3)", whiteSpace: "nowrap" }}>
            Initiate Transmission <ArrowRight style={{ width: 16, height: 16 }} />
          </Link>
        </div>
      </section>

      {/* ─── Mission ─────────────────────────────── */}
      <section style={{ padding: "100px 32px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          {/* Text col */}
          <div>
            <h2 style={{ fontFamily: "var(--font-playfair, Georgia)", fontStyle: "italic", fontSize: 48, lineHeight: 1.15, marginBottom: 24 }}>
              Elegance in <span style={{ color: "#d97706" }}>Execution</span>.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "#6b6456", marginBottom: 40 }}>
              Revenant bridges neural reasoning and binary execution. She doesn&apos;t just suggest code — she executes it, verifies it, and remembers the context for the next evolution.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                <Shield style={{ width: 16, height: 16, color: "#d97706", flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6456" }}>Encrypted Logic</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                <Cpu style={{ width: 16, height: 16, color: "#d97706", flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6456" }}>Neural Sync</span>
              </div>
            </div>
          </div>

          {/* Logo col */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 360, height: 360, borderRadius: 48, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.015)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 60, background: "radial-gradient(circle, rgba(217,119,6,0.12) 0%, transparent 70%)", borderRadius: "50%" }} />
              <Image src="/logo.png" alt="Revenant Core" width={240} height={240} style={{ objectFit: "contain", position: "relative" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA strip ───────────────────────────── */}
      <section style={{ padding: "80px 32px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 24, textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-playfair, Georgia)", fontStyle: "italic", fontSize: 40, lineHeight: 1.2 }}>Ready to meet <span style={{ color: "#d97706" }}>Anna</span>?</h2>
          <p style={{ fontSize: 15, color: "#6b6456", maxWidth: 420 }}>Your autonomous AI developer clone is waiting. No setup required.</p>
          <Link href="/app" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 36px", borderRadius: 999, background: "#d97706", color: "#0c0905", fontWeight: 800, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", boxShadow: "0 12px 40px rgba(217,119,6,0.3)", whiteSpace: "nowrap" }}>
            Open the App <ArrowRight style={{ width: 16, height: 16 }} />
          </Link>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────── */}
      <footer style={{ padding: "32px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0.6 }}>
            <Image src="/logo.png" alt="" width={40} height={40} style={{ objectFit: "contain" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>Revenant</span>
          </div>
          <div style={{ display: "flex", gap: 32, opacity: 0.3 }}>
            {[["Features", "/features"], ["Tech Stack", "/tech-stack"], ["App", "/app"]].map(([label, href]) => (
              <Link key={href} href={href} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "inherit", textDecoration: "none" }}>{label}</Link>
            ))}
          </div>
          <span style={{ fontSize: 10, color: "#3a342a", letterSpacing: "0.2em", textTransform: "uppercase" }}>© 2026 Revenant</span>
        </div>
      </footer>
    </div>
  );
}
