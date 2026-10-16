/**
 * ENQUIRY INBOX: receives structured enquiries from the chatbot backend
 * and adds one row per enquiry to this Google Sheet (and emails the owner).
 *
 * Setup (5 minutes):
 *  1. Create a Google Sheet. Extensions > Apps Script. Paste this file.
 *  2. Change SECRET below to any long random word, and NOTIFY_EMAIL if wanted.
 *  3. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 *     Google warns "Google hasn't verified this app": click Advanced, then
 *     "Go to ... (unsafe)". It is your own script, so this is expected.
 *  4. Copy the web app URL, add ?key=YOUR_SECRET to the end, and save it in
 *     the worker as LEAD_WEBHOOK_URL.
 *
 * IMPORTANT: after ANY change to this code, go to Deploy > Manage deployments >
 * (pencil icon) > Version: New version > Deploy. Otherwise the old code keeps running.
 *
 * If you change COLUMNS after the sheet already has rows, fix the header row
 * by hand (or delete the "Enquiries" tab so it is recreated).
 */
const SECRET = "change-me-to-a-long-random-word";
const NOTIFY_EMAIL = "";          // e.g. "owner@example.com"; leave "" for no email
const SHEET_NAME = "Enquiries";

const COLUMNS = [
  "ref", "received_at", "priority", "is_update", "customer_name", "company",
  "country", "city", "phone_whatsapp", "email", "preferred_contact",
  "buyer_type", "enquiry_type", "items", "delivery_destination", "timeline",
  "summary", "utm_source", "utm_medium", "utm_campaign", "utm_content",
  "utm_term", "page", "session_id", "status"
];

function doPost(e) {
  if (!e || !e.parameter || e.parameter.key !== SECRET) return reply({ ok: false, error: "unauthorised" });

  let lead;
  try { lead = JSON.parse(e.postData.contents); }
  catch (err) { return reply({ ok: false, error: "body is not valid JSON" }); }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
  }

  const itemsText = (lead.items || [])
    .map(i => [i.product, i.specification, i.quantity && "qty " + i.quantity].filter(Boolean).join(", "))
    .join("\n");

  const row = COLUMNS.map(c => {
    if (c === "items") return asText(itemsText);
    if (c === "status") return "New";   // the team changes this: Contacted, Quoted, Won, Lost
    const v = lead[c];
    return v === undefined || v === null ? "" : asText(v);
  });
  sheet.appendRow(row);

  if (NOTIFY_EMAIL) {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: `${lead.is_update ? "Updated" : "New"} enquiry ${lead.ref} [${lead.priority}] ${lead.customer_name}, ${lead.country}`,
      body: [
        lead.summary, "",
        `Name: ${lead.customer_name}${lead.company ? " (" + lead.company + ")" : ""}`,
        `Location: ${[lead.city, lead.country].filter(Boolean).join(", ")}`,
        `WhatsApp/phone: ${lead.phone_whatsapp || "-"}`,
        `Email: ${lead.email || "-"}`,
        `Type: ${lead.buyer_type}, ${lead.enquiry_type}`, "",
        "Items:", itemsText, "",
        `Destination: ${lead.delivery_destination || "-"}`,
        `Timeline: ${lead.timeline || "-"}`,
        `Came from: ${[lead.utm_source, lead.utm_campaign].filter(Boolean).join(" / ") || "website"}`
      ].join("\n")
    });
  }
  return reply({ ok: true, ref: lead.ref });
}

// Google Sheets treats text starting with = + - or @ as a formula. That turns
// phone numbers like "+234 800..." into #ERROR!, and would let a visitor put a
// formula into your sheet. A leading apostrophe makes Sheets keep it as plain text.
function asText(v) {
  return typeof v === "string" && /^[=+\-@]/.test(v) ? "'" + v : v;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
