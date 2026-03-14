import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.TAVUS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing TAVUS_API_KEY" }, { status: 500 });
    }

    const replicaId = process.env.TAVUS_REPLICA_ID || "rf4e9d9790f0";
    let personaId = process.env.TAVUS_PERSONA_ID;

    const headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    };

    // Only create a new persona if we don't have a saved one
    if (!personaId) {
      console.log("[TAVUS] No saved persona — creating new one...");

      const systemPrompt = `You are Anna, a senior developer clone called Revenant. 
You are a knowledgeable 5th teammate on any software project.
Keep your responses concise and conversational — you are rendered via Tavus voice synthesis.`;

      const personaRes = await fetch("https://tavusapi.com/v2/personas", {
        method: "POST",
        headers,
        body: JSON.stringify({
          persona_name: "Anna AI Clone",
          system_prompt: systemPrompt,
          default_replica_id: replicaId,
          layers: {
            llm: { model: "tavus-gemini-2.5-flash" },
          },
        }),
      });

      if (!personaRes.ok) {
        const err = await personaRes.text();
        console.error("[TAVUS] Persona creation failed:", err);
        return NextResponse.json({ error: `Persona failed: ${err}` }, { status: personaRes.status });
      }

      const personaData = await personaRes.json();
      personaId = personaData.persona_id;
      console.log("[TAVUS] Created persona:", personaId);
    } else {
      console.log("[TAVUS] Using existing persona:", personaId);
    }

    // Create conversation directly
    console.log("[TAVUS] Starting conversation...");
    const convRes = await fetch("https://tavusapi.com/v2/conversations", {
      method: "POST",
      headers,
      body: JSON.stringify({
        replica_id: replicaId,
        persona_id: personaId,
        conversation_name: "Anna Development Session",
        conversational_context:
          "You are helping a developer understand a codebase. Be a knowledgeable 5th teammate — answer questions about code, architecture, decisions, git history, and best practices.",
        properties: {
          max_call_duration: 3600,
          enable_recording: false,
        },
      }),
    });

    if (!convRes.ok) {
      const err = await convRes.text();
      console.error("[TAVUS] Conversation creation failed:", err);
      return NextResponse.json({ error: `Conversation failed: ${err}` }, { status: convRes.status });
    }

    const convData = await convRes.json();
    console.log("[TAVUS] Conversation ready:", convData.conversation_id);
    return NextResponse.json(convData);

  } catch (error: any) {
    console.error("[TAVUS] Unexpected error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
