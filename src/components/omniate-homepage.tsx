"use client";

/**
 * REVENANT LANDING PAGE — Pre-seed / investor-facing version
 *
 * Sections:
 *  1. Hero
 *  2. Demo (visual orb animation — no Tavus interactive session)
 *  3. The Problem
 *  4. The Solution (3 columns)
 *  5. Why Omniate (composio-style tabbed cards)
 *  6. How It Works (3 steps + integration logos)
 *  7. Who It's For
 *  8. The Team
 *  9. Footer CTA
 *
 * All CTA links are placeholder "#" — search for TODO comments to swap in
 * real Calendly / form / email links when ready.
 *
 * Product pages (login, signup, dashboard, etc.) are preserved in
 * src/app/_product/ — see that directory's README.md for restore instructions.
 */

import Image from "next/image";
import { OmniateHeroCanvas } from "@/components/omniate-hero-canvas";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VoicePoweredOrb } from "@/components/ui/voice-powered-orb";
import {
  BrainCircuit,
  Menu,
  X,
  Zap,
  Lock,
  Database,
  ArrowRight,
  User,
  Users,
  Building2,
} from "lucide-react";

// ─── Navigation links ──────────────────────────────────────────────────────────
const navLinks = [
  { href: "#problem", label: "Problem" },
  { href: "#solution", label: "Solution" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#team", label: "Team" },
];

// ─── Integration logos for the marquee ────────────────────────────────────────
const integrations = [
  { name: "GitHub", src: "/github.png", width: 148, height: 34 },
  { name: "Jira", src: "/jira.svg", width: 132, height: 34 },
  { name: "GitLab", src: "/gitlab.svg", width: 132, height: 34 },
  { name: "Slack", src: "/slack.png", width: 148, height: 34 },
  { name: "Gmail", src: "/gmail.svg", width: 132, height: 34 },
  { name: "Google Calendar", src: "/googlecalendar.svg", width: 156, height: 34 },
  { name: "Asana", src: "/asana.svg", width: 132, height: 34 },
  { name: "Discord", src: "/discord.svg", width: 132, height: 34 },
  { name: "Figma", src: "/figma.svg", width: 132, height: 34 },
  { name: "HubSpot", src: "/hubspot.svg", width: 144, height: 34 },
  { name: "Linear", src: "/linear.svg", width: 132, height: 34 },
  { name: "PostHog", src: "/posthog.svg", width: 144, height: 34 },
  { name: "Salesforce", src: "/salesforce.svg", width: 152, height: 34 },
  { name: "Snowflake", src: "/snowflake.svg", width: 152, height: 34 },
  { name: "Stripe", src: "/stripe.svg", width: 132, height: 34 },
  { name: "Supabase", src: "/supabase.svg", width: 144, height: 34 },
  { name: "Trello", src: "/trello.svg", width: 132, height: 34 },
  { name: "Zendesk", src: "/zendesk.svg", width: 148, height: 34 },
];

// ─── Why Omniate cards (composio-style tabbed section) ───────────────────────
const whyCards = [
  {
    num: "01",
    title: "Proactive, not reactive",
    description:
      "Omniate doesn't wait for questions. It detects issues, traces them to the source, and surfaces the right information to the right person before they even notice.",
    icon: Zap,
    tag: "DETECTION",
  },
  {
    num: "02",
    title: "Your infrastructure, your data",
    description:
      "Fully self-hosted with local model inference. Nothing leaves your network. No third-party cloud dependencies. Complete data sovereignty.",
    icon: Lock,
    tag: "SOVEREIGNTY",
  },
  {
    num: "03",
    title: "Memory that earns its place",
    description:
      "Not everything is worth remembering forever. Omniate keeps what's actively useful, expires what's not, and enforces access boundaries at every layer of storage.",
    icon: Database,
    tag: "RETENTION",
  },
  {
    num: "04",
    title: "It doesn't just answer. It acts.",
    description:
      "Opens tickets, drafts documents, flags knowledge gaps, and routes the right context to the right person in your company's own style.",
    icon: ArrowRight,
    tag: "ACTION",
  },
];

// ─── Demo scenarios for the animated orb ──────────────────────────────────────
interface ScenarioPull {
  app: string;
  logo: string;
  ref: string;
  id: string;
}

const DEMO_SCENARIOS = [
  {
    question:
      "Why did the team keep auth retry logic inside deploy sequencing instead of moving it to the worker queue?",
    answer:
      "During the April incident, queue delays caused token expiry during blue-green cutovers. The coupling stayed in place — the rollback conditions were captured in review threads and the postmortem.",
    sources: ["GitHub PR #481", "Slack #auth-war-room", "Jira ARC-219"],
    pulls: [
      { app: "GitHub", logo: "/github.png",  ref: "PR #481",         id: "cmt_c8f2a3d9" },
      { app: "Slack",  logo: "/slack.png",   ref: "#auth-war-room",  id: "conv_3f8d2a91" },
      { app: "Jira",   logo: "/jira.svg",    ref: "ARC-219",         id: "issue_a2d8f3b1" },
    ] as ScenarioPull[],
  },
  {
    question:
      "Why was the search shard split postponed even after the migration plan was approved?",
    answer:
      "Storage growth outpaced the original estimate. The split was delayed until the new rollback window and runbook were in place — capacity notes are linked in ARC-312.",
    sources: ["GitHub migration review", "Jira ARC-312", "Release chat"],
    pulls: [
      { app: "GitHub", logo: "/github.png",  ref: "migration review", id: "pr_9c3e7a2f" },
      { app: "Jira",   logo: "/jira.svg",    ref: "ARC-312",          id: "issue_7e1f4b8c" },
      { app: "Slack",  logo: "/slack.png",   ref: "#release-eng",     id: "conv_5a9c1d3e" },
    ] as ScenarioPull[],
  },
  {
    question:
      "Why did billing stop retrying failed renewals immediately after the duplicate-charge incident?",
    answer:
      "The team found retries could replay against stale payment intents. Finance approved a slower retry window until idempotency checks shipped.",
    sources: ["Slack #billing-ops", "Incident DB", "GitHub policy diff"],
    pulls: [
      { app: "Slack",  logo: "/slack.png",   ref: "#billing-ops",    id: "conv_2d4f8a1c" },
      { app: "Linear", logo: "/linear.svg",  ref: "INC-094",         id: "lin_8b3f1e72" },
      { app: "GitHub", logo: "/github.png",  ref: "policy diff",     id: "pr_1c6d9e4a" },
    ] as ScenarioPull[],
  },
];

// ─── Framer Motion config ──────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease },
  }),
};

