"""Real-time contextual help lookup for single actions."""
from __future__ import annotations

import asyncio

from app.services.evaluator import (
    FOUNDER_NAMESPACES,
    ask_moorcheh,
    fetch_namespace_context,
)


async def provide_immediate_help(user_id: str, action: dict) -> str | None:
    if action.get("action_type") not in {"PushEvent", "PullRequestEvent", "IssuesEvent", "commit"}:
        return None

    action_summary = action.get("summary") or action.get("action_type", "activity")

    user_ctx, company_ctx, founder_epi, founder_proc = await asyncio.gather(
        fetch_namespace_context(
            f"user_{user_id}_memory",
            "What is this engineer currently focusing on?",
        ),
        fetch_namespace_context(
            "company_global_wisdom",
            "What company best practices are relevant to this event?",
        ),
        fetch_namespace_context(
            FOUNDER_NAMESPACES["episodic"],
            f"Stories or lessons relevant to: {action_summary}",
            top_k=2,
        ),
        fetch_namespace_context(
            FOUNDER_NAMESPACES["procedural"],
            f"Decision frameworks relevant to: {action_summary}",
            top_k=2,
        ),
        return_exceptions=True,
    )

    founder_parts: list[str] = []
    if isinstance(founder_epi, str) and founder_epi:
        founder_parts.append(f"[Stories] {founder_epi}")
    if isinstance(founder_proc, str) and founder_proc:
        founder_parts.append(f"[Frameworks] {founder_proc}")
    founder_ctx = "\n".join(founder_parts)

    prompt = (
        "Provide one concise coaching suggestion for this engineer based on the activity.\n"
        "Ground your advice in the founder's real experiences and frameworks when available.\n"
        f"Founder context: {founder_ctx or 'None'}\n"
        f"User context: {user_ctx if isinstance(user_ctx, str) else 'None'}\n"
        f"Company context: {company_ctx if isinstance(company_ctx, str) else 'None'}\n"
        f"Action: {action}"
    )
    try:
        answer = await ask_moorcheh(
            f"user_{user_id}_memory",
            prompt,
            ai_model="anthropic.claude-sonnet-4.5",
        )
    except Exception:  # pragma: no cover - network response variability
        return None
    return answer or None
