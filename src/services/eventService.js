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
  async function queryClass(className) {
    const C = Parse.Object.extend(className);
    const q = new Parse.Query(C);
    q.ascending("startDate");
    return q.find();
  }

  try {
    console.info("fetchEvents: querying Parse for class 'Event'...");
    let results = await queryClass("Events");

    if (!results || results.length === 0) {
      console.info("fetchEvents: no results for 'Events'...");
    }

    console.info(`fetchEvents: got ${results ? results.length : 0} results`);

    return (results || []).map((o) => {
      function getDateFromObject(obj, keys) {
        for (const k of keys) {
          const v = obj.get(k);
          if (v === undefined || v === null) continue;
          if (v instanceof Date) return v;
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

      const rawImage = o.get("images") || o.get("imageUrl") || o.get("image");
      let imageUrl;
      if (rawImage) {
        const candidate = Array.isArray(rawImage) ? rawImage[0] : rawImage;
        if (candidate) {
          if (typeof candidate.url === "function") {
            try {
              imageUrl = candidate.url();
            } catch (e) {
              imageUrl = undefined;
            }
          } else if (typeof candidate === "string") {
            imageUrl = candidate;
          } else if (candidate.url) {
            imageUrl = candidate.url;
          }
        }
      }

      return {
        id: o.id,
        title: o.get("title") || "",
        category: o.get("category") || "",
        organizer: o.get("organizer") || "",
        date: formatDateRange(startDate, endDate) || o.get("date") || "" || "",
        location: o.get("location") || "",
        image: imageUrl,
        _startDate: startDate || null,
        _endDate: endDate || null,
      };
    });
  } catch (err) {
    console.error("fetchEvents error", err);
    const e = new Error(`fetchEvents failed: ${err.message || err}`);
    e.original = err;
    throw e;
  }
}
