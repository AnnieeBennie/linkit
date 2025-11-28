import React, { useState, useEffect } from "react";
import "../css/Calendar.css";

import { fetchEvents } from "../services/eventService";
import { getRegisteredEventIdsForCurrentUser } from "../services/eventSignupService";

import EventFilter from "../Components/EventFilter";
import EventDetails from "../Components/EventDetails";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [filter, setFilter] = useState(null);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date());
  const [error, setError] = useState(null);

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // ---------------------------
  // Load events on first render
  // ---------------------------
  useEffect(() => {
    setLoading(true);
    fetchEvents()
      .then((data) => setEvents(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  // --------------------------------------
  // Refresh registered event IDs when filter changes
  // --------------------------------------
  async function refreshRegisteredIds() {
    if (filter !== "Registered Events") return;

    try {
      const ids = await getRegisteredEventIdsForCurrentUser();
      setRegisteredIds(ids || []);
    } catch (err) {
      console.warn("Calendar: refresh registered ids failed", err);
      setRegisteredIds([]);
    }
  }

  useEffect(() => {
    refreshRegisteredIds();
  }, [filter]);

  // ---------------------------
  // Calendar day generation (42 cells)
  // ---------------------------
  const grid = (() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const startOffset = (first.getDay() + 6) % 7;
    const start = new Date(first);
    start.setDate(first.getDate() - startOffset);

    const cells = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      cells.push(d);
    }
    return cells;
  })();

  const toDateKey = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const getColor = (cat = "") => {
    const c = cat.toLowerCase();
    if (c.includes("sport") || c.includes("fitness")) return "green";
    if (c.includes("party")) return "orange";
    if (c.includes("arts") || c.includes("culture")) return "blue";
    if (c.includes("hobbies") || c.includes("lifestyle")) return "purple";
    return "gray";
  };

  // ---------------------------
  // Loading / Error states
  // ---------------------------
  if (loading) return <div className="page">Loading events…</div>;
  if (error) return <div className="page">Could not load events</div>;

  // ---------------------------
  // Group events by date
  // ---------------------------
  const eventsByDate = {};
  events.forEach((ev) => {
    // Apply filter
    if (filter) {
      if (filter === "Registered Events" && !registeredIds.includes(ev.id))
        return;
      if (filter !== "Registered Events" && ev.category !== filter) return;
    }

    const key = ev._startDate
      ? toDateKey(ev._startDate)
      : toDateKey(new Date(ev.date));

    if (!eventsByDate[key]) eventsByDate[key] = [];
    eventsByDate[key].push(ev);
  });

  // sort events in each day
  Object.values(eventsByDate).forEach((arr) =>
    arr.sort((a, b) => {
      if (!a._startDate || !b._startDate) return 0;
      return a._startDate - b._startDate;
    })
  );

  // ---------------------------
  // Render calendar UI
  // ---------------------------
  return (
    <div className="page">
      <EventFilter onFilter={setFilter} />

      <h1 className="h1">Calendar</h1>

      <div className="calendar-container">
        {/* Header Month Navigation */}
        <div className="headerBar">
          <div className="left">
            <button
              className="arrow"
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
              }
            >
              ←
            </button>

            <span className="monthLabel">
              {month.toLocaleString("en", { month: "long", year: "numeric" })}
            </span>
          </div>

          <button
            className="arrow"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
            }
          >
            →
          </button>
        </div>

        {/* Weekday names */}
        <div className="weekdays">
          {weekdays.map((w) => (
            <div key={w}>{w}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid">
          {grid.map((date) => {
            const key = toDateKey(date);
            const dayEvents = eventsByDate[key] || [];
            const out = date.getMonth() !== month.getMonth();

            return (
              <div key={key} className={`cell ${out ? "out" : ""}`}>
                <div className="day">{date.getDate()}</div>

                <div className="pills">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className={`pill ${getColor(ev.category)}`}
                      title={ev.title}
                      onClick={() => {
                        setSelectedEvent(ev);
                        setShowDetails(true);
                      }}
                    >
                      {ev._startDate
                        ? `${new Date(ev._startDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} — ${ev.title}`
                        : ev.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Popup */}
      {showDetails && selectedEvent && (
        <div
          className="details-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowDetails(false)}
        >
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <EventDetails
              event={selectedEvent}
              onClose={() => setShowDetails(false)}
              onSignup={refreshRegisteredIds}
              onUnsignup={refreshRegisteredIds}
            />
          </div>
        </div>
      )}
    </div>
  );
}
