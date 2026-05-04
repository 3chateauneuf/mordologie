const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = process.env.NOTION_DB_ID;
const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  if (!NOTION_TOKEN || !NOTION_DB_ID) {
    return res.status(500).json({ error: "NOTION_TOKEN ou NOTION_DB_ID manquant" });
  }

  const headers = {
    Authorization: `Bearer ${NOTION_TOKEN}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };

  try {
    // Find the existing title property name (usually "Name")
    const dbRes = await fetch(`${NOTION_API}/databases/${NOTION_DB_ID}`, { headers });
    const db = await dbRes.json();
    if (!dbRes.ok) {
      return res.status(502).json({ error: db.message ?? "Notion API error", details: db });
    }

    const titlePropEntry = Object.entries(db.properties ?? {}).find(([, v]) => v.type === "title");
    const titlePropName = titlePropEntry?.[0] ?? "Name";

    // Patch: rename title → "Sujet", add all other properties
    const patchRes = await fetch(`${NOTION_API}/databases/${NOTION_DB_ID}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        title: [{ text: { content: "Mordologie — Temps" } }],
        properties: {
          [titlePropName]: { name: "Sujet" },
          "ID Entrée":    { rich_text: {} },
          "Tâche":        { rich_text: {} },
          "Tags":         { rich_text: {} },
          "Note":         { rich_text: {} },
          "OKR":          { rich_text: {} },
          "KR":           { rich_text: {} },
          "Cargonaute":   { select: {} },
          "Client":       { select: {} },
          "Catégorie":    { select: {} },
          "Catégorie KPI":{ select: {} },
          "Pôle":         { select: {} },
          "Source":       { select: {} },
          "Date":         { date: {} },
          "Durée (min)":  { number: { format: "number" } },
        },
      }),
    });

    const patchData = await patchRes.json();
    if (!patchRes.ok) {
      return res.status(502).json({ error: patchData.message ?? "Notion patch error", details: patchData });
    }

    return res.status(200).json({ ok: true, message: "Base de données configurée avec succès." });
  } catch (err) {
    console.error("Notion setup error:", err);
    return res.status(500).json({ error: "Setup failed" });
  }
}
