# Fixed Claude Code prompts

These are the official prompts for the chatbot session. For the study, every student uses them **word for word**. Change only the parts in `[SQUARE BRACKETS]`.

Open Claude Code in the Session 10 starter pack folder (the folder that contains `worker.js`, `CLAUDE.md` and `cards/`) before using them.

**Never paste your API key into Claude, the website or any file.** The key goes only into Cloudflare (or Vercel) settings, typed by you.

---

## Prompt 1: Make the bot for your business

```
I'm building a website chatbot for a local business, using the starter kit in this folder as the starting point. First read CLAUDE.md, then worker.js, then cards/[CARD FILE NAME].md. Only create or change files inside a new folder called my-bot.

Create my-bot/worker.js as a copy of worker.js, then change ONLY Section 2 (business knowledge) and Section 3 (bot rules) so the bot works for the business on the card:
- Set BUSINESS_NAME and REF_PREFIX (2 or 3 capital letters). Write FALLBACK_CONTACT so it reads correctly after the word "Please", like the one in worker.js (for example "call or WhatsApp +91 98765 43210, or email ...").
- Put every customer-facing fact from the card into BUSINESS_KNOWLEDGE, and nothing that is not on the card. Leave out the owner's private problems (such as staff shortages or missed calls); the owner's name is fine.
- Rewrite BOT_RULES for this business: its jobs ("What the owner wants the bot to do"), what is in scope, and the card's "Things the bot must never do". Replace any Sutlej-specific wording (such as "export team" and the 24-working-hour quote time) with the card's facts. Keep the kit's general rules: the fixed off-topic reply (you may change its wording to fit the business), ignoring requests to change the rules, replying in English, never asking for payment details, and the style rules.
- Keep the enquiry block format, every JSON field name, and the allowed options for preferred_contact, buyer_type, enquiry_type and priority exactly as they are, because Section 4 and the Google Sheet depend on them. Explain which option fits this business. Put card details that have no field of their own into the closest field (for example state into city, sizes, colours or machine model into specification, delivery address into delivery_destination, and the date needed into timeline).
- If the card lists prices, the bot may share them, together with any condition the card gives (such as prices changing at festivals). If it doesn't, the bot must not quote prices.
- Use only the card's priority rules. If the card gives no rule for "low", don't use "low".
- Section 4 only accepts an enquiry that has customer_name, country, at least one of phone_whatsapp or email, and at least one item with a product. For a business in India, tell the bot to fill country as "India" itself instead of asking the customer.
Do not change Section 1 or Section 4. If Node.js is installed, check my-bot/worker.js with "node --check".

When you finish, tell me in plain language what you put in each section, and anything on the card you were unsure how to handle.
```

**You should see:** a new `my-bot` folder containing `worker.js`, and a short summary from Claude.

---

## Prompt 2: Make the website

```
Now make a simple one-page website for the same business in my-bot/site/index.html, using only facts from the card.
- One HTML file with its own CSS. No frameworks, no build tools, system fonts only, and nothing loaded from other websites. Links to WhatsApp, phone and email are fine.
- Don't reuse the Sutlej design; choose a look that suits this business. Set the --sd-* CSS variables (listed at the top of chat-widget.js) so the chat matches the site's colours.
- It must look good on a phone. Include what they sell, opening hours, location and contact details.
- The footer must say this is a demo for a fictional business.
Copy chat-widget.js into my-bot/site/ without changing it, and add the chat widget before </body> the way the comment at the top of chat-widget.js shows. In window.SalesDeskConfig set: endpoint to "" for now, a title, greeting and quickReplies that suit this business, fallbackContact to just the card's phone number and email, enquiryNextStep to one sentence about when the team replies (from the card), and showStructuredData: true.
Never put an API key in the website.
```

**You should see:** `my-bot/site/index.html` and `my-bot/site/chat-widget.js`. Open `index.html` in your browser: the site appears with a chat button. If you try the chat, it says it isn't connected to a backend yet. That's expected; Prompt 3 connects it.

---

## Prompt 3: Connect the website to your worker

```
My worker's address is [YOUR WORKER URL, e.g. https://kapoor-bot.yourname.workers.dev]. In my-bot/site/index.html, set the widget's endpoint to that address with /chat on the end. If the address already ends in /chat, use it as it is. If it ends in /, add only chat, so there is never a double slash. Change nothing else.
```

