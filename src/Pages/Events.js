import React, { useEffect, useState } from "react";
import "../css/Events.css";
import EventCard from "../Components/EventCard";
import EventFilter from "../Components/EventFilter";
import { fetchEvents } from "../services/eventService";
import { getRegisteredEventIdsForCurrentUser } from "../services/eventSignupService";

function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState(null);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Load + Sort Events ---
  useEffect(() => {
    fetchEvents()
      .then((data) => {
        setEvents(
          data.sort((a, b) => {
            const ta = a._startDate || Infinity;
            const tb = b._startDate || Infinity;
            return ta - tb;
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // --- Load registered event IDs when needed ---
  useEffect(() => {
    async function loadRegistered() {
      if (filter !== "Registered Events") {
        setRegisteredIds([]);
        return;
      }

      try {
        const ids = await getRegisteredEventIdsForCurrentUser();
        setRegisteredIds(ids);
      } catch {
        setRegisteredIds([]);
      }
    }

    loadRegistered();

    // refresh when login/logout happens
    const handler = () => loadRegistered();
    window.addEventListener("auth-change", handler);

    return () => window.removeEventListener("auth-change", handler);
  }, [filter]);

  // --- Apply Filter ---
  const filteredEvents = filter
    ? filter === "Registered Events"
      ? events.filter((e) => registeredIds.includes(e.id))
      : events.filter((e) => e.category === filter)
    : events;

  if (loading) return <div className="PageTitle">Loading events…</div>;
  if (error) return <div className="PageTitle">Failed to load events</div>;

  return (
    <div className="events-container">
      <EventFilter onFilter={setFilter} />

      <div className="PageTitle">Upcoming Events</div>

      {filteredEvents.length > 0 ? (
        <div className="events-grid">
          {filteredEvents.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      ) : (
        <div className="no-results">No matches for your filter</div>
      )}
    </div>
  );
}

export default Events;
