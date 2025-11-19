import Parse from "./parse";

/* ---------------------- DATE HELPERS ---------------------- */

function parseDate(obj, fields) {
  for (const f of fields) {
    const v = obj.get(f);
    if (!v) continue;

    if (v instanceof Date && !isNaN(v)) return v;

    if (typeof v === "object" && v.__type === "Date" && v.iso) {
      const d = new Date(v.iso);
      if (!isNaN(d)) return d;
    }

    if (typeof v === "string") {
      const d = new Date(v);
      if (!isNaN(d)) return d;
    }
  }
  return null;
}

function formatDateRange(start, end) {
  if (!start) return "";

  const date = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(start);

  const startTime = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(start);

  const endTime =
    end &&
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(end);

  return endTime
    ? `${date} | ${startTime} - ${endTime}`
    : `${date} | ${startTime}`;
}

/* ---------------------- MAIN FETCH FUNCTION ---------------------- */

export async function fetchEvents() {
  try {
    const Event = Parse.Object.extend("Events");
    const q = new Parse.Query(Event);
    q.ascending("startDate");

    const results = await q.find();

    return results.map((o) => {
      const start = parseDate(o, [
        "startDate",
        "start_date",
        "date",
        "start_time",
      ]);
      const end = parseDate(o, ["endDate", "end_date", "end_time"]);
      const img = o.get("image");

      return {
        id: o.id,
        title: o.get("title") || "",
        category: o.get("category") || "",
        organizer: o.get("organizer") || "",
        date: formatDateRange(start, end) || o.get("date") || "",
        location: o.get("location") || "",
        image: img ? img.url() : undefined,
        _startDate: start,
        _endDate: end,
      };
    });
  } catch (err) {
    console.error("fetchEvents error", err);
    throw new Error("Failed to fetch events");
  }
}
