"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/features",   label: "Features"   },
    { href: "/tech-stack", label: "Tech Stack"  },
  ];

  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        background: "rgba(12,9,5,0.85)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 32px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
            <Image src="/logo.png" alt="Revenant" fill style={{ objectFit: "contain" }} />
          </div>
          <span style={{
            color: "#e8e0d0",
            fontWeight: 800,
            fontSize: 12,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}>
            REVENANT
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "all 0.2s",
                color: pathname === link.href ? "#d97706" : "#6b6456",
                background: pathname === link.href ? "rgba(217,119,6,0.08)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/app"
            style={{
              marginLeft: 8,
              padding: "10px 22px",
              borderRadius: 999,
              background: "#d97706",
              color: "#0c0905",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 16px rgba(217,119,6,0.3)",
              transition: "all 0.2s",
            }}
          >
            Open App →
          </Link>
        </nav>
      </div>
    </header>
  );
}
