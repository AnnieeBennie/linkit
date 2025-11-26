import Parse from "./parse";

/* ---------------------- DATE HELPERS ---------------------- */

function parseDate(obj, fields) {
  for (let f of fields) {
    const value = obj.get(f);
    if (value) {
      const date = new Date(value);
      if (date.toString() !== "Invalid Date") {
        return date;
      }
    }
  }
  return null;
}

function formatDateRange(start, end) {
  if (!start) return "";

  const date = start.toLocaleDateString("en-GB");
  const startTime = start.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (end) {
    const endTime = end.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return date + " | " + startTime + " - " + endTime;
  }

  return date + " | " + startTime;
}

/* ---------------------- MAIN FETCH FUNCTION ---------------------- */

export async function fetchEvents() {
  try {
    const Event = Parse.Object.extend("Events");
    const q = new Parse.Query(Event);
    q.ascending("startDate");

    const results = await q.find();

    return results.map((o) => {
      // get start/end date from the most common fields
      const start = o.get("start_date");
      const end = o.get("end_date");

      //  convert to JS Date if they exist
      const _startDate = start ? new Date(start) : null;
      const _endDate = end ? new Date(end) : null;

      const img = o.get("image");

      return {
        id: o.id,
        title: o.get("title") || "",
        category: o.get("category") || "",
        organizer: o.get("organizer") || "",
        date: _startDate
          ? formatDateRange(_startDate, _endDate)
          : o.get("date") || "",
        location: o.get("location") || "",
        image: img ? img.url() : undefined,
        description: o.get("event_description"),
        _startDate,
        _endDate,
      };
    });
  } catch (err) {
    console.error("fetchEvents error", err);
    return [];
  }
}
