import { NextRequest, NextResponse } from "next/server";
import { requireEngineer } from "@/lib/serverAuth";

/**
 * POST /api/tavus/inject-context
 * Updates the active Tavus founder session with freshly scouted repository context.
 */
export async function POST(req: NextRequest) {
  const engineer = await requireEngineer(req);
  if (engineer instanceof NextResponse) {
    return engineer;
  }

  try {
    const { conversation_id, context } = await req.json();
    const apiKey = process.env.TAVUS_API_KEY;

    if (!apiKey || !conversation_id) {
      return NextResponse.json({ error: "Missing API key or conversation_id" }, { status: 400 });
    }

    const res = await fetch(`https://tavusapi.com/v2/conversations/${conversation_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        conversational_context: context,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[TAVUS INJECT] Failed:", err);
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    console.log("[TAVUS INJECT] Context updated for:", conversation_id);
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[TAVUS INJECT] Error:", message);
    return NextResponse.json({ error: "Unable to update Tavus context" }, { status: 500 });
  }
}
