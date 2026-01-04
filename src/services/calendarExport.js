// Turn a JS date into YYYYMMDDTHHMMSSZ (UTC) format
function formatICSDate(date) {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");

  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

// Make sure text doesn't break the ICS format
function clean(text = "") {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function downloadICS({ title, description, location, start, end }) {
  const safeName = (title || "event").replace(/[^a-z0-9-_]/gi, "_");

  const ics =
    "BEGIN:VCALENDAR\n" +
    "VERSION:2.0\n" +
    "BEGIN:VEVENT\n" +
    "UID:" +
    Date.now() +
    "@linkit\n" +
    "DTSTAMP:" +
    formatICSDate(new Date()) +
    "\n" +
    "DTSTART:" +
    formatICSDate(start) +
    "\n" +
    "DTEND:" +
    formatICSDate(end) +
    "\n" +
    "SUMMARY:" +
    clean(title) +
    "\n" +
    "DESCRIPTION:" +
    clean(description) +
    "\n" +
    "LOCATION:" +
    clean(location) +
    "\n" +
    "END:VEVENT\n" +
    "END:VCALENDAR";

  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = safeName + ".ics";
  link.click();

  URL.revokeObjectURL(url);
}

export default { downloadICS };
