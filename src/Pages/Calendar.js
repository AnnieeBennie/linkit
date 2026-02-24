import React, { useEffect, useMemo, useState } from "react";
import "../css/Calendar.css";
import { fetchEvents } from "../services/eventService";
import { getRegisteredEventIdsForCurrentUser } from "../services/eventSignupService";
import EventFilter from "../Components/EventFilter";
import EventDetails from "../Components/EventDetails";
import CalendarView from "../Components/CalendarView";

const toDateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

function getStartDate(ev) {
  const value = ev._startDate ?? ev.date;
  if (!value) return null;

  const startDate = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(startDate.getTime())) return null;
  return startDate;
}

function makeEventsByDate(events, filter, registeredIds) {
  const map = {};

  (events || []).forEach((ev) => {
    if (filter === "Registered Events" && !registeredIds?.includes(ev.id))
      return;
    if (filter && filter !== "Registered Events" && ev.category !== filter)
      return;

    const start = getStartDate(ev);
    if (!start) return;

    const key = toDateKey(start);
    (map[key] ||= []).push({ ...ev, _startDate: start });
  });

  Object.values(map).forEach((arr) =>
    arr.sort((a, b) => a._startDate - b._startDate)
  );
  return map;
}

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [filter, setFilter] = useState(null);

  const [month, setMonth] = useState(new Date());
  const [activeEvent, setActiveEvent] = useState(null); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const eventsByDate = useMemo(
    () => makeEventsByDate(events, filter, registeredIds),
    [events, filter, registeredIds]
  );

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const data = await fetchEvents();
        setEvents(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  useEffect(() => {
    async function loadRegisteredIds() {
      if (filter !== "Registered Events") return;

      try {
        const ids = await getRegisteredEventIdsForCurrentUser();
        setRegisteredIds(ids || []);
      } catch (err) {
        console.warn("Could not load registered ids", err);
        setRegisteredIds([]);
      }
    }
    loadRegisteredIds();
  }, [filter]);

  async function reloadRegisteredIdsIfNeeded() {
    if (filter !== "Registered Events") return;

    try {
      const ids = await getRegisteredEventIdsForCurrentUser();
      setRegisteredIds(ids || []);
    } catch (err) {
      console.warn("Could not reload registered ids", err);
      setRegisteredIds([]);
    }
  }

  if (loading) return <div className="page">Loading events...</div>;
  if (error) return <div className="page">Could not load events</div>;

  return (
    <div className="page">
      <EventFilter onFilter={setFilter} />
      <h1 className="h1">Calendar</h1>

      <CalendarView
        month={month}
        onMonthChange={setMonth}
        eventsByDate={eventsByDate}
        onEventClick={setActiveEvent}
      />

      {activeEvent && (
        <div
          className="details-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveEvent(null)} 
        >
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <EventDetails
              event={activeEvent}
              onClose={() => setActiveEvent(null)}
              onSignup={reloadRegisteredIdsIfNeeded}
              onUnsignup={reloadRegisteredIdsIfNeeded}
            />
          </div>
        </div>
      )}
    </div>
  );
}
