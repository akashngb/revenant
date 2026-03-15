"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrainCircuit, Check, Github, ArrowRight } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import type { AuthUrlResponse, IntegrationStatusItem } from "@/types/symbiote";

function DiscordIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

interface ProviderCardProps {
  provider: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  busy: boolean;
  onConnect: (provider: string) => void;
}

function ProviderCard({ provider, label, description, icon, connected, busy, onConnect }: ProviderCardProps) {
  return (
    <div
      style={{
        border: connected ? "1px solid rgba(255,178,93,0.3)" : "1px solid rgba(255,255,255,0.1)",
        background: connected ? "rgba(255,178,93,0.05)" : "rgba(255,255,255,0.03)",
        padding: "24px",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 items-center justify-center"
            style={{
              background: connected ? "rgba(255,178,93,0.15)" : "rgba(255,255,255,0.08)",
              color: connected ? "#ffb25d" : "white",
            }}
          >
            {connected ? <Check size={20} /> : icon}
          </div>
          <div>
            <p className="font-ui-mono text-sm tracking-[-0.28px] text-white">{label}</p>
            <p className="mt-1 text-sm leading-[1.4] text-white/40">{description}</p>
          </div>
        </div>

        {connected ? (
          <span className="font-ui-mono text-xs tracking-[-0.28px] text-[#ffb25d]">CONNECTED</span>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => onConnect(provider)}
            className="font-ui-mono"
            style={{
              padding: "8px 16px",
              background: "white",
              color: "black",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "-0.28px",
              border: "none",
              cursor: busy ? "wait" : "pointer",
              textTransform: "uppercase",
              opacity: busy ? 0.6 : 1,
              whiteSpace: "nowrap",
            }}
          >
            {busy ? "CONNECTING..." : "CONNECT"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useAuthGuard();
  const [integrations, setIntegrations] = useState<IntegrationStatusItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const [busyProvider, setBusyProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const githubStatus = integrations.find((i) => i.provider === "github");
  const discordStatus = integrations.find((i) => i.provider === "discord");
  const connectedCount = [githubStatus, discordStatus].filter((i) => i?.connected).length;

  const loadIntegrations = useCallback(async () => {
    setFetching(true);
    try {
      const data = await apiFetch<IntegrationStatusItem[]>("/api/integrations/status");
      setIntegrations(data);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to load integrations");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      void loadIntegrations();
    }
  }, [loadIntegrations, user]);

  // Handle OAuth callback params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    const authError = params.get("error");
    if (!connected && !authError) return;

    if (connected) {
      const label = connected.charAt(0).toUpperCase() + connected.slice(1);
      setSuccessMessage(`${label} connected successfully.`);
      if (user) void loadIntegrations();
    }
    if (authError) {
      setError(authError === "auth_failed" ? "Authorization failed. Please try again." : `Connection error: ${authError}`);
    }

    params.delete("connected");
    params.delete("error");
    const nextSearch = params.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}`);
  }, [loadIntegrations, user]);

  const connectProvider = async (provider: string) => {
    setBusyProvider(provider);
    setError(null);
    setSuccessMessage(null);

    try {
      const { auth_url: authUrl } = await apiFetch<AuthUrlResponse>(
        `/api/integrations/auth-url?provider=${encodeURIComponent(provider)}&redirect=/onboarding`,
        { method: "POST" }
      );
      window.location.assign(authUrl);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to start authorization");
      setBusyProvider(null);
    }
  };

  if (loading || !user) {
    return (
      <div className="rev-page flex min-h-screen items-center justify-center" style={{ color: "white" }}>
        <span className="font-ui-mono text-sm text-white/30">Loading...</span>
      </div>
    );
  }

  return (
    <div className="rev-page" style={{ minHeight: "100vh", color: "white", position: "relative" }}>
      <div className="rev-noise" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      {/* Nav */}
      <header className="fixed top-0 left-0 z-50 flex w-full items-center border-b border-black/10 bg-white p-2 text-black md:top-4 md:left-1/2 md:w-[calc(100%-2rem)] md:max-w-[1240px] md:-translate-x-1/2 md:border md:px-2 md:py-[8px]">
        <nav className="flex w-full items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 px-2 font-ui-mono text-sm tracking-[-0.28px]">
            <span className="flex size-6 items-center justify-center bg-black text-white">
              <BrainCircuit size={14} />
            </span>
            <span className="font-medium uppercase">REVENANT</span>
          </Link>
          <span className="font-ui-mono text-xs tracking-[-0.28px] text-black/40">
            {user.full_name || user.username}
          </span>
        </nav>
      </header>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-20">
        <div className="w-full max-w-[520px]">
          {/* Step indicator */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center bg-[#ffb25d] font-ui-mono text-xs text-black">1</div>
              <span className="font-ui-mono text-xs tracking-[-0.28px] text-white/30 line-through">ACCOUNT</span>
            </div>
            <div style={{ width: 24, height: 1, background: "rgba(255,255,255,0.15)" }} />
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center bg-white font-ui-mono text-xs text-black">2</div>
              <span className="font-ui-mono text-xs tracking-[-0.28px] text-white">CONNECT</span>
            </div>
            <div style={{ width: 24, height: 1, background: "rgba(255,255,255,0.15)" }} />
            <div className="flex items-center gap-2">
              <div
                className="flex size-6 items-center justify-center font-ui-mono text-xs"
                style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.3)" }}
              >
                3
              </div>
              <span className="font-ui-mono text-xs tracking-[-0.28px] text-white/30">DASHBOARD</span>
            </div>
          </div>

          <div className="mb-2 flex items-center gap-2">
            <div className="size-[5.82px] bg-white" />
            <span className="font-ui-mono text-sm tracking-[-0.28px] text-white">CONNECT YOUR TOOLS</span>
          </div>

          <h1 className="font-display text-3xl leading-[1.1] text-white md:text-4xl">
            Link GitHub and Discord
            <br />
            to start capturing context.
          </h1>
          <p className="mt-4 max-w-[460px] text-base leading-[1.4] text-white/50">
            Revenant watches your commits, pull requests, and team conversations to build a memory of how your team ships. No private messages are stored.
          </p>

          {/* Status messages */}
          {error && (
            <p
              className="mt-6 font-ui-mono text-sm text-[#ff6b6b]"
              style={{
                padding: "12px 16px",
                border: "1px solid rgba(255,107,107,0.3)",
                background: "rgba(255,107,107,0.08)",
              }}
            >
              {error}
            </p>
          )}
          {successMessage && (
            <p
              className="mt-6 font-ui-mono text-sm text-[#34d399]"
              style={{
                padding: "12px 16px",
                border: "1px solid rgba(52,211,153,0.3)",
                background: "rgba(52,211,153,0.08)",
              }}
            >
              {successMessage}
            </p>
          )}

          {/* Provider cards */}
          <div className="mt-8 flex flex-col gap-3">
            {fetching ? (
              <>
                <div style={{ height: 88, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }} className="animate-pulse" />
                <div style={{ height: 88, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }} className="animate-pulse" />
              </>
            ) : (
              <>
                <ProviderCard
                  provider="github"
                  label="GITHUB"
                  description="Commits, PRs, and code review activity"
                  icon={<Github size={20} />}
                  connected={githubStatus?.connected ?? false}
                  busy={busyProvider === "github"}
                  onConnect={connectProvider}
                />
                <ProviderCard
                  provider="discord"
                  label="DISCORD"
                  description="Team conversations and decision threads"
                  icon={<DiscordIcon size={20} />}
                  connected={discordStatus?.connected ?? false}
                  busy={busyProvider === "discord"}
                  onConnect={connectProvider}
                />
              </>
            )}
          </div>

          {/* Continue */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="group flex items-center gap-2 font-ui-mono"
              style={{
                padding: "12px 24px",
                background: connectedCount > 0 ? "white" : "rgba(255,255,255,0.08)",
                color: connectedCount > 0 ? "black" : "rgba(255,255,255,0.5)",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "-0.28px",
                border: "none",
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              {connectedCount === 2 ? "GO TO DASHBOARD" : connectedCount === 1 ? "CONTINUE WITH ONE" : "SKIP FOR NOW"}
              <ArrowRight size={14} />
            </button>

            {connectedCount === 0 && (
              <span className="font-ui-mono text-[10px] tracking-[0.12em] text-white/20">
                CONNECT AT LEAST ONE TO GET STARTED
              </span>
            )}
          </div>

          <p className="mt-6 font-ui-mono text-xs text-white/20">
            You can connect more tools later from your dashboard settings.
          </p>
        </div>
      </main>
    </div>
  );
}
