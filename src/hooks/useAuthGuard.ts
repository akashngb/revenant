"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { apiFetch, clearSession, storeEngineerSnapshot } from "@/lib/api";
import type { EngineerSummary } from "@/types/symbiote";

interface UseAuthGuardOptions {
  requireAdmin?: boolean;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { requireAdmin = false } = options;
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<EngineerSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const next = encodeURIComponent(pathname || "/dashboard");

    apiFetch<EngineerSummary>("/api/auth/me")
      .then((engineer) => {
        if (!active) return;
        if (requireAdmin && !engineer.is_admin) {
          router.replace("/dashboard");
          return;
        }
        storeEngineerSnapshot({ engineer });
        setUser(engineer);
        setLoading(false);
      })
      .catch(async () => {
        await clearSession();
        if (active) router.replace(`/login?next=${next}`);
      });

    return () => {
      active = false;
    };
  }, [pathname, requireAdmin, router]);

  return { user, loading };
}