// ─── Section label component ──────────────────────────────────────────────────
function SectionLabel({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`size-[5.82px] ${light ? "bg-black" : "bg-white"}`} />
      <span
        className={`font-ui-mono text-[11px] tracking-[0.2em] uppercase ${
          light ? "text-black/60" : "text-white/45"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const updateNavState = () => {
      setIsVisible(window.scrollY > 24);
      const probe = document.elementFromPoint(
        window.innerWidth / 2,
        Math.min(96, window.innerHeight - 1)
      );
      const section = probe?.closest("[data-nav-theme]");
      const nextTheme = section?.getAttribute("data-nav-theme");
      setTheme(nextTheme === "light" ? "light" : "dark");
    };

    updateNavState();
    window.addEventListener("scroll", updateNavState, { passive: true });
    window.addEventListener("resize", updateNavState);
    return () => {
      window.removeEventListener("scroll", updateNavState);
      window.removeEventListener("resize", updateNavState);
    };
  }, []);

  const hasChrome = isVisible || open;
  const isLight = theme === "light";

  const headerCls = hasChrome
    ? isLight
      ? "border-black/10 bg-white/95 text-black backdrop-blur-md"
      : "border-white/10 bg-[#161616]/92 text-white backdrop-blur-md"
    : "border-transparent bg-transparent text-white";

  const linkCls = hasChrome
    ? isLight
      ? "text-black hover:text-black/60"
      : "text-white hover:text-white/65"
    : "text-white hover:text-white/65";

  const ctaCls = hasChrome
    ? isLight
      ? "border-black bg-black text-white hover:bg-black/85"
      : "border-white bg-white text-black hover:bg-white/90"
    : "border-white bg-white text-black hover:bg-white/90";

  const logoMarkCls = hasChrome
    ? isLight
      ? "bg-black text-white"
      : "bg-white text-black"
    : "bg-white text-black";

  return (
    <header
      className={`fixed top-0 left-0 z-50 flex w-full flex-col items-center border-b p-2 transition-[background-color,border-color,color] duration-300 md:top-4 md:left-1/2 md:w-[calc(100%-2rem)] md:max-w-[1240px] md:-translate-x-1/2 md:border md:px-2 md:py-[8px] ${headerCls}`}
    >
      <div className="w-full">
        <nav className="flex items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-3 px-2 font-ui-mono text-sm tracking-[-0.28px]"
          >
            <span
              className={`flex size-6 items-center justify-center rounded-full transition-colors duration-300 ${logoMarkCls}`}
            >
              <BrainCircuit size={14} />
            </span>
            <span className="font-medium uppercase">REVENANT</span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-5 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-2 font-ui-mono text-sm tracking-[-0.28px] transition-colors duration-300 ${linkCls}`}
              >
                {link.label.toUpperCase()}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center lg:flex">
            {/* TODO: Replace "#early-access" with Calendly or form URL when ready */}
            <a
              href="#early-access"
              className={`border px-4 py-2 font-ui-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 ${ctaCls}`}
            >
              Request Early Access
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-8 items-center justify-center lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div
            className={`w-full overflow-hidden border-t pt-4 lg:hidden ${
              isLight ? "border-black/10" : "border-white/10"
            }`}
          >
            <div className="flex flex-col gap-3 pb-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-2 py-2 font-ui-mono text-sm tracking-[-0.28px] ${
                    hasChrome ? (isLight ? "text-black" : "text-white") : "text-white"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label.toUpperCase()}
                </a>
              ))}
              <div className="mt-2">
                {/* TODO: Replace "#early-access" with Calendly or form URL when ready */}
                <a
                  href="#early-access"
                  className={`inline-flex border px-4 py-2 font-ui-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${ctaCls}`}
                  onClick={() => setOpen(false)}
                >
                  Request Early Access
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Logo marquee ─────────────────────────────────────────────────────────────
function LogoMarquee({ inverted = true }: { inverted?: boolean }) {
  return (
    <div className={`relative flex w-full items-center justify-center ${inverted ? "invert" : ""}`}>
      <div
        className="logoloop rev-logoloop w-full max-w-[960px] overflow-hidden px-4 py-3 grayscale"
        style={{
          ["--logoloop-gap" as string]: "36px",
          ["--logoloop-logoHeight" as string]: "24px",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 16%, black 84%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 16%, black 84%, transparent 100%)",
        }}
      >
        <div className="logoloop__track">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="logoloop__list"
              role="list"
              aria-hidden={copy === 1 ? true : undefined}
            >
              {integrations.map((item, index) => (
                <li
                  key={`${item.name}-${copy}-${index}`}
                  className="logoloop__item"
                  role="listitem"
                  style={{ width: `${item.width}px` }}
                >
                  <Image
                    src={item.src}
                    alt={item.name}
                    width={item.width}
                    height={item.height}
                    className="w-auto object-contain"
                    style={{ height: "28px" }}
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Orb demo (visual only — no Tavus interactive session) ─────────────────────
function OrbDemo() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [phase, setPhase] = useState<
    "typing" | "thinking" | "answering" | "sources" | "idle"
  >("idle");
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const [simLevel, setSimLevel] = useState(0);
  // pullLog: each entry is "pulling" while fetching, "done" when complete
  const [pullLog, setPullLog] = useState<Array<"pulling" | "done">>([]);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scenario = DEMO_SCENARIOS[scenarioIdx];

  const schedule = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  };

  const clearAll = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(([e]) => setIsInView(e.isIntersecting), {
      threshold: 0.3,
    });
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const runScenario = useCallback(() => {
    const sc = DEMO_SCENARIOS[scenarioIdx];
    setDisplayedQuestion("");
    setDisplayedAnswer("");
    setPullLog([]);
    setPhase("typing");

    let qi = 0;
    const typeQuestion = () => {
      if (qi <= sc.question.length) {
        setDisplayedQuestion(sc.question.slice(0, qi));
        setSimLevel(qi % 3 === 0 ? 0.3 + Math.random() * 0.4 : 0.1);
        qi++;
        schedule(typeQuestion, 28 + Math.random() * 22);
      } else {
        setSimLevel(0);
        setPhase("thinking");

        // Stagger pull log entries: each takes 520ms (pull → done → next)
        const PULL_STEP = 520;
        sc.pulls.forEach((_, i) => {
          // show "pulling" for item i
          schedule(() => {
            setPullLog((prev) => {
              const next = [...prev];
              next[i] = "pulling";
              return next;
            });
          }, i * PULL_STEP);
          // mark item i as "done"
          schedule(() => {
            setPullLog((prev) => {
              const next = [...prev];
              next[i] = "done";
              return next;
            });
          }, i * PULL_STEP + 380);
        });

        // After all pulls, switch to answering
        const thinkingDuration = sc.pulls.length * PULL_STEP + 300;
        schedule(() => {
          setPhase("answering");
          let ai = 0;
          const typeAnswer = () => {
            if (ai <= sc.answer.length) {
              setDisplayedAnswer(sc.answer.slice(0, ai));
              setSimLevel(ai % 4 === 0 ? 0.15 + Math.random() * 0.25 : 0.05);
              ai++;
              schedule(typeAnswer, 16 + Math.random() * 14);
            } else {
              setSimLevel(0);
              setPhase("sources");
              schedule(() => {
                setPhase("idle");
                schedule(() => {
                  setScenarioIdx((p) => (p + 1) % DEMO_SCENARIOS.length);
                }, 3000);
              }, 2500);
            }
          };
          typeAnswer();
        }, thinkingDuration);
      }
    };
    typeQuestion();
  }, [scenarioIdx]);

  useEffect(() => {
    if (!isInView) return;
    runScenario();
    return () => clearAll();
  }, [isInView, scenarioIdx, runScenario]);

  const phaseLabel =
    phase === "typing"
      ? "LISTENING"
      : phase === "thinking"
      ? "PULLING DATA"
      : phase === "answering"
      ? "RESPONDING"
      : phase === "sources"
      ? "SOURCES ATTACHED"
      : "STANDBY";

  return (
    <div
      ref={sectionRef}
      className="relative z-10 mx-auto w-full max-w-[1100px] px-4 lg:px-0"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-12">
        {/* Orb */}
        <div className="flex flex-col items-center gap-5">
          <div className="relative h-[300px] w-[300px] md:h-[360px] md:w-[360px]">
            <VoicePoweredOrb
              hue={25}
              enableVoiceControl={false}
              simulatedLevel={simLevel}
              className="overflow-hidden"
            />
          </div>
          <div className="flex items-center gap-2">
            <span
              className="size-2"
              style={{
                borderRadius: "50%",
                background:
                  phase === "idle" ? "rgba(255,255,255,0.15)" : "#ffb25d",
                boxShadow:
                  phase !== "idle" ? "0 0 12px rgba(255,178,93,0.6)" : "none",
                transition: "all 0.3s",
              }}
            />
            <span className="font-ui-mono text-[10px] tracking-[0.12em] text-white/30">
              {phaseLabel}
            </span>
          </div>
        </div>

        {/* Chat simulation */}
        <div className="flex flex-col border border-white/[0.08] bg-[#0a0a0a]">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3">
            <span className="size-[5.82px] bg-[#ffb25d]" />
            <span className="font-ui-mono text-[11px] tracking-[-0.28px] text-white/40">
              REVENANT MEMORY
            </span>
          </div>

          <div className="flex min-h-[300px] flex-col gap-5 px-5 py-6">
            {/* Question bubble */}
            <AnimatePresence mode="wait">
              {displayedQuestion && (
                <motion.div
                  key={`q-${scenarioIdx}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="self-end"
                >
                  <div className="border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-[14px] leading-relaxed text-white/60">
                    &ldquo;{displayedQuestion}
                    {phase === "typing" && (
                      <span className="ml-0.5 inline-block h-4 w-[2px] bg-[#ffb25d] animate-blink" />
                    )}
                    &rdquo;
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pull log — shown during thinking phase and persists after */}
            <AnimatePresence>
              {(phase === "thinking" || phase === "answering" || phase === "sources" || phase === "idle") &&
                pullLog.length > 0 && (
                <motion.div
                  key={`pulls-${scenarioIdx}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-1.5 border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                >
                  {pullLog.map((state, i) => {
                    const pull = scenario.pulls[i];
                    if (!pull) return null;
                    const isDone = state === "done";
                    return (
                      <motion.div
                        key={`${scenarioIdx}-pull-${i}`}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-0.5"
                      >
                        {/* "Pulling from" row */}
                        <div className="flex items-center gap-2">
                          <span
                            className="font-ui-mono text-[10px]"
                            style={{ color: isDone ? "#4ade80" : "#ffb25d" }}
                          >
                            {isDone ? "✓" : "●"}
                          </span>
                          <span className="font-ui-mono text-[10px] text-white/30">
                            {isDone ? "pulled from" : "pulling from"}
                          </span>
                          <span className="relative h-[14px] w-[14px] shrink-0">
                            <Image
                              src={pull.logo}
                              alt={pull.app}
                              fill
                              sizes="14px"
                              className="object-contain opacity-60"
                            />
                          </span>
                          <span
                            className="font-ui-mono text-[10px]"
                            style={{ color: isDone ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)" }}
                          >
                            {pull.app}
                          </span>
                        </div>
                        {/* Pulled ref + id */}
                        {isDone && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="ml-4 flex items-center gap-1.5"
                          >
                            <span className="font-ui-mono text-[9px] text-white/25">↳</span>
                            <span className="font-ui-mono text-[9px] text-[#ffb25d]/70">
                              {pull.ref}
                            </span>
                            <span className="font-ui-mono text-[9px] text-white/20">·</span>
                            <span className="font-ui-mono text-[9px] text-white/20">
                              {pull.id}
                            </span>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Answer */}
            <AnimatePresence mode="wait">
              {displayedAnswer && (
                <motion.div
                  key={`a-${scenarioIdx}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="border-l-2 border-[#ffb25d] pl-4 text-[15px] leading-relaxed text-white/75">
                    {displayedAnswer}
                    {phase === "answering" && (
                      <span className="ml-0.5 inline-block h-4 w-[2px] bg-[#ffb25d] animate-blink" />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sources */}
            <AnimatePresence>
              {(phase === "sources" || phase === "idle") &&
                scenario.sources &&
                displayedAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-auto flex flex-wrap gap-2"
                  >
                    {scenario.sources.map((src, i) => (
                      <motion.span
                        key={src}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.12 }}
                        className="border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 font-ui-mono text-[10px] tracking-[-0.28px] text-[#ffb25d]"
                      >
                        {src}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Why Omniate — composio-style tabbed section ─────────────────────────────
function WhyOmniate() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const DURATION_MS = 4800;

  // Only start the timer once the section enters the viewport
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => setIsInView(e.isIntersecting),
      { threshold: 0.25 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || paused) return;

    setProgress(0);
    const startTime = Date.now();

    const tick = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(elapsed / DURATION_MS, 1);
      setProgress(pct);
      if (elapsed >= DURATION_MS) {
        clearInterval(tick);
        setActiveIdx((prev) => (prev + 1) % whyCards.length);
      }
    }, 40);

    return () => clearInterval(tick);
  }, [activeIdx, paused, isInView]);

  const handleSelect = (idx: number) => {
    setActiveIdx(idx);
    setPaused(false);
  };

  const card = whyCards[activeIdx];
  const Icon = card.icon;

  return (
    <section
      ref={sectionRef}
      id="why"
      data-nav-theme="dark"
      className="bg-[#0a0a0a] px-4 py-20 md:px-6 md:py-28"
    >
      <div className="mx-auto w-full max-w-[1240px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={reveal}
          className="mb-14 flex flex-col gap-5"
        >
          <SectionLabel>WHY REVENANT</SectionLabel>
          <h2 className="font-display text-3xl leading-[0.9] text-[#f6f6f6] md:text-4xl lg:text-[48px]">
            Not another AI search bar.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={reveal}
          className="grid border border-white/[0.08] lg:grid-cols-[2fr_3fr]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Left: numbered tab list */}
          <div className="flex flex-col divide-y divide-white/[0.06] border-b border-white/[0.08] lg:border-b-0 lg:border-r lg:border-white/[0.08]">
            {whyCards.map((item, i) => {
              const isActive = i === activeIdx;
              return (
                <button
                  key={item.num}
                  type="button"
                  onClick={() => handleSelect(i)}
                  className={`relative flex flex-col gap-2 px-7 py-6 text-left transition-colors duration-200 lg:px-8 lg:py-7 ${
                    isActive ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`shrink-0 font-ui-mono text-[11px] tracking-[0.14em] transition-colors duration-200 ${
                        isActive ? "text-[#ffb25d]" : "text-white/20"
                      }`}
                    >
                      {item.num}
                    </span>
                    <span
                      className={`text-[15px] leading-snug transition-colors duration-200 ${
                        isActive ? "text-white" : "text-white/35"
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                  {/* Progress bar */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 h-[1.5px] w-full bg-white/[0.06]">
                      <div
                        className="h-full bg-[#ffb25d]"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: feature display panel */}
          <div className="relative min-h-[300px] overflow-hidden lg:min-h-[460px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex flex-col justify-between p-8 lg:p-12"
              >
                {/* Background accent */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,178,93,0.06),transparent_52%)]" />

                <div className="relative flex flex-col gap-7">
                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center border border-[#ffb25d]/[0.25] bg-[#ffb25d]/[0.08]">
                    <Icon size={20} className="text-[#ffb25d]" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-2xl leading-snug text-white lg:text-[28px]">
                      {card.title}
                    </h3>
                    <p className="mt-4 max-w-[480px] text-base leading-relaxed text-white/55">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Tag */}
                <div className="relative mt-10">
                  <span className="border border-white/[0.08] px-3 py-1.5 font-ui-mono text-[10px] tracking-[0.22em] text-white/20">
                    {card.tag}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function OmniateHomepage() {
  return (
    <div className="rev-page bg-[#050505] text-white">
      <Nav />

      <main className="overflow-hidden">
        {/* ═══════════════════════════════════════════════════════
            SECTION 1 — HERO
        ═══════════════════════════════════════════════════════ */}
        <section
          data-nav-theme="dark"
          className="rev-hero-grid rev-noise relative overflow-hidden bg-[#120d09] px-3 pt-[40px] md:px-5 md:pt-[48px]"
        >
          <div className="pointer-events-none absolute inset-0">
            <OmniateHeroCanvas />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[18vh] bg-[linear-gradient(180deg,rgba(18,13,9,0)_0%,rgba(18,13,9,0.08)_24%,rgba(18,13,9,0.4)_62%,rgba(18,13,9,0.82)_100%)]" />

          <div className="relative mx-auto flex min-h-[min(700px,calc(100dvh-40px))] w-full max-w-[1480px] flex-col justify-between pb-10 md:min-h-[min(740px,calc(100dvh-48px))] md:pb-14">
            <div className="grid flex-1 grid-cols-1 gap-6 pt-0 pb-4 lg:grid-cols-12 lg:gap-y-0 lg:pt-1 lg:pb-4">
              {/* Headline */}
              <div className="order-1 flex items-end lg:col-span-8 lg:row-start-1">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={reveal}
                  className="max-w-[980px]"
                >
                  <h1 className="font-display text-[21vw] leading-[0.88] tracking-[-0.06em] text-[#f8efe2] sm:text-[17vw] lg:text-[10.2rem] xl:text-[12.5rem]">
                    Revenant
                    <br />
                    remembers.
                  </h1>
                </motion.div>
              </div>

              {/* Sub-copy + CTA */}
              <div className="order-2 flex items-start lg:col-span-4 lg:row-start-1 lg:pl-8">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  custom={0.15}
                  variants={reveal}
                  className="max-w-[360px] border-l border-[#efe4d2]/25 lg:mt-[8.5rem] lg:pb-8 lg:pl-8"
                >
                  <p className="text-[clamp(1.05rem,2.1vw,1.55rem)] leading-[1.2] tracking-[-0.025em] text-[#f5ecdf]">
                    Omniate is an AI system that lives inside your infrastructure,
                    connects every tool your company uses, and turns scattered
                    knowledge into a single intelligent brain.
                  </p>

                  <div className="mt-8 flex flex-col gap-3">
                    {/* TODO: Replace href with Calendly or early-access form URL */}
                    <a
                      href="#early-access"
                      className="inline-flex w-fit items-center justify-center border border-[#d59a52] bg-[#d59a52] px-5 py-3 font-ui-mono text-[11px] uppercase tracking-[0.16em] text-[#120d09] transition-colors hover:bg-[#e5ab62]"
                    >
                      Request Early Access
                    </a>
                    <p className="font-ui-mono text-[10px] uppercase tracking-[0.12em] text-[#f5ecdf]/40">
                      Onboarding design partners now.&nbsp; Investors, let's talk.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Horizontal rule */}
              <div className="order-3 hidden lg:col-span-12 lg:row-start-2 lg:block">
                <div className="grid grid-cols-12">
                  <div className="col-span-8 border-t border-[#efe4d2]/20" />
                  <div className="col-span-4 border-t border-[#efe4d2]/20" />
                </div>
              </div>
              <div className="order-3 border-t border-[#efe4d2]/20 lg:hidden" />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 2 — DEMO ANIMATION (visual only)
        ═══════════════════════════════════════════════════════ */}
        <section
          data-nav-theme="dark"
          className="bg-[#0f0f0f] px-4 py-16 md:px-6 md:py-24"
        >
          <div className="mx-auto w-full max-w-[1240px]">
            {/* Label */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={reveal}
              className="mb-12 flex flex-col items-center gap-2 text-center"
            >
              <div className="flex items-center gap-2">
                <span className="size-[5.82px] bg-white/30" />
                <span className="font-ui-mono text-[10px] uppercase tracking-[0.24em] text-white/35">
                  SEE IT IN ACTION
                </span>
              </div>
            </motion.div>

            <OrbDemo />

            <motion.p
              initial="hidden"
              whileInView="visible"
              custom={0.1}
              viewport={{ once: true, margin: "-40px" }}
              variants={reveal}
              className="mt-10 text-center font-ui-mono text-sm leading-relaxed text-white/30"
            >
              Omniate answers from real company context, not generic training data.
            </motion.p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 3 — THE PROBLEM
        ═══════════════════════════════════════════════════════ */}
        <section id="problem" data-nav-theme="light" className="bg-[#f5f5f5]">
          <div className="mx-auto w-full max-w-[1240px] border-x border-black/[0.06] px-6 py-16 md:py-24 lg:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={reveal}
              className="flex flex-col gap-5"
            >
              <SectionLabel light>THE PROBLEM</SectionLabel>
              <h2 className="max-w-[700px] font-display text-3xl leading-[0.95] text-black md:text-4xl lg:text-[48px]">
                Context is your company's most valuable asset. And you're losing
                it daily.
              </h2>
            </motion.div>

            <div className="mt-12 grid gap-px border border-black/[0.08] bg-black/[0.08] md:grid-cols-3">
              {[
                "Your best people leave. Years of decision-making context, institutional reasoning, and tribal knowledge disappears overnight.",
                "New hires join. They spend months asking questions that have already been answered in threads, docs, and tools nobody can find.",
                "Something breaks or gets missed. Teams scramble across a dozen tools trying to reconstruct what happened and why.",
              ].map((text, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  custom={i * 0.1}
                  viewport={{ once: true, margin: "-60px" }}
                  variants={reveal}
                  className="flex flex-col gap-8 bg-[#f5f5f5] px-8 py-10"
                >
                  <span className="font-ui-mono text-[11px] tracking-[0.2em] text-black/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[17px] leading-[1.55] text-black/85">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 4 — THE SOLUTION
        ═══════════════════════════════════════════════════════ */}
        <section
          id="solution"
          data-nav-theme="dark"
          className="bg-[#0f0f0f] px-4 py-16 md:px-6 md:py-24"
        >
          <div className="mx-auto w-full max-w-[1240px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={reveal}
              className="mb-12 flex flex-col gap-5"
            >
              <SectionLabel>THE SOLUTION</SectionLabel>
              <h2 className="font-display text-3xl leading-[0.9] text-[#f6f6f6] md:text-4xl lg:text-[48px]">
                One brain. Three layers of intelligence.
              </h2>
            </motion.div>

            <div className="grid gap-px border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
              {[
                {
                  title: "Individual",
                  icon: User,
                  description:
                    "Every employee gets a personal AI that knows their role, background, and current work. They control what goes in. Nobody else sees it.",
                },
                {
                  title: "Team",
                  icon: Users,
                  description:
                    "Omniate understands team structure, priorities, and shared context. It knows who's working on what without leaking personal information across boundaries.",
                },
                {
                  title: "Company",
                  icon: Building2,
                  description:
                    "A living knowledge layer across the entire organization. Granular access control ensures the right person sees the right context at the right time. Nothing more.",
                },
              ].map((col, i) => {
                const Icon = col.icon;
                return (
                  <motion.div
                    key={col.title}
                    initial="hidden"
                    whileInView="visible"
                    custom={i * 0.1}
                    viewport={{ once: true, margin: "-60px" }}
                    variants={reveal}
                    className="flex flex-col gap-8 bg-[#0f0f0f] px-8 py-10 lg:px-10"
                  >
                    <div className="flex h-11 w-11 items-center justify-center border border-white/10 bg-white/[0.05]">
                      <Icon size={18} className="text-[#ffb25d]" />
                    </div>
                    <div>
                      <h3 className="text-xl text-white">{col.title}</h3>
                      <p className="mt-4 text-base leading-relaxed text-white/52">
                        {col.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 5 — WHY REVENANT (composio-style tabs)
        ═══════════════════════════════════════════════════════ */}
        <WhyOmniate />

        {/* ═══════════════════════════════════════════════════════
            SECTION 6 — HOW IT WORKS
        ═══════════════════════════════════════════════════════ */}
        <section
          id="how-it-works"
          data-nav-theme="light"
          className="bg-[#f5f5f5]"
        >
          <div className="mx-auto w-full max-w-[1240px] border-x border-black/[0.06] px-6 py-16 md:py-24 lg:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={reveal}
              className="mb-12 flex flex-col gap-5"
            >
              <SectionLabel light>HOW IT WORKS</SectionLabel>
              <h2 className="max-w-[580px] font-display text-3xl leading-[0.95] text-black md:text-4xl lg:text-[48px]">
                Deploy in your environment. Connect your tools. Let it learn.
              </h2>
            </motion.div>

            {/* Steps */}
            <div>
              {[
                {
                  step: "01",
                  title: "Connect",
                  description:
                    "Omniate integrates with 1000+ tools your company already uses. Slack, Jira, GitHub, Salesforce, Google Workspace, Confluence, and more. No workflow changes required.",
                },
                {
                  step: "02",
                  title: "Learn",
                  description:
                    "The system builds a living knowledge graph of your organization. People, teams, projects, decisions, patterns. It gets smarter every day it runs.",
                },
                {
                  step: "03",
                  title: "Act",
                  description:
                    "Employees ask questions and get answers grounded in real company context. But Omniate also works in the background — catching issues, surfacing relevant knowledge, and taking action when it's needed.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial="hidden"
                  whileInView="visible"
                  custom={i * 0.1}
                  viewport={{ once: true, margin: "-60px" }}
                  variants={reveal}
                  className={`flex flex-col gap-4 border-t border-black/[0.08] py-9 md:flex-row md:items-start md:gap-16 ${
                    i === 2 ? "border-b" : ""
                  }`}
                >
                  <span className="shrink-0 font-ui-mono text-[11px] tracking-[0.2em] text-black/50 md:w-12">
                    {item.step}
                  </span>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-2xl text-black">{item.title}</h3>
                    <p className="max-w-[580px] text-base leading-relaxed text-black/72">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Integration logo strip */}
            <div className="mt-14 border-t border-black/[0.06] pt-12">
              <p className="mb-6 text-center font-ui-mono text-[10px] uppercase tracking-[0.2em] text-black/52">
                Integrates with
              </p>
              <LogoMarquee inverted={false} />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 7 — WHO IT'S FOR
        ═══════════════════════════════════════════════════════ */}
        <section
          data-nav-theme="dark"
          className="bg-[#080808] px-4 py-16 md:px-6 md:py-24"
        >
          <div className="mx-auto w-full max-w-[1240px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={reveal}
              className="mb-12 flex flex-col gap-5"
            >
              <SectionLabel>BUILT FOR</SectionLabel>
              <h2 className="font-display text-3xl leading-[0.9] text-[#f6f6f6] md:text-4xl lg:text-[48px]">
                Any company that can't afford to lose what it knows.
              </h2>
            </motion.div>

            <div className="grid gap-px border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
              {[
                {
                  title: "Growing companies",
                  description:
                    "You're scaling fast. Every new hire takes months to ramp up. Omniate compresses onboarding by giving them access to the full reasoning behind how things are done.",
                },
                {
                  title: "Companies with turnover",
                  description:
                    "When experienced people leave, their context shouldn't leave with them. Omniate captures the reasoning behind decisions, not just the decisions themselves.",
                },
                {
                  title: "Complex operations",
                  description:
                    "No single person understands your entire operation. Omniate does. It connects context across teams, departments, and tools so the full picture is always available.",
                },
              ].map((block, i) => (
                <motion.div
                  key={block.title}
                  initial="hidden"
                  whileInView="visible"
                  custom={i * 0.1}
                  viewport={{ once: true, margin: "-60px" }}
                  variants={reveal}
                  className="flex flex-col gap-7 bg-[#080808] px-8 py-10 lg:px-10"
                >
                  <span className="font-ui-mono text-[11px] tracking-[0.2em] text-white/20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl text-white">{block.title}</h3>
                    <p className="mt-4 text-base leading-relaxed text-white/52">
                      {block.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 8 — THE TEAM
        ═══════════════════════════════════════════════════════ */}
        <section id="team" data-nav-theme="light" className="bg-[#f5f5f5]">
          <div className="mx-auto w-full max-w-[1240px] border-x border-black/[0.06] px-6 py-16 md:py-24 lg:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={reveal}
              className="flex flex-col gap-5"
            >
              <SectionLabel light>THE TEAM</SectionLabel>
              <h2 className="max-w-[680px] font-display text-3xl leading-[0.95] text-black md:text-4xl lg:text-[48px]">
                Built by people who understand the problem firsthand.
              </h2>
              <p className="max-w-[640px] text-base leading-relaxed text-black/72">
                Omniate won the Moorcheh AI track (Best AI Application that
                Leverages Efficient Memory) at GenAI Genesis 2026,
                Canada&apos;s largest AI hackathon. Our team brings experience across
                cybersecurity, full-stack engineering, and venture capital.
                Currently raising a pre-seed round.
              </p>
            </motion.div>

            <div className="mt-12 grid grid-cols-2 gap-px border border-black/[0.08] bg-black/[0.08] sm:grid-cols-4">
              {[
                {
                  name: "Omar Ibrahim",
                  role: "Web Developer & Security Auditor · Cybersecurity @ Competitech Inc.",
                  school: "Carleton University",
                  img: "/omar.jpeg",
                },
                {
                  name: "Ved Thakar",
                  role: "VC Analyst @ Orbit Capital · Backend @ Geotab",
                  school: "University of Toronto",
                  img: "/ved.jpeg",
                },
                {
                  name: "Seeron Sivashankar",
                  role: "SWE @ Brainweber · 3× Hackathon winner",
                  school: "University of Toronto",
                  img: "/seeron.png",
                },
                {
                  name: "Akash Nagabhirava",
                  role: "Incoming @ TD · 5× Hackathon winner",
                  school: "University of Toronto",
                  img: "/akash.png",
                },
              ].map((member, i) => (
                <motion.div
                  key={member.name}
                  initial="hidden"
                  whileInView="visible"
                  custom={i * 0.08}
                  viewport={{ once: true, margin: "-40px" }}
                  variants={reveal}
                  className="flex flex-col gap-4 bg-[#f5f5f5] p-7"
                >
                  <div className="relative h-14 w-14 overflow-hidden">
                    <Image
                      src={member.img}
                      alt={member.name}
                      fill
                      sizes="56px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black/80">{member.name}</p>
                    <p className="mt-1 font-ui-mono text-[11px] leading-snug tracking-[-0.28px] text-black/60">
                      {member.role}
                    </p>
                    <p className="mt-1 font-ui-mono text-[10px] tracking-[0.06em] text-black/52">
                      {member.school}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial="hidden"
              whileInView="visible"
              custom={0.1}
              viewport={{ once: true, margin: "-40px" }}
              variants={reveal}
              className="mt-8 font-ui-mono text-sm tracking-[-0.28px] text-black/60"
            >
              Advised by professionals in venture capital and enterprise technology.
            </motion.p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 9 — FOOTER CTA
        ═══════════════════════════════════════════════════════ */}
        <section
          id="early-access"
          data-nav-theme="dark"
          className="bg-[#050505] px-4 py-24 md:py-32"
        >
          <div className="mx-auto w-full max-w-[860px] text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={reveal}
              className="flex flex-col items-center gap-7"
            >
              <h2 className="font-display text-3xl leading-[0.92] tracking-[-0.04em] text-[#f8efe2] md:text-4xl lg:text-[56px]">
                We&apos;re looking for our first
                <br className="hidden md:block" /> design partners.
              </h2>

              <p className="max-w-[520px] text-base leading-relaxed text-white/45">
                If your company is growing and institutional knowledge is slipping
                through the cracks, we want to talk.
              </p>

              <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
                {/* TODO: Replace href with Calendly URL or early-access form */}
                <a
                  href="#"
                  className="inline-flex h-12 items-center justify-center border border-[#d59a52] bg-[#d59a52] px-8 font-ui-mono text-[11px] uppercase tracking-[0.16em] text-[#120d09] transition-colors hover:bg-[#e5ab62]"
                >
                  Request Early Access
                </a>

                {/* TODO: Replace href with investor contact form or email mailto link */}
                <a
                  href="#"
                  className="inline-flex h-12 items-center justify-center border border-white/[0.18] px-8 font-ui-mono text-[11px] uppercase tracking-[0.16em] text-white/60 transition-colors hover:border-white/[0.35] hover:text-white/90"
                >
                  Investor Inquiries
                </a>
              </div>

              <p className="font-ui-mono text-[11px] tracking-[0.1em] text-white/28">
                Or reach out directly at{" "}
                <a
                  href="mailto:omarmgmi08@gmail.com"
                  className="text-white/45 transition-colors hover:text-white/65"
                >
                  omarmgmi08@gmail.com
                </a>
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer bar */}
        <div
          data-nav-theme="dark"
          className="border-t border-white/[0.06] bg-[#050505] px-4 py-6"
        >
          <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BrainCircuit size={14} className="text-white/25" />
              <span className="font-ui-mono text-[11px] tracking-[-0.28px] text-white/25 uppercase">
                Revenant
              </span>
            </div>
            <span className="font-ui-mono text-[11px] text-white/20">
              Pre-seed · 2026
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

