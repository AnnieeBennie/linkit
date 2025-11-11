import Parse from "./parse";

function formatDateRange(startDate, endDate) {
  if (!startDate) return "";
  try {
    const optsDate = { day: "2-digit", month: "2-digit", year: "2-digit" };
    const optsTime = { hour: "2-digit", minute: "2-digit" };
    const datePart = new Intl.DateTimeFormat("en-GB", optsDate).format(
      startDate
    );
    const startTime = new Intl.DateTimeFormat("en-GB", optsTime).format(
      startDate
    );
    const endTime = endDate
      ? new Intl.DateTimeFormat("en-GB", optsTime).format(endDate)
      : null;
    return endTime
      ? `${datePart} | ${startTime} - ${endTime}`
      : `${datePart} | ${startTime}`;
  } catch (e) {
    return "";
  }
}

export async function fetchEvents() {
  // Try both singular and plural class names since the dashboard shows "Events"
  // but it's common to use either "Event" or "Events" when creating classes.
  async function queryClass(className) {
    const C = Parse.Object.extend(className);
    const q = new Parse.Query(C);
    q.ascending("startDate");
    return q.find();
  }

  try {
    console.info("fetchEvents: querying Parse for class 'Event'...");
    let results = await queryClass("Event");

    if (!results || results.length === 0) {
      console.info(
        "fetchEvents: no results for 'Event', trying 'Events' class..."
      );
      results = await queryClass("Events");
    }

    console.info(`fetchEvents: got ${results ? results.length : 0} results`);

    return (results || []).map((o) => {
      // Normalize date fields: some data may use camelCase (startDate) or
      // snake_case (start_date). Also the field may be a Date or a string
      // depending on how the row was created or exported. Try several keys
      // and coerce string values into Date objects.
      function getDateFromObject(obj, keys) {
        for (const k of keys) {
          const v = obj.get(k);
          if (v === undefined || v === null) continue;
          if (v instanceof Date) return v;
          // Parse strings like 'Thu Oct 16 2025 20:00:00 GMT+0200 (...)' or ISO
          if (typeof v === "string") {
            const parsed = new Date(v);
            if (!isNaN(parsed)) return parsed;
          }
          // Parse Parse.Date-like object (sometimes comes as { __type: 'Date', iso: '...' })
          if (typeof v === "object" && v.__type === "Date" && v.iso) {
            const parsed = new Date(v.iso);
            if (!isNaN(parsed)) return parsed;
          }
        }
        return null;
      }

      const startDate = getDateFromObject(o, [
        "startDate",
        "start_date",
        "date",
        "start_time",
      ]);
      const endDate = getDateFromObject(o, ["endDate", "end_date", "end_time"]);
      // Extract image URL safely. Parse may return a Parse.File instance,
      // or an object with a `url` field, or a plain string.
      const rawImage = o.get("imageUrl") || o.get("image");
      let imageUrl;
      if (rawImage) {
        if (typeof rawImage === "string") {
          imageUrl = rawImage;
        } else if (typeof rawImage.url === "function") {
          // Parse.File instance
          try {
            imageUrl = rawImage.url();
          } catch (e) {
            // fallthrough
            imageUrl = undefined;
          }
        } else if (rawImage.url) {
          // plain object with url property
          imageUrl = rawImage.url;
        }
      }

      return {
        id: o.id,
        title: o.get("title") || o.get("name") || "",
        category: o.get("category") || "",
        organizer: o.get("organizer") || "",
        date: formatDateRange(startDate, endDate) || o.get("date") || "" || "",
        location: o.get("location") || "",
        // imageUrl or image string; EventCard accepts a string URL as src
        image: imageUrl,
        // preserve raw dates if callers need them
        _startDate: startDate || null,
        _endDate: endDate || null,
      };
    });
  } catch (err) {
    console.error("fetchEvents error", err);
    // re-throw with extra context to help debugging in the UI
    const e = new Error(`fetchEvents failed: ${err.message || err}`);
    e.original = err;
    throw e;
  }
}
