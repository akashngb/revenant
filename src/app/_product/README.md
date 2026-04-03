# Product Pages — Preserved & Archived

These pages contain the full interactive product functionality from the hackathon build.
They are stored here in `src/app/_product/` (Next.js ignores `_`-prefixed directories for routing)
so they don't appear as live routes, but all code is intact and ready to restore.

## How to restore any page

1. Copy the page file from `src/app/_product/<name>/page.tsx`
   to `src/app/<name>/page.tsx`.
2. Re-add nav links in `src/components/omniate-homepage.tsx`.
3. Restore any API routes if needed (they were never removed — see `src/app/api/`).

---

## Archived pages

| Route | File in _product | What it does |
|---|---|---|
| `/login` | `login/page.tsx` | Email + password login form. Calls `/api/auth/login` → FastAPI, stores JWT + engineer snapshot in localStorage. |
| `/signup` | `signup/page.tsx` | Registration form (fullName, email, username, password). Calls `/api/auth/signup` then auto-logs in, redirects to `/onboarding`. |
| `/dashboard` | `dashboard/page.tsx` | Main app dashboard. Shows habit scores, activity feed, memory health map (D3 force graph). Requires auth. |
| `/integrations` | `integrations/page.tsx` | OAuth integration management via Unified.to. Connect GitHub, Slack, Jira, etc. Requires auth. |
| `/onboarding` | `onboarding/page.tsx` | New user setup flow. Connects first integrations, seeds demo data. |
| `/app` | `app/page.tsx` | Founder console. Embeds live Tavus video avatar (persona fed from Moorcheh memory). Full interactive AI mentor session. |
| `/admin` | `admin/page.tsx` | Admin panel for operator management. Requires admin role. |
| `/team` | `team/page.tsx` | Team member management page. |
| `/features` | `features/page.tsx` | Feature showcase page from early build. |
| `/tech-stack` | `tech-stack/page.tsx` | Technology stack overview page from early build. |

---

## API routes (never removed, always available)

These live at `src/app/api/` and are untouched:

- `/api/tavus` — Creates/updates Tavus persona from Moorcheh memory, returns conversation token
- `/api/tavus/inject-context` — Injects additional context into active Tavus persona
- `/api/openai/v1/chat/completions` — OpenAI-compatible proxy for local LLM inference
- `/api/railtracks` — LLM proxy used by Tavus for memory-enriched responses
- `/api/moorcheh/store` — Stores memory entries in Moorcheh vector DB
- `/api/memory-health` — Returns memory node data for D3 visualization
- `/api/nanoclaw/browse` — Browser automation via Browser Use SDK
- `/api/seed` — Seeds demo data for new users

Auth, integrations, webhooks, dashboard, admin, chat, and memory routes are proxied to
the FastAPI backend via `next.config.ts` rewrites.

---

## Backend (FastAPI)

The full Python backend lives at `backend/` and is untouched:

- `backend/app/routers/auth.py` — JWT authentication
- `backend/app/routers/integrations.py` — Unified.to OAuth + webhooks
- `backend/app/routers/chat.py` — Chat + Tavus endpoints
- `backend/app/routers/memory.py` — Moorcheh vector memory CRUD
- `backend/app/routers/dashboard.py` — Dashboard data
- `backend/app/routers/admin.py` — Admin operations
- `backend/app/services/` — Buffer, evaluator (Claude), promoter, scheduler, Unified.to client

---

## Memory system

`src/lib/moorchehMemory.ts` — 3-namespace cognitive memory model:
- `founder-semantic` — Architecture decisions, conventions
- `founder-episodic` — Stories, incidents, pivots
- `founder-procedural` — Decision frameworks, heuristics

Uses Ebbinghaus decay (memory strength degrades over time without reinforcement).

---

*Archived during landing page rebuild for pre-seed fundraising, March 2026.*
*Restore when product is ready for design partners / beta users.*