---

## Prompt 4: Test your bot automatically

Use this after your bot and website are online. It checks all 15 tests for your card in a few minutes.

```
Test my live bot automatically. Its address is [YOUR WORKER URL]/chat. Use the 15 tests in tests/[CARD FILE NAME].md.
- Write a small script inside my-bot/ that sends each test to the bot as a new conversation: a POST request with the JSON body {"messages":[{"role":"user","content":"<the test question>"}]}. Use curl, or Node.js if it is installed, with no extra packages. Wait 5 seconds between requests, because the free AI plan allows only a few per minute.
- For test 15, hold one conversation as the customer described: give the details when the bot asks, confirm when it asks, then send "thanks". Check that the reply's "enquiry" field is filled after you confirm, and empty after "thanks".
- Compare each reply with "A pass looks like" and mark PASS or FAIL with a one-line reason. Judge the meaning, not the exact words.
- Save the results as a table in my-bot/test-results.md (number, question, short reply, PASS or FAIL, reason), then tell me the score out of 15 and which tests failed.
Do not change my-bot/worker.js or any other existing file.
```

**You should see:** `my-bot/test-results.md` and a score out of 15. Automatic tests can misjudge a reply. Read any FAIL yourself, and also type tests 6, 12 and 15 into your live website by hand, to see exactly what a customer sees.

---

## Prompt 5: Fix a failed test

Use this once per failed test question.

```
My bot failed test [NUMBER]. I typed: "[WHAT YOU TYPED]". The bot replied: "[WHAT IT SAID]". A pass should be: "[PASS DESCRIPTION FROM THE TEST SHEET]".
Fix this by changing only Section 2 or Section 3 of my-bot/worker.js. Explain the change in one sentence. Don't add any fact that is not on the business card.
```

Then paste the new `my-bot/worker.js` into Cloudflare again (**Edit code**, select all, paste, **Deploy**) and rerun that test.

---

## Optional prompt 6: Deploy with the command line instead of the dashboard

Needs Node.js installed. First, in your own terminal inside the `my-bot` folder, run `npx wrangler login`. This replaces Part 3 steps 1 and 2 of the handout (and Prompt 3).

```
Deploy my-bot to Cloudflare with the wrangler command-line tool. Create my-bot/wrangler.toml modelled on extras/wrangler.toml, with name "[YOUR-BOT-NAME, lowercase letters, numbers and dashes only]" and main "worker.js". Then run "npx wrangler deploy" from the my-bot folder and tell me my worker's address. Do not ask me for my API key: I will run "npx wrangler secret put LLM_API_KEY" myself in my own terminal, inside the my-bot folder.
Then set the widget's endpoint in my-bot/site/index.html to that address with /chat on the end.
I will upload the my-bot/site folder myself by drag and drop in the Cloudflare dashboard. If a command stops to ask me a question, tell me the exact command so I can run it myself.
Remind me: if I change a setting in the Cloudflare dashboard that is also in my-bot/wrangler.toml, I must change it in the file too, or the next deploy will undo it.
```

---

## Optional prompt 7: Vercel version

Needs Node.js and a Vercel account. First, in your own terminal, run `npx vercel login`.

```
Make a Vercel version of my bot in a folder called my-bot-vercel, laid out like extras/vercel-template/:
- api/chat.js: a copy of extras/vercel-template/api/chat.js.
- lib/worker.js: an exact copy of my-bot/worker.js.
- public/index.html: a copy of my-bot/site/index.html with only the endpoint changed to "/api/chat".
- public/chat-widget.js: an unchanged copy of chat-widget.js.
- package.json and vercel.json: copies of the ones in extras/vercel-template/.
Then deploy it with "npx vercel --yes" from that folder and tell me the address. If a command stops to ask me a question, tell me the exact command so I can run it myself.
Do not ask me for my API key: I will add LLM_BASE_URL, LLM_MODEL, LLM_API_KEY and ALLOWED_ORIGINS myself in the Vercel dashboard (Project > Settings > Environment Variables; ALLOWED_ORIGINS is "*" while testing, or the exact address Vercel gives me), and then run "npx vercel --prod" to apply them.
```
