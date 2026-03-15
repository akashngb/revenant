import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import Navbar from "@/components/Navbar";

const integrations = [
  {
    id: "slack",
    label: "Slack",
    src: "/slack.png",
  },
  {
    id: "github",
    label: "GitHub",
    src: "/github.png",
  },
  {
    id: "jira",
    label: "Jira",
    src: "/jira.png",
  },
  {
    id: "gmail",
    label: "Gmail",
    src: "/gmail.webp",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="landing-page-root">
      <Navbar />

      <main className="page-shell landing-hero-page">
        <section className="landing-hero">
          <div className="hero-network">
            <div className="hero-network__canvas">
              <svg
                className="hero-network__lines"
                viewBox="0 0 1200 760"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.68)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.12)" />
                  </linearGradient>
                </defs>

                <path className="node-line" d="M196 178 C286 190, 384 228, 496 302" />
                <path className="node-line node-line--flow" d="M204 184 C302 200, 392 238, 502 308" />
                <path className="node-line" d="M1004 178 C908 190, 812 228, 700 302" />
                <path className="node-line node-line--flow" d="M996 184 C894 200, 806 238, 694 308" />
                <path className="node-line" d="M238 604 C336 578, 426 512, 508 420" />
                <path className="node-line node-line--flow" d="M246 598 C350 570, 434 506, 514 414" />
                <path className="node-line" d="M962 604 C864 578, 774 512, 692 420" />
                <path className="node-line node-line--flow" d="M954 598 C850 570, 766 506, 686 414" />
              </svg>

              <div className="hero-network__status">
                <span className="hero-network__status-dot" />
                <span className="hero-network__status-label">LIVE</span>
                <span className="hero-network__status-copy">Synced founder context across Slack, GitHub, Jira, and Gmail</span>
              </div>

              <div className="hero-core">
                <div className="hero-core__frame">
                  <div className="hero-core__glow" />

                  <div className="hero-core__media">
                    <Image
                      src="/tavushero.png"
                      alt="Tavus AI persona on a video call"
                      fill
                      priority
                      sizes="(max-width: 1024px) 80vw, 42vw"
                      className="hero-core__image"
                    />
                  </div>
                </div>
              </div>

              {integrations.map(({ id, label, src }) => (
                <div key={id} className={`hero-node hero-node--${id}`}>
                  <div className="hero-node__icon">
                    <Image src={src} alt={label} fill sizes="80px" className="hero-node__image" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="landing-hero__intro">
            <div className="landing-hero__eyebrow">
              <Sparkles size={14} strokeWidth={1.8} />
              <span>Passive intelligence for engineering teams</span>
            </div>

            <h1 className="landing-hero__title">
              <span className="landing-hero__title-accent">Revenent</span>
              <br />
              keeps your best engineering judgment alive.
            </h1>

            <p className="landing-hero__copy">
              Revenent is a passive intelligence layer that watches every engineer on your team, learns what makes them
              effective, distills that wisdom into living company memory, and preserves legendary founder or senior-engineer
              knowledge as an AI mentor juniors can talk to.
            </p>

            <div className="landing-hero__actions">
              <Link href="/app" className="landing-hero__primary">
                Open Founder Console
                <ArrowRight size={16} strokeWidth={2} />
              </Link>

              <Link href="/features" className="landing-hero__secondary">
                See the story
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
