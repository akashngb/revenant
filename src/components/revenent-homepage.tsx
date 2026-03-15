"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  ChevronRight,
  Circle,
  CircleCheck,
  Database,
  GitPullRequestArrow,
  type LucideIcon,
  Menu,
  MessageSquareShare,
  Network,
  RotateCcw,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

const navLinks = [
  { href: "#product", label: "Product" },
  { href: "#workflows", label: "Workflows" },
  { href: "#integrations", label: "Integrations" },
  { href: "#pilot", label: "Pilot" },
];

const integrations = [
  { name: "Slack", src: "/slack.png", width: 112, height: 34 },
  { name: "GitHub", src: "/github.png", width: 112, height: 34 },
  { name: "Jira", src: "/jira.png", width: 112, height: 34 },
  { name: "Gmail", src: "/gmail.webp", width: 112, height: 34 },
];

const pillars = [
  {
    icon: BrainCircuit,
    title: "Memory capture that keeps the why",
    description:
      "Pull decisions out of PRs, Slack threads, tickets, and handoffs before they dissolve into folklore.",
  },
  {
    icon: MessageSquareShare,
    title: "A mentor interface engineers will use",
    description:
      "Ask why a service exists, what broke last quarter, or who approved a pattern and get grounded answers back.",
  },
  {
    icon: Network,
    title: "Cross-tool recall instead of scattered context",
    description:
      "Revenent stitches source material into one queryable memory layer instead of another disconnected dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Auditable context for onboarding and incidents",
    description:
      "Trace every answer back to the source artifact so institutional memory stays inspectable, not hallucinatory.",
  },
];

const workflowRows = [
  {
    title: "Capture",
    copy: "Sync GitHub activity, tickets, inboxes, and team chat into one memory stream without asking engineers to write more docs.",
    label: "INGESTION",
  },
  {
    title: "Interpret",
    copy: "Cluster repeated decisions, summarize tradeoffs, and promote important context into durable company memory.",
    label: "PROMOTION",
  },
  {
    title: "Mentor",
    copy: "Give every engineer an always-on context partner for architecture questions, legacy systems, and incident history.",
    label: "RECALL",
  },
];

const auditTrail = [
  {
    event: "Auth service rollback approved",
    source: "GitHub PR #481",
    impact: "Recovered deploy in 12m",
  },
  {
    event: "Billing retry policy changed",
    source: "Slack #platform-ops",
    impact: "Cut duplicate charges",
  },
  {
    event: "Search shard split postponed",
    source: "Jira ARC-219",
    impact: "Avoided risky migration",
  },
  {
    event: "On-call runbook updated",
    source: "Gmail vendor thread",
    impact: "Faster escalation path",
  },
];

type DemoPanelKey = "capture" | "connections" | "sandbox" | "execute";

type DemoMessageId = "capture" | "connections" | "sandbox" | "answer" | "execute" | "result";

type DemoTool = {
  icon: LucideIcon;
  name: string;
  description: string;
  badge: string;
};

type DemoConnection = {
  icon: LucideIcon;
  name: string;
  meta: string;
  status: string;
};

type DemoMessage = {
  id: DemoMessageId;
  kind: "tool" | "assistant";
  text: string;
  panel?: DemoPanelKey;
};

type DemoTimelineStep = {
  delay: number;
  items: DemoMessageId[];
  activePanels: DemoPanelKey[];
  thinking?: boolean;
};

type DemoScenario = {
  id: string;
  prompt: string;
  capture: {
    query: string;
    found: string;
    tools: DemoTool[];
    plan: string[];
    warnings: string[];
  };
  connections: DemoConnection[];
  execute: {
    tool: string;
    session: string;
    rows: Array<[string, string]>;
    status: string;
  };
  agent: {
    agent: string;
    provider: string;
    model: string;
  };
  sandbox: string;
  messages: DemoMessage[];
};

const demoTimeline: DemoTimelineStep[] = [
  { delay: 950, items: ["capture"], activePanels: ["capture"] },
  { delay: 650, items: ["capture", "connections"], activePanels: ["connections"] },
  { delay: 2800, items: ["capture", "connections"], activePanels: ["connections"], thinking: true },
  { delay: 3200, items: ["capture", "connections", "sandbox", "answer"], activePanels: ["sandbox"] },
  { delay: 1200, items: ["capture", "connections", "sandbox", "answer", "execute"], activePanels: ["execute"] },
  { delay: 1600, items: ["capture", "connections", "sandbox", "answer", "execute"], activePanels: ["execute"], thinking: true },
  {
    delay: 2400,
    items: ["capture", "connections", "sandbox", "answer", "execute", "result"],
    activePanels: ["execute"],
  },
];

