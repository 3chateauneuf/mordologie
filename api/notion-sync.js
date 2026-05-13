const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = process.env.NOTION_DB_ID;
const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  if (!NOTION_TOKEN || !NOTION_DB_ID) {
    return res.status(500).json({ error: "Notion not configured" });
  }

  const { entry } = req.body ?? {};
  if (!entry?.time_entry_id) {
    return res.status(400).json({ error: "Missing time_entry_id" });
  }

  const headers = {
    Authorization: `Bearer ${NOTION_TOKEN}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };

  try {
    const searchRes = await fetch(`${NOTION_API}/databases/${NOTION_DB_ID}/query`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        filter: { property: "ID Entrée", rich_text: { equals: entry.time_entry_id } },
        page_size: 1,
      }),
    });
    const searchData = await searchRes.json();
    const existingPage = searchData.results?.[0];

    const properties = buildProperties(entry);

    if (existingPage) {
      await fetch(`${NOTION_API}/pages/${existingPage.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ properties }),
      });
      return res.status(200).json({ ok: true, action: "updated" });
    } else {
      await fetch(`${NOTION_API}/pages`, {
        method: "POST",
        headers,
        body: JSON.stringify({ parent: { database_id: NOTION_DB_ID }, properties }),
      });
      return res.status(200).json({ ok: true, action: "created" });
    }
  } catch (err) {
    console.error("Notion sync error:", err);
    return res.status(500).json({ error: "Notion sync failed" });
  }
}

function rt(value) {
  return [{ text: { content: String(value || "").slice(0, 2000) } }];
}

function buildProperties(e) {
  const props = {
    "Sujet":     { title: rt(e.project_name || "(sans sujet)") },
    "ID Entrée": { rich_text: rt(e.time_entry_id) },
    "Tâche":     { rich_text: rt(e.task_label) },
    "Tags":      { rich_text: rt(e.tags_text) },
    "Note":      { rich_text: rt(e.notes) },
  };

  if (e.entry_date)               props["Date"]          = { date: { start: e.entry_date } };
  if (e.duration_minutes)         props["Durée (min)"]   = { number: e.duration_minutes };
  if (e.user_name)                props["Cargonaute"]    = { select: { name: e.user_name } };
  if (e.client_name)              props["Client"]        = { select: { name: e.client_name } };
  if (e.activity_category_label)  props["Catégorie"]     = { select: { name: e.activity_category_label } };
  if (e.source)                   props["Source"]        = { select: { name: e.source } };

  return props;
}
