import React, { useState, useEffect } from "react";
import "../css/Calendar.css";
import { fetchEvents } from "../services/eventService";
import { getRegisteredEventIdsForCurrentUser } from "../services/eventSignupService";
import EventFilter from "../Components/EventFilter";
import EventDetails from "../Components/EventDetails";
import CalendarView from "../Components/CalendarView";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [filter, setFilter] = useState(null);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date());
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    fetchEvents()
      .then((data) => setEvents(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) return <div className="page">Loading events...</div>;
  if (error) return <div className="page">Could not load events</div>;

  return (
    <div className="page">
      <EventFilter onFilter={setFilter} />
      <h1 className="h1">Calendar</h1>

      <CalendarView
        month={month}
        onMonthChange={setMonth}
        events={events}
        filter={filter}
        registeredIds={registeredIds}
        onEventClick={(ev) => {
          setSelectedEvent(ev);
          setShowDetails(true);
        }}
      />

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
