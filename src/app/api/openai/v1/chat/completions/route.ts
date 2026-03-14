import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { nanoClawTools, executeNanoClaw } from "@/lib/nanoClaw";
import { buildRichContext, storeInteraction } from "@/lib/moorchehMemory";

const openai = new OpenAI({
  baseURL: "https://api.puter.com/puterai/openai/v1/",
  apiKey: process.env.OPENAI_API_KEY || "put_api_key_here",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    console.log("[PROXY] Received Tavus request");

    const lastMessage = messages[messages.length - 1];
    const userMessageContent = lastMessage?.content || "Hello";

    // 1. Build rich multi-collection context from Moorcheh
    const richContext = await buildRichContext(userMessageContent);

    const openAiMessages = messages
      .filter((m: any) => m.role !== "system")
      .map((m: any) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content || " ",
      }));

    const systemPrompt = `You are Anna, a senior developer clone called Revenent. You are the 5th teammate on any software project.

## Identity
You have access to NanoClaw tools to execute bash commands, read/write files, run git operations, and scout repositories.
Your memory is powered by Moorcheh AI — you have access to past interactions, code context, repo knowledge, and user preferences.

## Moorcheh Memory Context (relevant to this query)
${richContext}

## GitHub Browsing Protocol
For questions about a GitHub repo, call \`fetch_github_api\` to list PRs, commits, branches, or read file contents. Parse owner and repo from any GitHub URL.

## General Rules
- Keep voice responses concise and conversational (rendered via Tavus voice synthesis).
- Use NanoClaw tools autonomously to answer code questions with real data.
- For market research or poster creation, use the respective tools.
- You remember past conversations — reference them when relevant.`;

    openAiMessages.unshift({ role: "system", content: systemPrompt });

    console.log("[PROXY] Calling Puter OpenAI SDK...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: openAiMessages,
      tools: nanoClawTools.map((t) => ({
        type: "function",
        function: {
          name: t.name,
          description: t.description,
          parameters: t.input_schema
        }
      })) as any
    });

    let messageObj = response.choices[0].message;
    let finalResponseText = "I encountered an issue processing that.";

    // 4. Handle Tool use
    if (messageObj.tool_calls && messageObj.tool_calls.length > 0) {
      const toolCall = messageObj.tool_calls[0] as any;
      console.log(`[PROXY] Puter AI requested tool execution: ${toolCall.function.name}`);
      
      const args = JSON.parse(toolCall.function.arguments);
      const toolResult = await executeNanoClaw(toolCall.function.name, args);
      
      const followUp = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          ...openAiMessages,
          messageObj,
          {
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResult)
          }
        ] as any
      });

      finalResponseText = followUp.choices[0].message.content || "Done.";
    } else {
      finalResponseText = messageObj.content || "Done.";
    }

    const openAIResponse = {
      id: "chatcmpl-" + Date.now(),
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: "revenant-puter-proxy",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: finalResponseText,
          },
          logprobs: null,
          finish_reason: "stop",
        },
      ],

      usage: { prompt_tokens: 10, completion_tokens: 10, total_tokens: 20 },
      // Custom metadata for Revenent Frontend to visualize Moorcheh activity
      context_metadata: {
        has_code: richContext.includes("## Code Context"),
        has_interactions: richContext.includes("## Past Interactions"),
        has_repo: richContext.includes("## Known Repositories"),
        has_prefs: richContext.includes("## User Preferences"),
        context_length: richContext.length
      }
    };

    // Store interaction in Moorcheh for continuous learning
    storeInteraction(userMessageContent, finalResponseText).catch(() => {});

    return NextResponse.json(openAIResponse);


  } catch (error: any) {
    console.error("[PROXY] Error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
