import type { LoginResponse } from "@/types/symbiote";

export const AUTH_ENGINEER_KEY = "symbiote_engineer";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export type ApiFetchInit = Omit<RequestInit, "body"> & {
  auth?: boolean;
  body?: BodyInit | null;
  json?: unknown;
};

export async function persistSession(payload: LoginResponse): Promise<void> {
  void payload;
  return Promise.resolve();
}

export async function clearSession(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin",
  }).catch(() => {});

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_ENGINEER_KEY);
  }
}

export function storeEngineerSnapshot(payload: LoginResponse | { engineer: unknown }): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_ENGINEER_KEY, JSON.stringify(payload.engineer));
  }
}

export function getStoredEngineerSnapshot(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_ENGINEER_KEY);
}

export async function apiFetch<T>(input: string, init: ApiFetchInit = {}): Promise<T> {
  const { auth = true, json, body, headers, ...rest } = init;
  const requestHeaders = new Headers(headers);

  if (json !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(input, {
    ...rest,
    headers: requestHeaders,
    body: json !== undefined ? JSON.stringify(json) : body,
    cache: rest.cache ?? "no-store",
    credentials: auth ? "same-origin" : rest.credentials,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      await clearSession();
    }
    const message =
      typeof data === "object" && data !== null && "detail" in data
        ? String((data as { detail?: unknown }).detail)
        : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}
