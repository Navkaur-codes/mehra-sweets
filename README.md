# Mehra Sweets chatbot

A website chatbot for **Mehra Sweets**, a sweet shop and namkeen maker in Model Town, Ludhiana. It answers questions about sweets, prices, opening hours, location and delivery, helps customers plan gift boxes for events, and passes order enquiries to the shop team.

Built from the session-10 starter kit. Mehra Sweets is a fictional business for a classroom exercise; all contact details are placeholders.

- Live bot: https://mehra-sweets.navpreetkaur7298.workers.dev/chat
- Business facts: `../cards/mehra-sweets.md`

## Files

| File | What it is |
|---|---|
| `worker.js` | The bot backend (Cloudflare Worker). A copy of the kit's `worker.js` with only Section 2 (business knowledge) and Section 3 (bot rules) changed. |
| `site/index.html` | One-page website for the shop, with the chat widget added before `</body>`. |
| `site/chat-widget.js` | The kit's chat bubble, copied unchanged. |
| `run-tests.mjs` | Script that sends the 15 tests to the live bot. |
| `test-results.md` | Test results table and score. |
| `test-raw.json`, `test15-chat-run*.json` | Full replies saved by the test script. |

## What is in worker.js

- **Section 1 (settings) and Section 4 (code):** unchanged from the kit.
- **Section 2 (business knowledge):** name `Mehra Sweets`, enquiry reference prefix `MS`, the fallback contact, and every customer-facing fact from the card: shop details, hours (including Holi), contact, price list, gift boxes, the planning tip, orders and delivery, payment, and the allergy warning. The owner's private problems are left out.
- **Section 3 (bot rules):**
  - the bot's three jobs from the card;
  - prices may be shared, always with "prices can change during festivals; the team confirms the final price";
  - never promise a sweet is free from nuts, gluten or dairy;
  - never confirm an order or delivery time, never offer discounts, never promise delivery outside Ludhiana;
  - the kit's general rules: the fixed off-topic reply, ignoring requests to change the rules, replying in English, never asking for payment details, and the style rules.
- **Enquiry block:** format, field names and allowed options are the kit's, unchanged. `country` is always "India", companies use `buyer_type` "other", and bulk orders use `enquiry_type` "bulk_order".
- **Priority:** "high" for orders above Rs 20,000, company gifting, or orders needed within 2 days; otherwise "normal". "low" is never used.
- **Strict confirmation rule:** the bot must not send the enquiry in the same message that asks "Shall I send this to the Mehra Sweets team?". It sends the enquiry only after the customer clearly says yes. This rule was added after test 15 failed.

## Deploying the bot (Cloudflare)

1. Open the **mehra-sweets** worker in Cloudflare and click **Edit code**.
2. Replace all of the code with the contents of `worker.js`, then click **Deploy**.
3. Under **Settings > Variables and Secrets**, set:
   - `LLM_BASE_URL`, `LLM_MODEL` and `LLM_API_KEY` (as a Secret);
   - `ALLOWED_ORIGINS`: your website's address (or `*` while testing).
4. Optional, to receive enquiries: `LEAD_WEBHOOK_URL` (Google Sheet, see `../extras/google-sheet-webhook.gs`) and/or `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.

Never put an API key in the website or in these files.

## The website

`site/` is plain HTML and CSS with no frameworks or build tools, and nothing loaded from other websites. To publish it, upload both files in `site/` together (for example to Cloudflare Pages). Then add the site's address to `ALLOWED_ORIGINS`.

The widget is configured in `window.SalesDeskConfig` near the end of `index.html`:

- `endpoint` points to the live bot's `/chat` address.
- `fallbackContact` is the shop's phone number and email.
- `showStructuredData: true` shows the enquiry data the owner receives, which is useful for class demos. Set it to `false` for a real shop.

## Testing

Needs Node.js 18 or later; no packages. Run these commands from this folder. The script waits 5 seconds between requests because the free AI plan allows only a few per minute.

```bash
node run-tests.mjs
```
Runs tests 1 to 14, each as a new conversation, and saves replies to `test-raw.json`.

```bash
node run-tests.mjs only 5,7
```
Reruns only the tests you list, for example after a 502 error, and merges them into `test-raw.json`.

```bash
node run-tests.mjs chat "Hi, my company wants 60 one-kg kaju katli gift boxes"
```
Sends one customer message in the test 15 conversation (saved in `test15-chat.json`) and prints the reply and any enquiry. Run it again with each next message. Delete `test15-chat.json` to start a new conversation.

Pass or fail is judged by reading each reply against "A pass looks like" in `../tests/mehra-sweets.md`. The latest score is **15 / 15**; see `test-results.md`.

## Known issues

- The free AI plan sometimes returns a 502 error ("The language model did not respond"). Wait and try again.
- The bot sometimes adds details the customer didn't give, such as a delivery time or "custom printed" boxes. Check enquiries before acting on them.
- Test enquiries are sent to the real Google Sheet or Telegram once those are set up. Delete them afterwards.
