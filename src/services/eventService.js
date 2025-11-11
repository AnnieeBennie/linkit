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
      const startDate = o.get("startDate");
      const endDate = o.get("endDate");
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
        date: formatDateRange(startDate, endDate) || o.get("date") || "",
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
