import React, { useEffect, useMemo, useState } from "react";
import "../css/Calendar.css";
import { fetchEvents } from "../services/eventService";

// Note: events are fetched from the Parse `Events`/`Event` class via
// `fetchEvents()`. Each event object is expected to include `_startDate`
// (a JS Date or null) and `id` (Parse objectId). We group events by the
// local date key `YYYY-MM-DD` and render pills for each day.

function buildGrid(current) {
  const first = new Date(current.getFullYear(), current.getMonth(), 1);
  const mondayOffset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - mondayOffset);
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push(d);
  }
  return cells;
}

function addMonths(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

function toDateKeyLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function getPillColor(ev) {
  // Prefer an explicit color set on the event (from backend). Otherwise
  // derive the color from `ev.category` only. No title-based heuristics.
  if (ev.color) return ev.color;
  const cat = (ev.category || "").toLowerCase();
  if (!cat) return "gray"; // default when category is missing
  if (cat.includes("sport") || cat.includes("fitness")) return "green";
  if (cat.includes("party")) return "orange";
  if (cat.includes("arts") || cat.includes("culture")) return "blue";
  if (cat.includes("hobbies") || cat.includes("lifestyle")) return "purple";
  // any other category gets a neutral blue pill
  return "blue";
}

export default function Calendar() {
  const [cursor, setCursor] = useState(new Date(2025, 10, 1));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const label = cursor.toLocaleString("en", { month: "long", year: "numeric" });

  const grid = useMemo(() => buildGrid(cursor), [cursor]);
  const monthIndex = cursor.getMonth();
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const data = await fetchEvents();
        if (!mounted) return;
        setEvents(data || []);
        setLoading(false);
      } catch (err) {
        console.error("Calendar: failed to fetch events", err);
        if (!mounted) return;
        setError(err);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Map events into a date-key -> [events] map (local dates)
  const eventsByDate = useMemo(() => {
    const m = new Map();
    for (const ev of events || []) {
      let key = null;
      if (ev._startDate instanceof Date && !isNaN(ev._startDate)) {
        key = toDateKeyLocal(ev._startDate);
      } else if (ev.date) {
        // try to parse string date (fallback)
        const parsed = new Date(ev.date);
        if (!isNaN(parsed)) key = toDateKeyLocal(parsed);
      }
      if (!key) continue;
      if (!m.has(key)) m.set(key, []);
      m.get(key).push(ev);
    }
    // sort events for each day by start time
    for (const [k, arr] of m.entries()) {
      arr.sort((a, b) => {
        const ta = a._startDate ? +a._startDate : 0;
        const tb = b._startDate ? +b._startDate : 0;
        return ta - tb;
      });
    }
    return m;
  }, [events]);

  return (
    <div className="page">
      <h1 className="h1">Calendar</h1>

      <div className="chips">
        <span className="chip">Arts &amp; Culture</span>
        <span className="chip">Sports &amp; Fitness</span>
        <span className="chip">Hobbies &amp; Lifestyle</span>
        <span className="chip">Party</span>
        <span className="chip">Registered events</span>
      </div>

      <div className="headerBar">
        <div className="left">
          <button
            type="button"
            className="arrow"
            onClick={() => setCursor(addMonths(cursor, -1))}
            aria-label="Previous month"
          >
            ←
          </button>
          <span className="monthLabel">{label}</span>
        </div>

        <button
          type="button"
          className="arrow"
          onClick={() => setCursor(addMonths(cursor, 1))}
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className="weekdays">
        {weekdays.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      <div className="grid">
        {grid.map((date) => {
          const out = date.getMonth() !== monthIndex;
          const key = toDateKeyLocal(date);
          const dayEvents = eventsByDate.get(key) || [];

          return (
            <div
              key={date.toDateString()}
              className={`cell ${out ? "out" : ""}`}
            >
              <div className="day">{date.getDate()}</div>
              <div className="pills">
                {dayEvents.map((ev) => {
                  const color = getPillColor(ev);
                  return (
                    <div
                      key={ev.id}
                      className={`pill ${color}`}
                      title={ev.title}
                    >
                      {ev._startDate
                        ? new Intl.DateTimeFormat("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(ev._startDate) +
                          " — " +
                          ev.title
                        : ev.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
