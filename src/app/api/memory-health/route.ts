import { NextRequest, NextResponse } from "next/server";

import { getMemoryHealth } from "@/lib/moorchehMemory";
import { requireEngineer } from "@/lib/serverAuth";

export async function GET(request: NextRequest) {
  const engineer = await requireEngineer(request);
  if (engineer instanceof NextResponse) {
    return engineer;
  }

  try {
    const nodes = await getMemoryHealth();
    return NextResponse.json({ nodes });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[MEMORY-HEALTH]", message);
    return NextResponse.json({ nodes: [], error: "Unable to load memory health" }, { status: 500 });
  }
}
