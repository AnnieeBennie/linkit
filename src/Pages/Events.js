import React, { useEffect, useState } from "react";
import "../css/Events.css";
import EventCard from "../Components/EventCard";
import EventFilter from "../Components/EventFilter";
import { fetchEvents } from "../services/eventService";
import { getRegisteredEventIdsForCurrentUser } from "../services/eventSignupService";

// Helper Functions
function sortEventsByDate(events) {
  return [...events].sort((a, b) => {
    const ta = a._startDate || Infinity;
    const tb = b._startDate || Infinity;
    return ta - tb;
  });
}

function filterEventsByCategory(events, filter, registeredIds) {
  if (!filter) return events;

  if (filter === "Registered Events") {
    return events.filter((e) => registeredIds.includes(e.id));
  }

  return events.filter((e) => e.category === filter);
}

function setupAuthChangeListener(callback) {
  window.addEventListener("auth-change", callback);
  return () => window.removeEventListener("auth-change", callback);
}

// Main Component
function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState(null);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents()
      .then((data) => {
        setEvents(sortEventsByDate(data));
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

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
    return setupAuthChangeListener(loadRegistered);
  }, [filter]);

  // Apply filtering
  const filteredEvents = filterEventsByCategory(events, filter, registeredIds);

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
