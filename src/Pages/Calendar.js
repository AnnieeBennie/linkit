import React, { use, useMemo, useState } from "react";
import "../css/Calendar.css";

const Events = [
  { date: "2025-11-02", title: "Padel", color: "green" },
  { date: "2025-11-02", title: "Boardgames night", color: "blue" },
  { date: "2025-11-04", title: "Basketball game", color: "gray" },
  { date: "2025-11-05", title: "Boardgames night", color: "blue" },
  { date: "2025-11-06", title: "Boardgames night", color: "blue" },
  { date: "2025-11-09", title: "Padel", color: "green" },
  { date: "2025-11-12", title: "Knitting night", color: "blue" },
  { date: "2025-11-19", title: "Boardgames night", color: "blue" },
  { date: "2025-11-19", title: "Scroll Bar Party", color: "orange" },
  { date: "2025-11-20", title: "Padel", color: "green" },
  { date: "2025-11-23", title: "Padel", color: "green" },
  { date: "2025-11-28", title: "Boardgames night", color: "blue" },
];

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

function eventsOn(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const key = `${y}-${m}-${d}`;
  return Events.filter((e) => e.date === key);
}

export default function Calendar() {
  const [cursor, setCursor] = useState(new Date(2025, 10, 1));
  const label = cursor.toLocaleString("en", { month: "long", year: "numeric" });

  const grid = useMemo(() => buildGrid(cursor), [cursor]);
  const monthIndex = cursor.getMonth();
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
        {grid.map((date, i) => {
          const out = date.getMonth() !== monthIndex;
          const dayEvents = eventsOn(date);

          return (
            <div key={i} className={`cell ${out ? "out" : ""}`}>
              <div className="day">{date.getDate()}</div>
              <div className="pills">
                {eventsOn(date).map((ev, j) => (
                  <div key={j} className={`pill ${ev.color}`}>
                    {ev.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
