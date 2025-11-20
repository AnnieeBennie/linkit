import React, { useState, useEffect } from "react";
import "../css/Calendar.css";
import { fetchEvents } from "../services/eventService";
import EventFilter from "../Components/EventFilter";

// Helpers
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
  if (ev.color) return ev.color;
  const cat = (ev.category || "").toLowerCase();
  if (!cat) return "gray";
  if (cat.includes("sport") || cat.includes("fitness")) return "green";
  if (cat.includes("party")) return "orange";
  if (cat.includes("arts") || cat.includes("culture")) return "blue";
  if (cat.includes("hobbies") || cat.includes("lifestyle")) return "purple";
  return "gray";
}

export default function Calendar() {
  const [cursor, setCursor] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(null);

  const label = cursor.toLocaleString("en", { month: "long", year: "numeric" });
  const grid = buildGrid(cursor);
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

  if (loading) return <div className="page">Loading events…</div>;
  if (error) return <div className="page">Failed to load events</div>;

  // Build events by date and filter inline
  const eventsByDate = new Map();
  for (const ev of events || []) {
    if (filter && ev.category !== filter) continue;

    let key = null;
    if (ev._startDate instanceof Date && !isNaN(ev._startDate)) {
      key = toDateKeyLocal(ev._startDate);
    } else if (ev.date) {
      const parsed = new Date(ev.date);
      if (!isNaN(parsed)) key = toDateKeyLocal(parsed);
    }
    if (!key) continue;

    if (!eventsByDate.has(key)) eventsByDate.set(key, []);
    eventsByDate.get(key).push(ev);
  }

  // Sort events for each day
  for (const arr of eventsByDate.values()) {
    arr.sort((a, b) => (+a._startDate || 0) - (+b._startDate || 0));
  }

  return (
    <div className="page">
      {/* Event filter */}
      <EventFilter onFilter={setFilter} />

      <h1 className="h1">Calendar</h1>

      <div className="calendar-container">
        {/* Month navigation */}
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

        {/* Weekdays */}
        <div className="weekdays">
          {weekdays.map((w) => (
            <div key={w}>{w}</div>
          ))}
        </div>

        {/* Calendar grid */}
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
    </div>
  );
}