const demoScenarios: DemoScenario[] = [
  {
    id: "auth-retries",
    prompt: "Why did the team keep auth retry logic inside deploy sequencing instead of moving it into the worker queue?",
    capture: {
      query: "find why auth retry stayed in deploy sequencing",
      found: "3 found",
      tools: [
        {
          icon: MessageSquareShare,
          name: "SLACK_INCIDENT_THREADS",
          description: "Pull approval-heavy incident discussion from #auth-war-room",
          badge: "MATCH",
        },
        {
          icon: GitPullRequestArrow,
          name: "GITHUB_PR_REASONING",
          description: "Extract review tradeoffs, rollback notes, and deploy comments",
          badge: "MATCH",
        },
        {
          icon: Database,
          name: "JIRA_ARC_LINKER",
          description: "Attach ARC-219 ownership and follow-up remediation context",
          badge: "MATCH",
        },
      ],
      plan: [
        "Find incident and review threads",
        "Batch rationale into one memory packet",
        "Promote source-grounded answer",
      ],
      warnings: ["! missing postmortem link", "! stale owner on ARC-219"],
    },
    connections: [
      { icon: MessageSquareShare, name: "Slack", meta: "OAuth 2.0", status: "Connected" },
      { icon: GitPullRequestArrow, name: "GitHub", meta: "GitHub App", status: "Connected" },
      { icon: Database, name: "Jira", meta: "OAuth 2.0", status: "Connected" },
    ],
    execute: {
      tool: "REVENENT_PROMOTE_MEMORY",
      session: "sx-auth9",
      rows: [
        ["memory", "Auth deploy retry decision"],
        ["evidence", "3 linked sources"],
      ],
      status: "200 OK - memory promoted",
    },
    agent: {
      agent: "Revenent Mentor",
      provider: "OpenAI",
      model: "gpt-5",
    },
    sandbox: "memory graph - source-grounded recall",
    messages: [
      { id: "capture", kind: "tool", text: "REVENENT_CAPTURE_PIPELINE", panel: "capture" },
      { id: "connections", kind: "tool", text: "REVENENT_MANAGE_CONNECTIONS", panel: "connections" },
      { id: "sandbox", kind: "tool", text: "REVENENT_SANDBOX", panel: "sandbox" },
      {
        id: "answer",
        kind: "assistant",
        text: "Revenent found the decision in GitHub review threads, a Slack incident channel, and the Jira follow-up. The team kept sequencing coupled because queue lag caused token expiry during blue-green deploys.",
      },
      { id: "execute", kind: "tool", text: "REVENENT_EXECUTE_MEMORY", panel: "execute" },
      {
        id: "result",
        kind: "assistant",
        text: "All done. The memory packet was promoted with linked evidence and is now queryable by the mentor.",
      },
    ],
  },
  {
    id: "billing-retries",
    prompt: "Why did billing stop retrying failed renewals immediately after the duplicate-charge incident?",
    capture: {
      query: "trace duplicate-charge incident and billing retry change",
      found: "4 found",
      tools: [
        {
          icon: MessageSquareShare,
          name: "SLACK_BILLING_SUMMARY",
          description: "Collect incident updates, approvals, and finance handoff notes",
          badge: "MATCH",
        },
        {
          icon: Database,
          name: "INCIDENT_DB_LINKER",
          description: "Tie the incident issue, remediation tasks, and owners together",
          badge: "MATCH",
        },
        {
          icon: GitPullRequestArrow,
          name: "GITHUB_POLICY_DIFF",
          description: "Pull the retry policy diff and the rollout commentary",
          badge: "MATCH",
        },
      ],
      plan: [
        "Find incident timeline and rollback notes",
        "Cross-check policy diff with approvals",
        "Promote billing retry rationale",
      ],
      warnings: ["! finance sign-off in thread only", "! vendor note missing ticket link"],
    },
    connections: [
      { icon: MessageSquareShare, name: "Slack", meta: "OAuth 2.0", status: "Connected" },
      { icon: Database, name: "Incident DB", meta: "API key", status: "Connected" },
      { icon: GitPullRequestArrow, name: "GitHub", meta: "GitHub App", status: "Connected" },
    ],
    execute: {
      tool: "REVENENT_PROMOTE_MEMORY",
      session: "sx-bill4",
      rows: [
        ["memory", "Billing retry safety change"],
        ["evidence", "4 linked sources"],
      ],
      status: "200 OK - memory promoted",
    },
    agent: {
      agent: "Revenent Mentor",
      provider: "OpenAI",
      model: "gpt-5",
    },
    sandbox: "memory graph - incident reconstruction",
    messages: [
      { id: "capture", kind: "tool", text: "REVENENT_CAPTURE_PIPELINE", panel: "capture" },
      { id: "connections", kind: "tool", text: "REVENENT_MANAGE_CONNECTIONS", panel: "connections" },
      { id: "sandbox", kind: "tool", text: "REVENENT_SANDBOX", panel: "sandbox" },
      {
        id: "answer",
        kind: "assistant",
        text: "The team disabled immediate retries after finding they could replay against stale payment intents. Finance approved a slower retry window until idempotency checks shipped.",
      },
      { id: "execute", kind: "tool", text: "REVENENT_EXECUTE_MEMORY", panel: "execute" },
      {
        id: "result",
        kind: "assistant",
        text: "The billing memory packet is promoted with incident evidence, rollout notes, and the finance approval thread attached.",
      },
    ],
  },
  {
    id: "search-shards",
    prompt: "Why was the search shard split postponed even after the migration plan was approved?",
    capture: {
      query: "find why search shard split was postponed",
      found: "5 found",
      tools: [
        {
          icon: GitPullRequestArrow,
          name: "GITHUB_MIGRATION_REVIEW",
          description: "Pull migration comments, rollback criteria, and perf concerns",
          badge: "MATCH",
        },
        {
          icon: Database,
          name: "JIRA_CAPACITY_LINKER",
          description: "Link ARC-312, capacity notes, and migration blockers",
          badge: "MATCH",
        },
        {
          icon: MessageSquareShare,
          name: "CHAT_RELEASE_THREAD",
          description: "Collect release-channel debate and final approval language",
          badge: "MATCH",
        },
      ],
      plan: [
        "Find migration approval and blocker threads",
        "Reconstruct the capacity tradeoff",
        "Promote postponement rationale",
      ],
      warnings: ["! stale storage estimate", "! runbook update still pending"],
    },
    connections: [
      { icon: GitPullRequestArrow, name: "GitHub", meta: "GitHub App", status: "Connected" },
      { icon: Database, name: "Jira", meta: "OAuth 2.0", status: "Connected" },
      { icon: MessageSquareShare, name: "Release Chat", meta: "OAuth 2.0", status: "Connected" },
    ],
    execute: {
      tool: "REVENENT_PROMOTE_MEMORY",
      session: "sx-srch2",
      rows: [
        ["memory", "Search shard split postponement"],
        ["evidence", "5 linked sources"],
      ],
      status: "200 OK - memory promoted",
    },
    agent: {
      agent: "Revenent Mentor",
      provider: "OpenAI",
      model: "gpt-5",
    },
    sandbox: "memory graph - architecture recall",
    messages: [
      { id: "capture", kind: "tool", text: "REVENENT_CAPTURE_PIPELINE", panel: "capture" },
      { id: "connections", kind: "tool", text: "REVENENT_MANAGE_CONNECTIONS", panel: "connections" },
      { id: "sandbox", kind: "tool", text: "REVENENT_SANDBOX", panel: "sandbox" },
      {
        id: "answer",
        kind: "assistant",
        text: "Revenent found that the plan was approved conditionally, but storage growth outpaced the original estimate. The split was delayed until the new rollback window and runbook were in place.",
      },
      { id: "execute", kind: "tool", text: "REVENENT_EXECUTE_MEMORY", panel: "execute" },
      {
        id: "result",
        kind: "assistant",
        text: "The architecture memory is now promoted with the approval thread, blocker ticket, and release-channel decision attached.",
      },
    ],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease },
  }),
};

