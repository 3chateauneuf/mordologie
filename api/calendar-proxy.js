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

// --- ICS unfolding ---

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

// --- Date parsing ---

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

  if (!y || !mo || !d) return null;

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
    const localStr = fmt.format(new Date(assumedUtc)).replace(" ", "T");
    const localShownMs = new Date(localStr + "Z").getTime();
    const offset = localShownMs - assumedUtc;
    return new Date(assumedUtc - offset).toISOString();
  } catch {
    return new Date(assumedUtc).toISOString();
  }
}

// Advance a UTC date by N days, preserving local wall-clock time in tzid (DST-aware).
function advanceDays(utcDate, days, tzid) {
  const msPerDay = 86400000;
  const candidate = new Date(utcDate.getTime() + days * msPerDay);
  if (!tzid) return candidate;

  try {
    const fmt = new Intl.DateTimeFormat("sv-SE", {
      timeZone: tzid,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const origTime = fmt.format(utcDate);   // e.g. "09:00:00"
    const candTime = fmt.format(candidate); // should equal origTime after DST-aware jump
    if (origTime !== candTime) {
      // DST shift: adjust by the difference
      const [oh, om, os] = origTime.split(":").map(Number);
      const [ch, cm, cs] = candTime.split(":").map(Number);
      const origSec = oh * 3600 + om * 60 + os;
      const candSec = ch * 3600 + cm * 60 + cs;
      const diffMs = (candSec - origSec) * 1000;
      return new Date(candidate.getTime() - diffMs);
    }
    return candidate;
  } catch {
    return candidate;
  }
}

// --- RRULE parser ---

function parseRRule(rruleStr) {
  if (!rruleStr) return null;
  const parts = {};
  for (const part of rruleStr.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    parts[part.slice(0, eq).toUpperCase()] = part.slice(eq + 1);
  }
  const freq = parts["FREQ"];
  if (!freq || !["DAILY", "WEEKLY", "MONTHLY"].includes(freq)) return null;

  const interval = Math.max(1, parseInt(parts["INTERVAL"] || "1", 10));
  const count = parts["COUNT"] ? parseInt(parts["COUNT"], 10) : null;
  const until = parts["UNTIL"] ? parseIcsDateToIso(parts["UNTIL"].replace("Z", ""), parts["UNTIL"].endsWith("Z") ? null : null) : null;
  const byDay = parts["BYDAY"] ? parts["BYDAY"].split(",").map((d) => d.trim().toUpperCase()) : null;

  return { freq, interval, count, until, byDay };
}

// Day abbreviations to JS getDay() values (0=Sun)
const DAY_MAP = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };

function expandRRule(baseEvent, rrule, exdateDates, exceptionsMap, tzid) {
  const dtstart = new Date(baseEvent.start_at);
  const dtend = new Date(baseEvent.end_at);
  const durationMs = Math.max(dtend.getTime() - dtstart.getTime(), 0);

  // Expansion window: 60 days before now to 120 days ahead
  const now = new Date();
  const windowStart = new Date(now.getTime() - 60 * 86400000);
  const windowEnd = new Date(now.getTime() + 120 * 86400000);

  const until = rrule.until ? new Date(rrule.until) : windowEnd;
  const limit = Math.min(rrule.count ?? 9999, 500);

  const results = [];
  let cursor = new Date(dtstart);
  let generated = 0;

  while (cursor <= until && cursor <= windowEnd && generated < limit) {
    const occurrenceMatches = !rrule.byDay || rrule.byDay.some((bd) => {
      const abbr = bd.replace(/^[+-]?\d+/, ""); // strip positional prefix like 2MO
      return DAY_MAP[abbr] === cursor.getDay();
    });

    if (occurrenceMatches) {
      const cursorIso = cursor.toISOString();
      const dateKey = cursorIso.slice(0, 10);
      const isExcluded = exdateDates.has(dateKey) || exdateDates.has(cursorIso);

      if (!isExcluded && cursor >= windowStart) {
        const exception = exceptionsMap.get(dateKey);
        if (exception) {
          results.push(exception);
        } else if (cursor.getTime() !== dtstart.getTime() || results.length === 0) {
          results.push({
            uid: baseEvent.uid + "_" + cursorIso,
            title: baseEvent.title,
            description: baseEvent.description,
            location: baseEvent.location,
            start_at: cursorIso,
            end_at: new Date(cursor.getTime() + durationMs).toISOString(),
            all_day: baseEvent.all_day,
          });
        }
        generated++;
      }
    }

    // Advance cursor
    if (rrule.freq === "DAILY") {
      cursor = advanceDays(cursor, rrule.interval, tzid);
    } else if (rrule.freq === "WEEKLY") {
      if (rrule.byDay && rrule.byDay.length > 1) {
        // Multi-day weekly: advance one day at a time until we've gone through one full week cycle
        cursor = advanceDays(cursor, 1, tzid);
      } else {
        cursor = advanceDays(cursor, 7 * rrule.interval, tzid);
      }
    } else if (rrule.freq === "MONTHLY") {
      const next = new Date(cursor);
      next.setMonth(next.getMonth() + rrule.interval);
      cursor = next;
    } else {
      break;
    }

    // Safety: avoid infinite loop if advanceDays returns same value
    if (cursor.getTime() === dtstart.getTime()) break;
  }

  return results;
}

// Parse EXDATE lines (can be comma-separated dates)
function parseExdateLine(value, tzid) {
  const dates = new Set();
  for (const raw of value.split(",")) {
    const iso = parseIcsDateToIso(raw.trim().replace("Z", ""), raw.trim().endsWith("Z") ? null : tzid);
    if (iso) {
      dates.add(iso.slice(0, 10)); // store as date key YYYY-MM-DD
      dates.add(iso);               // also store full ISO for exact match
    }
  }
  return dates;
}

// --- Main ICS parser ---

function parseIcs(text) {
  const unfolded = unfoldLines(text);
  const lines = unfolded.split(/\r?\n/);
  const rawVEvents = [];
  let current = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = { exdateLines: [] };
      continue;
    }
    if (line === "END:VEVENT") {
      if (current && current.uid && current.dtstart) {
        rawVEvents.push(current);
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
      case "UID":         current.uid = value; break;
      case "SUMMARY":     current.summary = unescapeIcs(value); break;
      case "DESCRIPTION": current.description = unescapeIcs(value); break;
      case "LOCATION":    current.location = unescapeIcs(value); break;
      case "STATUS":      current.status = value.toUpperCase(); break;
      case "RRULE":       current.rrule = value; break;
      case "EXDATE":
        current.exdateLines.push({ value, tzid });
        break;
      case "RECURRENCE-ID":
        current.recurrenceId = value;
        current.recurrenceId_tzid = tzid;
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

  // Resolve to output events
  const baseVEvents = [];
  const exceptionVEvents = [];

  for (const v of rawVEvents) {
    if (v.status === "CANCELLED") continue;

    const startIso = parseIcsDateToIso(v.dtstart, v.dtstart_tzid);
    const endRaw = v.dtend || v.dtstart;
    const endIso = parseIcsDateToIso(endRaw, v.dtend_tzid || v.dtstart_tzid);
    if (!startIso || !endIso) continue;

    const event = {
      uid: v.uid,
      title: v.summary || "",
      description: v.description || "",
      location: v.location || "",
      start_at: startIso,
      end_at: endIso,
      all_day: v.dtstart_is_date || false,
      rrule: v.rrule || null,
      exdateLines: v.exdateLines || [],
      tzid: v.dtstart_tzid || null,
    };

    if (v.recurrenceId) {
      const recIdIso = parseIcsDateToIso(v.recurrenceId, v.recurrenceId_tzid || v.dtstart_tzid);
      event.recurrenceId = recIdIso;
      exceptionVEvents.push(event);
    } else {
      baseVEvents.push(event);
    }
  }

  // Group exceptions by uid + date key
  const exceptionsMap = new Map(); // uid -> Map(dateKey -> event)
  for (const exc of exceptionVEvents) {
    if (!exceptionsMap.has(exc.uid)) exceptionsMap.set(exc.uid, new Map());
    const dateKey = exc.recurrenceId.slice(0, 10);
    exceptionsMap.get(exc.uid).set(dateKey, exc);
  }

  const events = [];
  for (const event of baseVEvents) {
    const exdateDates = new Set();
    for (const exLine of event.exdateLines) {
      for (const d of parseExdateLine(exLine.value, exLine.tzid || event.tzid)) {
        exdateDates.add(d);
      }
    }

    const rrule = parseRRule(event.rrule);
    if (rrule) {
      const occurrences = expandRRule(
        event,
        rrule,
        exdateDates,
        exceptionsMap.get(event.uid) ?? new Map(),
        event.tzid,
      );
      for (const occ of occurrences) {
        const dur = occ.all_day ? 86400000 : new Date(occ.end_at).getTime() - new Date(occ.start_at).getTime();
        if (dur > 0) events.push(occ);
      }
    } else {
      // Non-recurring event
      const dur = event.all_day ? 86400000 : new Date(event.end_at).getTime() - new Date(event.start_at).getTime();
      if (dur > 0) events.push(event);
    }
  }

  return events;
}
