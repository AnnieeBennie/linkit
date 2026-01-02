import React, { useMemo } from "react";
import "../css/Calendar.css";
import CalendarButton from "../Components/CalendarButton";

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

function addMonth(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

const toDateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const getColor = (cat = "") => {
  const c = String(cat).toLowerCase();

  if (c.includes("sport") || c.includes("fitness")) return "green";
  if (c.includes("party")) return "orange";
  if (c.includes("arts") || c.includes("culture")) return "blue";
  if (c.includes("hobbies") || c.includes("lifestyle")) return "purple";

  return "gray";
};

export default function CalendarView({
  month,
  onMonthChange,
  events,
  filter,
  registeredIds,
  onEventClick,
  onFilterChange,
}) {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const grid = useMemo(() => buildGrid(month), [month]);

  const eventsByDate = useMemo(() => {
    const map = {};

    (events || []).forEach((ev) => {
      if (filter) {
        if (filter === "Registered Events") {
          if (!registeredIds?.includes(ev.id)) return;
        } else {
          if (ev.category !== filter) return;
        }
      }

      const start =
        ev._startDate instanceof Date
          ? ev._startDate
          : ev._startDate
          ? new Date(ev._startDate)
          : ev.date
          ? new Date(ev.date)
          : null;

      if (!start || Number.isNaN(start.getTime())) return;

      const key = toDateKey(start);

      if (!map[key]) map[key] = [];

      map[key].push({ ...ev, _startDate: start });
    });

    Object.values(map).forEach((arr) =>
      arr.sort((a, b) => a._startDate - b._startDate)
    );
    return map;
  }, [events, filter, registeredIds]);

  return (
    <div className="calendar-container">
      {onFilterChange && (
        <div className="chips">
          <span
            className={`chip ${filter === null ? "active" : ""}`}
            onClick={() => onFilterChange(null)}
          >
            All
          </span>

          <span
            className={`chip ${filter === "Arts & Culture" ? "active" : ""}`}
            onClick={() => onFilterChange("Arts & Culture")}
          >
            Arts &amp; Culture
          </span>

          <span
            className={`chip ${filter === "Sports & Fitness" ? "active" : ""}`}
            onClick={() => onFilterChange("Sports & Fitness")}
          >
            Sports &amp; Fitness
          </span>

          <span
            className={`chip ${
              filter === "Hobbies & Lifestyle" ? "active" : ""
            }`}
            onClick={() => onFilterChange("Hobbies & Lifestyle")}
          >
            Hobbies &amp; Lifestyle
          </span>

          <span
            className={`chip ${filter === "Party" ? "active" : ""}`}
            onClick={() => onFilterChange("Party")}
          >
            Party
          </span>

          <span
            className={`chip ${filter === "Registered Events" ? "active" : ""}`}
            onClick={() => onFilterChange("Registered Events")}
          >
            Registered Events
          </span>
        </div>
      )}

      <div className="headerBar">
        <div className="left">
          <CalendarButton
            ariaLabel="Previous Month"
            onClick={() => onMonthChange(addMonth(month, -1))}
          >
            ←
          </CalendarButton>

          <span className="monthLabel">
            {month.toLocaleString("en", { month: "long", year: "numeric" })}
          </span>
        </div>

        <CalendarButton
          ariaLabel="Next month"
          onClick={() => onMonthChange(addMonth(month, 1))}
        >
          →
        </CalendarButton>
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
                    onClick={() => onEventClick(ev)}
                  >
                    {ev._startDate
                      ? `${ev._startDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} - ${ev.title}`
                      : ev.title}
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
