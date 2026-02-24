import React, { useMemo } from "react";
import CalendarButton from "../Components/CalendarButton";
import "../css/Calendar.css";

function buildGrid(current) {
  const first = new Date(current.getFullYear(), current.getMonth(), 1);
  const mondayOffset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
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
  eventsByDate,
  onEventClick,
}) {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const grid = useMemo(() => buildGrid(month), [month]);

  return (
    <div className="calendar-container">
      <div className="headerBar">
        <CalendarButton
          ariaLabel="Previous Month"
          onClick={() => onMonthChange(addMonth(month, -1))}
        >
          ←
        </CalendarButton>

        <span className="monthLabel">
          {month.toLocaleString("en", { month: "long", year: "numeric" })}
        </span>

        <CalendarButton
          ariaLabel="Next Month"
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
          const dayEvents = eventsByDate?.[key] || [];
          const out = date.getMonth() !== month.getMonth();

          return (
            <div key={key} className={`cell ${out ? "out" : ""}`}>
              <div className="day">{date.getDate()}</div>

              <div className="pills">
                {dayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className={`pill ${getColor(ev.category)}`}
                    onClick={() => onEventClick(ev)}
                    title={ev.title}
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
