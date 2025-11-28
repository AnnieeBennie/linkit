import React, { useState, useEffect } from "react";
import "../css/Calendar.css";
import { fetchEvents } from "../services/eventService";
import { getRegisteredEventIdsForCurrentUser } from "../services/eventSignupService";
import EventFilter from "../Components/EventFilter";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(null);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [month, setMonth] = useState(new Date());

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Build grid of 42 days
  const grid = (() => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0
    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() - startOffset);

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

  const getColor = (cat) => {
    if (!cat) return "gray";
    cat = cat.toLowerCase();
    if (cat.includes("sport") || cat.includes("fitness")) return "green";
    if (cat.includes("party")) return "orange";
    if (cat.includes("arts") || cat.includes("culture")) return "blue";
    if (cat.includes("hobbies") || cat.includes("lifestyle")) return "purple";
    return "gray";
  };

  useEffect(() => {
    setLoading(true);
    fetchEvents()
      .then((data) => setEvents(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (filter !== "Registered Events") {
      setRegisteredIds([]);
      return;
    }
    getRegisteredEventIdsForCurrentUser()
      .then((ids) => setRegisteredIds(ids))
      .catch(() => setRegisteredIds([]));
  }, [filter]);

  if (loading) return <div className="page">Loading events…</div>;
  if (error) return <div className="page">Failed to load events</div>;

  // Group events by date
  const eventsByDate = {};
  events.forEach((ev) => {
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

  Object.values(eventsByDate).forEach((arr) =>
    arr.sort((a, b) => (a._startDate ? a._startDate - b._startDate : 0))
  );

  return (
    <div className="page">
      <EventFilter onFilter={setFilter} />

      <h1 className="h1">Calendar</h1>

      <div className="calendar-container">
        <div className="headerBar">
          <div className="left">
            <button
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
              }
              className="arrow"
            >
              ←
            </button>
            <span className="monthLabel">
              {month.toLocaleString("en", { month: "long", year: "numeric" })}
            </span>
          </div>
          <button
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
            }
            className="arrow"
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
    </div>
  );
}