function mergeUniquePanels(current: DemoPanelKey[], next: DemoPanelKey[]) {
  return Array.from(new Set([...current, ...next]));
}

function getPanelClass(active: boolean, completed: boolean) {
  if (active) {
    return "border-white/[0.16] bg-white/[0.07] opacity-100 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]";
  }

  if (completed) {
    return "border-white/[0.1] bg-white/[0.04] opacity-95";
  }

  return "border-white/[0.08] bg-[#141414]/50 opacity-70";
}

function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-50 flex w-full flex-col items-center border-b border-black/10 bg-white p-2 text-black transition-[background-color,border-color,color,translate] duration-300 md:top-4 md:left-1/2 md:w-[calc(100%-2rem)] md:max-w-[1240px] md:-translate-x-1/2 md:border md:px-2 md:py-[8px]">
      <div className="w-full">
        <nav className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 px-2 font-ui-mono text-sm tracking-[-0.28px]">
            <span className="flex size-6 items-center justify-center rounded-full bg-black text-white">
              <BrainCircuit size={14} />
            </span>
            <span className="font-medium uppercase">REVENENT</span>
          </Link>

          <div className="hidden items-center gap-5 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-2 font-ui-mono text-sm tracking-[-0.28px] text-black transition-colors duration-300 hover:text-black/60"
              >
                {link.label.toUpperCase()}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className="px-2 font-ui-mono text-sm tracking-[-0.28px] text-black/60 transition-colors duration-300 hover:text-black"
            >
              LOG IN
            </Link>
            <Link
              href="/signup"
              className="bg-black px-2 py-1.5 font-ui-mono text-sm tracking-[-0.28px] text-white transition-colors duration-300 hover:bg-black/85"
            >
              START PILOT
            </Link>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-8 items-center justify-center lg:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        {open ? (
          <div className="w-full overflow-hidden border-t border-black/10 pt-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-2 py-2 font-ui-mono text-sm tracking-[-0.28px] text-black"
                  onClick={() => setOpen(false)}
                >
                  {link.label.toUpperCase()}
                </a>
              ))}
              <div className="mt-2 flex items-center gap-3">
                <Link href="/login" className="px-2 font-ui-mono text-sm tracking-[-0.28px] text-black/60">
                  LOG IN
                </Link>
                <Link
                  href="/signup"
                  className="bg-black px-2 py-1.5 font-ui-mono text-sm tracking-[-0.28px] text-white"
                >
                  START PILOT
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

