import Parse from "./parse";

/* ---------------------- DATE HELPERS ---------------------- */

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

/* ---------------------- TRANSFORMATION HELPERS ---------------------- */

function getEventDates(rawEvent) {
  const start = rawEvent.get("start_date");
  const end = rawEvent.get("end_date");

  const _startDate = start ? new Date(start) : null;
  const _endDate = end ? new Date(end) : null;

  return {
    _startDate,
    _endDate,
    formattedDate: _startDate ? formatDateRange(_startDate, _endDate) : "",
  };
}

function getEventImage(rawEvent) {
  const img = rawEvent.get("image");
  return img ? img.url() : undefined;
}

function transformEventObject(rawEvent) {
  const { _startDate, _endDate, formattedDate } = getEventDates(rawEvent);
  const image = getEventImage(rawEvent);

  return {
    id: rawEvent.id,
    title: rawEvent.get("title") || "",
    category: rawEvent.get("category") || "",
    organizer: rawEvent.get("organizer") || "",
    date: formattedDate,
    location: rawEvent.get("location") || "",
    image,
    description: rawEvent.get("event_description"),
    _startDate,
    _endDate,
  };
}

function createEventQuery() {
  const Event = Parse.Object.extend("Events");
  const q = new Parse.Query(Event);
  q.ascending("start_date");
  return q;
}

/* ---------------------- MAIN FETCH FUNCTION ---------------------- */

export async function fetchEvents() {
  try {
    const q = createEventQuery();
    const results = await q.find();
    return results.map(transformEventObject);
  } catch (err) {
    console.error("fetchEvents error", err);
    return [];
  }
}
