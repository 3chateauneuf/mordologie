export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const rawUrl = req.query.url;
  if (!rawUrl || typeof rawUrl !== "string") {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  let targetUrl;
  try {
    targetUrl = new URL(rawUrl);
  } catch {
    return res.status(400).json({ error: "Invalid URL" });
  }

  if (targetUrl.protocol !== "https:") {
    return res.status(400).json({ error: "Only HTTPS URLs are supported" });
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: { "User-Agent": "Mordologie-CalendarSync/1.0" },
    });
    if (!response.ok) {
      return res.status(502).json({ error: `Upstream returned ${response.status}` });
    }
    const text = await response.text();
    const events = parseIcs(text);
    return res.status(200).json({ events });
  } catch {
    return res.status(502).json({ error: "Failed to fetch calendar" });
  }
}

function unfoldLines(text) {
  return text.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "");
}

function unescapeIcs(value) {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

function parseIcsDateToIso(valueStr, tzid) {
  if (!valueStr) return null;

  const isUtc = valueStr.endsWith("Z");
  const isDate = valueStr.length === 8;

  const y = +valueStr.slice(0, 4);
  const mo = +valueStr.slice(4, 6);
  const d = +valueStr.slice(6, 8);
  const h = isDate ? 0 : +(valueStr.slice(9, 11) || "0");
  const mi = isDate ? 0 : +(valueStr.slice(11, 13) || "0");
  const s = isDate ? 0 : +(valueStr.slice(13, 15) || "0");

  const assumedUtc = Date.UTC(y, mo - 1, d, h, mi, s);

  if (isUtc || isDate || !tzid) {
    return new Date(assumedUtc).toISOString();
  }

  try {
    const fmt = new Intl.DateTimeFormat("sv-SE", {
      timeZone: tzid,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    // sv-SE format: "2026-04-27 09:00:00"
    const localStr = fmt.format(new Date(assumedUtc)).replace(" ", "T");
    const localShownMs = new Date(localStr + "Z").getTime();
    const offset = localShownMs - assumedUtc; // local - UTC
    return new Date(assumedUtc - offset).toISOString();
  } catch {
    return new Date(assumedUtc).toISOString();
  }
}

function parseIcs(text) {
  const unfolded = unfoldLines(text);
  const lines = unfolded.split(/\r?\n/);
  const events = [];
  let current = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = {};
      continue;
    }
    if (line === "END:VEVENT") {
      if (current && current.uid && current.dtstart) {
        const startIso = parseIcsDateToIso(current.dtstart, current.dtstart_tzid);
        const endIso = parseIcsDateToIso(
          current.dtend || current.dtstart,
          current.dtend_tzid || current.dtstart_tzid,
        );
        if (startIso && endIso && current.status !== "CANCELLED") {
          events.push({
            uid: current.uid,
            title: current.summary || "",
            description: current.description || "",
            location: current.location || "",
            start_at: startIso,
            end_at: endIso,
            all_day: current.dtstart_is_date || false,
          });
        }
      }
      current = null;
      continue;
    }
    if (!current) continue;

    const colonIdx = line.indexOf(":");
    if (colonIdx < 0) continue;
    const propFull = line.slice(0, colonIdx);
    const value = line.slice(colonIdx + 1);

    const semiIdx = propFull.indexOf(";");
    const propName = (semiIdx >= 0 ? propFull.slice(0, semiIdx) : propFull).toUpperCase();
    const paramsStr = semiIdx >= 0 ? propFull.slice(semiIdx + 1) : "";

    let tzid = null;
    let isDateValue = false;
    for (const param of paramsStr.split(";")) {
      const eqIdx = param.indexOf("=");
      if (eqIdx < 0) continue;
      const k = param.slice(0, eqIdx);
      const v = param.slice(eqIdx + 1);
      if (k === "TZID") tzid = v;
      if (k === "VALUE" && v === "DATE") isDateValue = true;
    }

    switch (propName) {
      case "UID":
        current.uid = value;
        break;
      case "SUMMARY":
        current.summary = unescapeIcs(value);
        break;
      case "DESCRIPTION":
        current.description = unescapeIcs(value);
        break;
      case "LOCATION":
        current.location = unescapeIcs(value);
        break;
      case "STATUS":
        current.status = value.toUpperCase();
        break;
      case "DTSTART":
        current.dtstart = value;
        current.dtstart_tzid = tzid;
        current.dtstart_is_date = isDateValue;
        break;
      case "DTEND":
        current.dtend = value;
        current.dtend_tzid = tzid;
        break;
    }
  }

  return events;
}
