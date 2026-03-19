import { NextRequest, NextResponse } from "next/server";

import type { EngineerSummary } from "@/types/symbiote";

const SESSION_COOKIE = "symbiote_session";
const fastApiBaseUrl = process.env.FASTAPI_BASE_URL || "http://127.0.0.1:8000";

function readCookie(headerValue: string | null, name: string): string | null {
  if (!headerValue) {
    return null;
  }

  const prefix = `${name}=`;
  for (const part of headerValue.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return trimmed.slice(prefix.length);
    }
  }
  return null;
}

function getSessionToken(request: Request | NextRequest): string | null {
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  if ("cookies" in request) {
    return request.cookies.get(SESSION_COOKIE)?.value ?? null;
  }

  return readCookie(request.headers.get("cookie"), SESSION_COOKIE);
}

async function fetchCurrentEngineer(token: string): Promise<EngineerSummary | null> {
  const response = await fetch(`${fastApiBaseUrl}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as EngineerSummary;
}

export async function requireEngineer(request: Request | NextRequest): Promise<EngineerSummary | NextResponse> {
  const token = getSessionToken(request);
  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const engineer = await fetchCurrentEngineer(token);
  if (!engineer) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  return engineer;
}

export async function requireAdmin(request: Request | NextRequest): Promise<EngineerSummary | NextResponse> {
  const engineer = await requireEngineer(request);
  if (engineer instanceof NextResponse) {
    return engineer;
  }

  if (!engineer.is_admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  return engineer;
}