function LogoMarquee() {
  const items = [...integrations, ...integrations];

  return (
    <div id="integrations" className="relative z-10 w-screen invert md:mt-4">
      <div className="flex w-full items-center justify-center">
        <div
          className="logoloop rev-logoloop w-full max-w-[800px] overflow-hidden px-4 py-[14px] grayscale"
          style={{
            ["--logoloop-gap" as string]: "64px",
            ["--logoloop-logoHeight" as string]: "26px",
            maskImage: "linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)",
          }}
        >
          <div className="logoloop__track">
            <ul className="logoloop__list" role="list">
              {items.map((item, index) => (
                <li key={`${item.name}-${index}`} className="logoloop__item" role="listitem">
                  <Image
                    src={item.src}
                    alt={item.name}
                    width={item.width}
                    height={item.height}
                    className="w-auto object-contain"
                    style={{ height: item.height > 30 ? "34px" : item.name === "Jira" ? "25px" : "30px" }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoPanel() {
  return (
    <div className="border-t border-white/8 pt-10">
      <div className="space-y-6 lg:hidden">
        <div className="space-y-6">
          <motion.div
            custom={0.16}
            initial="hidden"
            animate="visible"
            variants={reveal}
            className="border border-white/8 bg-[#0f0f10] p-4"
          >
            <div className="font-ui-mono text-[11px] uppercase tracking-[0.16em] text-white/22">
              REVENENT_CAPTURE_PIPELINE
            </div>
            <div className="mt-4 flex items-center gap-2 border border-white/6 bg-white/[0.02] px-3 py-2.5 font-ui-mono text-[11px] text-white/22">
              <Search size={12} />
              <span>find incident decisions and architecture context</span>
              <span className="ml-auto text-white/18">3 found</span>
            </div>

            <div className="mt-4 space-y-2">
              {captureTools.map((tool) => {
                const Icon = tool.icon;

                return (
                  <div key={tool.name} className="border border-white/6 bg-[#121214] px-3 py-3">
                    <div className="flex items-center gap-3">
                      <Icon size={14} className="text-[#f2b25c]" />
                      <div className="min-w-0 flex-1">
                        <div className="font-ui-mono text-[11px] uppercase tracking-[0.08em] text-white/36">
                          {tool.name}
                        </div>
                        <div className="mt-1 text-[11px] leading-5 text-white/18">{tool.description}</div>
                      </div>
                      <span className="border border-[#173e72] bg-[#10213a] px-1.5 py-1 font-ui-mono text-[10px] uppercase tracking-[0.12em] text-[#6aa7ff]">
                        {tool.badge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-[1fr_0.8fr] gap-6 font-ui-mono text-[11px] uppercase tracking-[0.08em]">
              <div>
                <div className="text-white/26">PLAN</div>
                <div className="mt-2 space-y-1 text-white/22">
                  {memorySteps.map((step, index) => (
                    <div key={step}>
                      {index + 1} {step}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[#d79a4e]">WARNINGS</div>
                <div className="mt-2 space-y-1 text-[#8f7a58]">
                  <div>! missing postmortem link</div>
                  <div>! stale owner on ARC-219</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            custom={0.2}
            initial="hidden"
            animate="visible"
            variants={reveal}
            className="border border-white/8 bg-[#0f0f10] p-4"
          >
            <div className="font-ui-mono text-[11px] uppercase tracking-[0.16em] text-white/48">
              Watch Revenent In Action
            </div>
            <button
              type="button"
              className="mt-6 bg-white px-4 py-3 font-ui-mono text-sm uppercase tracking-[0.08em] text-black"
            >
              open mentor session
            </button>
          </motion.div>
        </div>

        <motion.div
          custom={0.22}
          initial="hidden"
          animate="visible"
          variants={reveal}
          className="rounded-[26px] border border-white/10 bg-[#202021] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.32)]"
        >
          <div className="flex items-center justify-center gap-3 border-b border-white/4 pb-4 text-white/72">
            <BrainCircuit size={16} />
            <span className="text-base">Revenent Mentor</span>
          </div>

          <div className="p-4">
            <div className="mx-auto max-w-[25rem] rounded-[22px] bg-white/[0.03] px-5 py-4 text-[13px] leading-7 text-white/40">
              Why did the team keep auth retry logic inside deploy sequencing instead of moving it into the worker queue?
            </div>

            <div className="mt-6 space-y-5 text-white/18">
              {["REVENENT_CAPTURE_PIPELINE", "REVENENT_SANDBOX", "REVENENT_EXECUTE_MEMORY"].map((item) => (
                <div key={item} className="flex items-center gap-2 font-ui-mono text-[11px] uppercase tracking-[0.08em]">
                  <span>{item}</span>
                  <ChevronRight size={12} />
                </div>
              ))}
            </div>

            <div className="mt-8 max-w-[29rem] text-[16px] leading-8 text-white/72">
              Revenent found the decision in GitHub review threads, a Slack incident channel, and the Jira follow-up.
              The team kept sequencing coupled because queue lag caused token expiry during blue-green deploys.
            </div>

            <div className="mt-10 rounded-[18px] bg-white/[0.05] p-4">
              <div className="text-base text-white/28">Reply...</div>
              <div className="mt-3 flex items-center justify-between">
                <button type="button" className="text-4xl leading-none text-white/30">
                  +
                </button>
                <div className="flex items-center gap-4">
                  <span className="font-ui-mono text-sm uppercase tracking-[0.08em] text-white/32">RVN-1</span>
                  <button
                    type="button"
                    className="flex size-8 items-center justify-center rounded-full bg-[#1fc49b] text-black"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            custom={0.28}
            initial="hidden"
            animate="visible"
            variants={reveal}
            className="border border-white/8 bg-[#0f0f10] p-4"
          >
            <div className="font-ui-mono text-[11px] uppercase tracking-[0.16em] text-white/22">
              REVENENT_MANAGE_CONNECTIONS
            </div>
            <div className="mt-4 font-ui-mono text-[11px] uppercase tracking-[0.08em] text-white/18">
              workspace_id: ws_9xmemory
            </div>
            <div className="mt-5 space-y-2">
              {sourceConnections.map((connection) => {
                const Icon = connection.icon;

                return (
                  <div key={connection.name} className="flex items-center justify-between border border-white/6 bg-[#121214] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Icon size={15} className="text-[#f2b25c]" />
                      <div>
                        <div className="text-[15px] leading-none text-white/42">{connection.name}</div>
                        <div className="mt-1 text-[11px] text-white/18">{connection.meta}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-ui-mono text-[11px] uppercase tracking-[0.08em] text-[#1fc47f]">
                      <Circle size={8} fill="currentColor" />
                      {connection.status}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            custom={0.34}
            initial="hidden"
            animate="visible"
            variants={reveal}
            className="border border-white/8 bg-[#0f0f10] p-4"
          >
            <div className="flex items-center justify-between font-ui-mono text-[11px] uppercase tracking-[0.16em] text-white/22">
              <span>REVENENT_EXECUTE_MEMORY</span>
              <span>session: --</span>
            </div>
            <div className="mt-4 border border-white/6 bg-[#121214] px-4 py-3 font-ui-mono text-[11px] uppercase tracking-[0.08em] text-white/18">
              NOTION_CREATE_PAGE
            </div>
            <div className="mt-2 border border-white/6 bg-[#121214] px-4 py-3 text-sm text-white/18">
              <div className="flex justify-between">
                <span>db</span>
                <span>Tasks</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span>title</span>
                <span>Q4 roadmap memory</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 font-ui-mono text-[11px] uppercase tracking-[0.08em] text-white/22">
              <CircleCheck size={12} className="text-white/28" />
              200 ok - memory promoted
            </div>
          </motion.div>

          <motion.div
            custom={0.4}
            initial="hidden"
            animate="visible"
            variants={reveal}
            className="border border-white/8 bg-[#0f0f10] p-4"
          >
            <div className="font-ui-mono text-[11px] uppercase tracking-[0.16em] text-white/22">
              AGENT_CONFIG
            </div>
            <div className="mt-4 space-y-3 font-ui-mono text-[11px] uppercase tracking-[0.08em] text-white/18">
              {[
                ["Agent", "Revenent Mentor"],
                ["Provider", "OpenAI"],
                ["Model", "gpt-5"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between border-b border-white/6 pb-3 last:border-b-0 last:pb-0">
                  <span>{label}</span>
                  <span className="text-white/42">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          custom={0.46}
          initial="hidden"
          animate="visible"
          variants={reveal}
          className="mx-auto border border-white/10 bg-[#0f0f10] px-5 py-4"
        >
          <div className="flex items-center justify-between font-ui-mono text-[11px] uppercase tracking-[0.14em] text-white/24">
            <span>REVENENT_SANDBOX</span>
            <span>memory graph - source-grounded recall</span>
          </div>
        </motion.div>
      </div>

      <div
        className="mx-auto mt-10 hidden w-full max-w-[1240px] border-t border-white/[0.08] pt-8 lg:grid"
        style={{ gridTemplateColumns: "27.4% 35.5% 27.4%", columnGap: "4.85%" }}
      >
        <div className="flex flex-col gap-8">
          <motion.div
            custom={0.16}
            initial="hidden"
            animate="visible"
            variants={reveal}
            className="border border-white/[0.08] bg-[#141414]/50 p-4"
          >
            <div className="font-ui-mono text-[11px] uppercase tracking-[0.16em] text-white/22">
              REVENENT_CAPTURE_PIPELINE
            </div>
            <div className="mt-4 flex items-center gap-2 border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 font-ui-mono text-[11px] text-white/22">
              <Search size={12} />
              <span>find incident decisions and architecture context</span>
              <span className="ml-auto text-white/18">3 found</span>
            </div>

            <div className="mt-4 space-y-2">
              {captureTools.map((tool) => {
                const Icon = tool.icon;

                return (
                  <div key={tool.name} className="border border-white/[0.06] bg-[#121214] px-3 py-3">
                    <div className="flex items-center gap-3">
                      <Icon size={14} className="text-[#f2b25c]" />
                      <div className="min-w-0 flex-1">
                        <div className="font-ui-mono text-[11px] uppercase tracking-[0.08em] text-white/36">
                          {tool.name}
                        </div>
                        <div className="mt-1 text-[11px] leading-5 text-white/18">{tool.description}</div>
                      </div>
                      <span className="border border-[#173e72] bg-[#10213a] px-1.5 py-1 font-ui-mono text-[10px] uppercase tracking-[0.12em] text-[#6aa7ff]">
                        {tool.badge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-[1fr_0.8fr] gap-6 font-ui-mono text-[11px] uppercase tracking-[0.08em]">
              <div>
                <div className="text-white/26">PLAN</div>
                <div className="mt-2 space-y-1 text-white/22">
                  {memorySteps.map((step, index) => (
                    <div key={step}>
                      {index + 1} {step}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[#d79a4e]">WARNINGS</div>
                <div className="mt-2 space-y-1 text-[#8f7a58]">
                  <div>! missing postmortem link</div>
                  <div>! stale owner on ARC-219</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            custom={0.2}
            initial="hidden"
            animate="visible"
            variants={reveal}
            className="flex flex-col border border-white/[0.08] bg-[#141414]/50 p-4 font-ui-mono text-xs"
          >
            <h2 className="mb-4 text-sm uppercase tracking-wider text-white/60">Watch Revenent In Action</h2>
            <button
              type="button"
              className="flex w-fit items-center justify-center bg-white px-3 py-1.5 text-xs tracking-[-0.28px] text-black transition-colors hover:bg-white/90"
            >
              OPEN MENTOR
            </button>
          </motion.div>
        </div>

        <motion.div
          custom={0.22}
          initial="hidden"
          animate="visible"
          variants={reveal}
          className="mt-4 flex h-[500px] flex-col overflow-hidden border border-white/[0.08] bg-[#1a1a1a] shadow-2xl"
          style={{ borderRadius: 28 }}
        >
          <div className="flex items-center justify-center gap-2 px-5 py-3">
            <BrainCircuit size={16} className="text-white/80" />
            <span className="text-[13px] font-medium text-white/85">Revenent Mentor</span>
          </div>
          <div className="flex h-[380px] flex-col gap-4 overflow-y-auto px-5 pt-5 pb-3">
            <div className="flex justify-end opacity-35">
              <div className="max-w-[85%] rounded-[24px] bg-[#232323] px-4 py-2.5 text-[14px] leading-relaxed text-white/70">
                Why did the team keep auth retry logic inside deploy sequencing instead of moving it into the worker queue?
              </div>
            </div>

            {["REVENENT_CAPTURE_PIPELINE", "REVENENT_SANDBOX"].map((item) => (
              <div key={item} className="inline-flex items-center gap-1 text-[12px] leading-none tracking-wide text-white/28">
                <span className="font-medium uppercase">{item}</span>
                <ChevronRight size={12} />
              </div>
            ))}

            <div className="text-[15px] leading-relaxed text-white/78">
              Revenent found the decision in GitHub review threads, a Slack incident channel, and the Jira follow-up.
              The team kept sequencing coupled because queue lag caused token expiry during blue-green deploys.
            </div>

            <div className="inline-flex items-center gap-1 text-[12px] leading-none tracking-wide text-white/28">
              <span className="font-medium uppercase">REVENENT_EXECUTE_MEMORY</span>
              <ChevronRight size={12} />
            </div>

            <div className="text-[15px] leading-relaxed text-white/90">
              All done. The memory packet was promoted with linked evidence and is now queryable by the mentor.
            </div>
          </div>

          <div className="px-3 pb-3">
            <div className="flex flex-col gap-2 rounded-[24px] bg-[#2b2b2b] px-4 pt-3 pb-2.5">
              <span className="text-[14px] text-white/35">Reply...</span>
              <div className="flex items-center justify-between">
                <span className="text-[34px] leading-none text-white/35">+</span>
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center text-[12px] leading-none text-white/35">gpt-5</span>
                  <button type="button" className="flex size-8 items-center justify-center rounded-full bg-[#c9a06b] text-black">
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-6">
          <motion.div
            custom={0.28}
            initial="hidden"
            animate="visible"
            variants={reveal}
            className="flex flex-col border border-white/[0.08] bg-[#141414]/50 p-4 font-ui-mono text-xs opacity-70"
          >
            <div className="mb-3 text-[11px] uppercase tracking-wider text-white/40">REVENENT_MANAGE_CONNECTIONS</div>
            <div className="mb-5 text-[11px] uppercase tracking-wider text-white/30">WORKSPACE_ID: ws_9x2klm7</div>
            <div className="flex flex-col gap-2">
              {sourceConnections.map((connection) => {
                const Icon = connection.icon;

                return (
                  <div key={connection.name} className="flex items-center justify-between border border-white/[0.08] bg-white/[0.03] px-2.5 py-3">
                    <div className="flex items-center gap-3">
                      <Icon size={14} className="text-[#f2b25c]" />
                      <div>
                        <div className="text-[11px] text-white/65">{connection.name}</div>
                        <div className="text-[10px] text-white/30">{connection.meta}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#00c26e]">
                      <Circle size={8} fill="currentColor" />
                      <span>Connected</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            custom={0.34}
            initial="hidden"
            animate="visible"
            variants={reveal}
            className="flex flex-col border border-white/[0.08] bg-[#141414]/50 p-4 font-ui-mono text-xs opacity-70"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-white/40">REVENENT_EXECUTE_MEMORY</span>
              <span className="text-[10px] text-white/25">SESSION: sx-7k2m</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 border border-white/[0.08] bg-white/[0.03] px-2.5 py-2">
                <Database size={14} className="text-[#f2b25c]" />
                <span className="text-[11px] leading-tight text-white/50">NOTION_CREATE_PAGE</span>
              </div>
              <div className="flex flex-col gap-1 border border-white/[0.06] px-2.5 py-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-white/25">db</span>
                  <span className="text-white/40">Tasks</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-white/25">title</span>
                  <span className="text-white/40">Q4 roadmap memory</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#00c26e]">
                <CircleCheck size={12} />
                <span>200 OK - memory promoted</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            custom={0.4}
            initial="hidden"
            animate="visible"
            variants={reveal}
            className="flex flex-col border border-white/[0.08] bg-[#141414]/50 p-4 font-ui-mono text-xs opacity-70"
          >
            <div className="mb-3">
              <span className="text-[11px] uppercase tracking-wider text-white/40">AGENT_CONFIG</span>
            </div>
            <div className="flex flex-col gap-2">
              {[
                ["AGENT", "Revenent Mentor"],
                ["PROVIDER", "OpenAI"],
                ["MODEL", "gpt-5"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between border-b border-white/[0.06] pb-2 last:border-0 last:pb-0">
                  <span className="text-[11px] text-white/30">{label}</span>
                  <span className="text-[12px] text-white/70">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        custom={0.46}
        initial="hidden"
        animate="visible"
        variants={reveal}
        className="mx-auto hidden w-full max-w-[1240px] border-b border-white/[0.08] px-[6.4%] pb-16 lg:block"
      >
        <div className="overflow-hidden border border-white/[0.08] bg-[#141414]/50 p-4 font-ui-mono text-xs">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-wider text-white/30">REVENENT_SANDBOX</div>
            <div className="flex items-center gap-1.5 text-[9px] text-white/20">
              <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
              memory graph - source-grounded recall
            </div>
          </div>
          <div className="h-[110px] border border-white/[0.08] bg-[#111]" />
        </div>
      </motion.div>
    </div>
  );
}

export function RevenentHomepage() {
  return (
    <div className="rev-page bg-[#050505] text-white">
      <Nav />

      <main className="overflow-hidden">
        <section className="rev-hero-grid rev-noise relative flex min-h-dvh flex-col items-center overflow-hidden bg-[#0f0f0f] pt-[60px] md:pt-0">
          <div className="relative mx-auto flex w-full max-w-[1240px] flex-1 flex-col items-center justify-center gap-0 px-0 pt-0 md:flex-none md:justify-start md:gap-10 md:px-4 md:pt-[120px] md:pb-24 lg:pt-[160px]">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={reveal}
              className="relative z-10 flex flex-col items-center gap-5 px-5 pb-6 text-center md:gap-6 md:px-0"
            >
              <div className="flex flex-col items-center gap-3 md:gap-4">
                <h1 className="font-display text-4xl leading-[1.15] text-white md:whitespace-nowrap md:text-5xl md:leading-[0.87] lg:text-[64px]">
                  Your team ships
                  <br className="md:hidden" /> what to do.
                </h1>
                <p className="font-display text-4xl leading-[0.95] text-white md:whitespace-nowrap md:text-5xl md:leading-[0.87] lg:text-[64px]">
                  Revenent keeps the why.
                </p>
              </div>
              <p className="max-w-[540px] text-center text-base leading-[1.4] text-white/50 md:text-lg md:leading-[1.2]">
                Capture the rationale behind pull requests, incidents, tickets, and chat threads, then turn it into source-grounded engineering memory.
              </p>
            </motion.div>

            <div className="relative z-10 px-5 pb-14 md:px-0 md:pb-8">
              <Link
                href="/signup"
                className="relative z-10 bg-white px-4 py-2.5 font-ui-mono text-sm tracking-[-0.28px] text-black transition-colors hover:bg-white/90"
              >
                START PILOT
              </Link>
            </div>

            <hr className="mt-4 w-full max-w-[calc(100%-40px)] border-white/10 md:hidden" />

            <LogoMarquee />

            <DemoPanel />
          </div>
        </section>

        <section id="product" className="bg-[#f6f6f6]">
          <div className="mx-auto w-full max-w-[1240px] border-x border-black/[0.06] px-4 lg:px-0">
            <div className="flex flex-col gap-8 px-2 py-14 md:py-16">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={reveal}
                className="flex flex-col gap-6"
              >
                <div className="flex h-6 items-center gap-2 self-start px-2 py-1.5">
                  <div className="size-[5.82px] bg-black" />
                  <span className="font-ui-mono text-sm tracking-[-0.28px] text-black">
                    ONE MEMORY LAYER, EVERY ENGINEERING WORKFLOW
                  </span>
                </div>
                <h2 className="max-w-[474px] font-display text-3xl leading-[0.9] text-black md:text-4xl lg:text-[48px]">
                  Replace scattered tribal knowledge with context your team can reuse.
                </h2>
              </motion.div>

              <div className="relative mt-4 grid gap-px border border-black/[0.08] bg-black/[0.08] lg:grid-cols-2">
                <div className="bg-[#f6f6f6] p-5 lg:p-8">
                  <p className="font-ui-mono text-sm tracking-[-0.28px] text-black/48">CAPTURE SURFACE</p>
                  <h3 className="mt-4 text-2xl leading-[1.2] text-black lg:text-[32px]">
                    A system that listens where engineering judgment actually happens
                  </h3>
                  <p className="mt-4 max-w-[500px] text-base leading-[1.4] text-black/65">
                    Revenent joins the tools your team already uses and continuously indexes reasoning, approvals, tradeoffs, and incident context.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {["Architecture debates", "Rollback rationale", "Runbook patches", "Vendor escalations"].map((item) => (
                      <div key={item} className="border border-black/[0.08] bg-black/[0.02] px-4 py-4">
                        <p className="font-ui-mono text-xs tracking-[-0.28px] text-black/40">CAPTURED</p>
                        <p className="mt-2 text-base text-black/74">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0f0f0f] p-5 text-white lg:p-8">
                  <p className="font-ui-mono text-sm tracking-[-0.28px] text-white/50">MENTOR INTERFACE</p>
                  <h3 className="mt-4 text-2xl leading-[1.2] text-white lg:text-[32px]">
                    Ask for precedent, not another summary
                  </h3>
                  <p className="mt-4 max-w-[500px] text-base leading-[1.4] text-white/60">
                    Engineers get source-grounded answers with links back to the pull requests, threads, and tickets that created the decision in the first place.
                  </p>
                  <div className="mt-6 border border-white/[0.08] bg-white/[0.04] p-5">
                    <div className="flex items-center justify-between font-ui-mono text-xs tracking-[-0.28px] text-white/45">
                      <span>QUESTION</span>
                      <span>MENTOR REPLY</span>
                    </div>
                    <div className="mt-6 space-y-5">
                      <p className="text-base leading-7 text-white/82">
                        Why is auth retry logic still coupled to deploy sequencing?
                      </p>
                      <div className="border-l border-[#d99a57] pl-4 text-base leading-7 text-white/62">
                        During the April incident, queue delays caused token expiry during blue-green cutovers. The coupling stayed in place and the rollback conditions were captured in review threads and the postmortem.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-px border border-black/[0.08] bg-black/[0.08] md:grid-cols-2 xl:grid-cols-4">
                {pillars.map((pillar, index) => {
                  const Icon = pillar.icon;

                  return (
                    <motion.div
                      key={pillar.title}
                      custom={index * 0.08}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-60px" }}
                      variants={reveal}
                      className="bg-[#f6f6f6] p-6"
                    >
                      <div className="flex size-12 items-center justify-center bg-black text-white">
                        <Icon size={20} />
                      </div>
                      <h3 className="mt-5 text-xl leading-[1.2] text-black">{pillar.title}</h3>
                      <p className="mt-3 text-base leading-7 text-black/62">{pillar.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="workflows" className="flex w-full justify-center bg-[#0f0f0f] px-4 py-24 md:px-6">
          <div className="w-full max-w-[1240px]">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-8 px-0">
                <div className="flex items-center gap-2 self-start border border-white px-2 py-1">
                  <div className="size-[5.82px] bg-white" />
                  <span className="font-ui-mono text-sm tracking-[-0.28px] text-white">FOR ENGINEERING TEAMS</span>
                </div>
                <h2 className="text-3xl leading-[0.9] text-[#f6f6f6] md:text-4xl lg:whitespace-nowrap lg:text-[48px]">
                  Built for the moments where context loss becomes expensive
                </h2>
                <Link
                  href="/integrations"
                  className="flex w-fit items-center justify-center bg-white px-2 py-1.5 font-ui-mono text-sm tracking-[-0.28px] text-black"
                >
                  SEE THE PLATFORM
                </Link>
              </div>

              <div className="mt-12 flex flex-col md:mt-20">
                <div className="flex flex-col lg:flex-row">
                  {workflowRows.slice(0, 2).map((row) => (
                    <div key={row.title} className="relative h-auto min-h-[196px] w-full border border-[#2c2c2c] lg:w-[620px]">
                      <div className="flex h-auto w-full flex-col gap-4 p-5 lg:h-[158px] lg:w-[434px]">
                        <h3 className="text-xl font-medium leading-[1.2] text-white">{row.title}</h3>
                        <p className="max-w-[380px] text-base leading-[1.2] text-[#ececec] opacity-80">{row.copy}</p>
                        <div className="flex w-fit items-center justify-center bg-white/12 px-2 py-1.5 font-ui-mono text-sm tracking-[-0.28px] text-white/64">
                          {row.label}
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 hidden h-[196px] w-[166px] overflow-hidden border-l border-[#2c2c2c] bg-[#1b1b1b] lg:block">
                        <div className="flex h-full items-center justify-center px-4 text-center font-ui-mono text-xs tracking-[-0.28px] text-white/28">
                          {row.title.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden lg:block">
                  <div className="relative h-[54px] w-full">
                    <div className="absolute top-0 right-0 left-0 flex h-[27px]">
                      {[191, 138, 245, 109, 191, 119, 181].map((width, index) => (
                        <div key={`top-${index}`} className="h-[27px] shrink-0 border border-[#2c2c2c] bg-[#0f0f0f]" style={{ width }} />
                      ))}
                      <div className="h-[27px] min-w-0 flex-1 border border-[#2c2c2c] bg-[#0f0f0f]" />
                    </div>
                    <div className="absolute top-[27px] right-0 left-0 flex h-[27px]">
                      {[124, 259, 124, 191, 191, 124, 88].map((width, index) => (
                        <div key={`bottom-${index}`} className="h-[27px] shrink-0 border border-[#2c2c2c] bg-[#0f0f0f]" style={{ width }} />
                      ))}
                      <div className="h-[27px] min-w-0 flex-1 border border-[#2c2c2c] bg-[#0f0f0f]" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row">
                  <div className="relative -mt-px h-[350px] w-full overflow-hidden border border-[#2c2c2c] md:h-[350px] lg:mt-0 lg:h-[400px] lg:w-[620px]">
                    <div className="px-5 pt-6">
                      <h3 className="text-2xl leading-[1.2] text-white">Decision Audit Trail</h3>
                    </div>
                    <div className="absolute inset-x-0 top-20 bottom-0 overflow-hidden px-5 pb-[118px]">
                      <div className="space-y-3">
                        {auditTrail.map((row) => (
                          <div key={row.event} className="border border-white/[0.08] bg-white/[0.02] px-4 py-3">
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <p className="text-sm text-white/84">{row.event}</p>
                                <p className="mt-1 font-ui-mono text-[11px] tracking-[-0.28px] text-white/34">{row.source}</p>
                              </div>
                              <span className="font-ui-mono text-[10px] tracking-[-0.28px] text-[#d99a57]">{row.impact}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex h-auto flex-col gap-3 border-t border-[#2c2c2c] bg-[#1e1e1e] p-4 md:p-[18px]">
                      <p className="max-w-[480px] text-sm leading-[1.3] text-[#ececec] opacity-80 md:text-base md:leading-[1.2]">
                        Follow how operational decisions move from pull requests and incidents into reusable engineering memory.
                      </p>
                    </div>
                  </div>

                  <div className="relative -mt-px h-[350px] w-full overflow-hidden border border-[#2c2c2c] md:h-[350px] lg:mt-0 lg:h-[400px] lg:w-[620px]">
                    <div className="relative z-10 bg-[#0f0f0f] p-1 px-5 pt-6">
                      <h3 className="text-2xl leading-[1.2] text-white">Source-Grounded Recall</h3>
                    </div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,154,87,0.26),transparent_30%),linear-gradient(180deg,#111_0%,#171717_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 z-10 flex h-auto flex-col gap-3 border-t border-[#2c2c2c] bg-[#1e1e1e] p-4 md:p-[18px]">
                      <p className="max-w-[480px] text-sm leading-[1.3] text-[#ececec] opacity-80 md:text-base md:leading-[1.2]">
                        Engineers ask a question once and get the answer, the precedent, and the artifact trail that supports it.
                      </p>
                      <div className="grid gap-2 md:grid-cols-2">
                        {pillars.slice(0, 2).map((pillar) => (
                          <div key={pillar.title} className="border border-white/[0.08] bg-white/[0.04] px-3 py-3">
                            <div className="font-ui-mono text-[11px] tracking-[-0.28px] text-white/30">
                              {pillar.title.toUpperCase()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pilot" className="bg-[#f6f6f6]">
          <div className="mx-auto w-full max-w-[1240px] border-x border-black/[0.06]">
            <div className="flex flex-col items-center gap-6 px-6 py-14 text-center md:py-16">
              <h2 className="font-display text-3xl leading-tight text-black md:text-4xl lg:text-5xl">
                Your team is shipping.
                <br className="lg:hidden" />
                <span className="hidden lg:inline"> </span>
                Are you preserving the judgment?
              </h2>
              <Link
                href="/signup"
                className="mt-2 flex h-10 items-center justify-center bg-black px-6 font-ui-mono text-sm tracking-[-0.28px] text-white transition-colors hover:bg-black/85"
              >
                START REVENENT TODAY
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
