import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/tavus/inject-context
 * Updates the active Tavus conversation context so Anna knows about
 * a GitHub repo that was scouted in the chat.
 */
export async function POST(req: NextRequest) {
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
  } catch (err: any) {
    console.error("[TAVUS INJECT] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
