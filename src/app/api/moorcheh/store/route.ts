import { NextRequest, NextResponse } from "next/server";

import { store, ingestRepoPulse } from "@/lib/moorchehMemory";
import { requireEngineer } from "@/lib/serverAuth";

export async function POST(req: NextRequest) {
  const engineer = await requireEngineer(req);
  if (engineer instanceof NextResponse) {
    return engineer;
  }

  try {
    const body = await req.json();
    const { content, type, repoUrl } = body;

    if (!content) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    let memoryId: string | null = null;

    if (type === "repo_pulse" && repoUrl) {
      await ingestRepoPulse(repoUrl, { fileTree: content });
      memoryId = "repo_pulse_stored";
    } else {
      memoryId = await store(content, { type: type || "general", source: "client" });
    }

    return NextResponse.json({ success: true, memory_id: memoryId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[MOORCHEH STORE]", message);
    return NextResponse.json({ success: false, error: "Unable to store memory" }, { status: 500 });
  }
}
