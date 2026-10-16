# Student starter kit: business chatbot

This folder is used to build a website chatbot for a local business by following the prompts in `prompts.md`.

## Rules
- Create or change files only inside `my-bot/` (or `my-bot-vercel/`). Do not edit any other file in this folder.
- In `worker.js`, change only Section 2 (business knowledge) and Section 3 (bot rules). Never change Section 1 or Section 4.
- Keep the enquiry block format, every JSON field name, and the allowed options for `preferred_contact`, `buyer_type`, `enquiry_type` and `priority` exactly as they are. Section 4 and the owner's Google Sheet depend on them.
- Use only facts from the business card in `cards/`. Do not invent prices, stock, dates or other facts.
- Never ask for, show or store an API key. The student enters keys only in the Cloudflare or Vercel settings.
- Plain HTML, CSS and JavaScript only. No frameworks, no build tools, nothing loaded from other websites.
- After each task, explain what you changed in plain language.

## Files
- `worker.js`: the starting bot, for Sutlej Cycle Components (a fictional business). Section 1 settings, Section 2 facts, Section 3 rules, Section 4 code.
- `chat-widget.js`: the chat bubble. Copy it unchanged into a website and configure it with `window.SalesDeskConfig`, as the comment at the top of the file shows.
- `cards/`: three fictional Ludhiana businesses.
- `tests/`: 15 tests for each card. When testing (Prompt 4), send requests to the student's live bot only, wait 5 seconds between requests, and save results only inside `my-bot/`.
- `prompts.md`: the fixed prompts the student follows.
- `extras/wrangler.toml`: template for deploying with the Cloudflare command line (optional Prompt 6).
- `extras/vercel-template/`: the Vercel layout (optional Prompt 7). Prompt 7 adds `lib/worker.js`, a copy of `my-bot/worker.js`.
- `extras/google-sheet-webhook.gs`: Apps Script that writes enquiries to a Google Sheet (optional).

## Settings the bot needs
Set by the student on the platform: `LLM_BASE_URL`, `LLM_MODEL`, `LLM_API_KEY` (secret), `ALLOWED_ORIGINS`. Optional: `LEAD_WEBHOOK_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
