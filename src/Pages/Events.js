import React, { useEffect, useState } from "react";
import "../css/Events.css";
import EventCard from "../Components/EventCard";
import EventFilter from "../Components/EventFilter";
import "../css/EventCard.css";
import "../css/EventFilter.css";
import { fetchEvents } from "../services/eventService";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(null);

  const filteredEvents = filter
    ? events.filter((e) => e.category === filter)
    : events;

  useEffect(() => {
    let mounted = true;

    async function loadEvents() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchEvents();
        if (!mounted) return;
        const mapped = data.map((e) => ({ ...e, image: e.image || undefined }));
        setEvents(mapped);
        setLoading(false);
      } catch (err) {
        console.error("loadEvents error", err);
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="events-container">
      {loading ? (
        <div className="PageTitle">Loading events…</div>
      ) : error ? (
        <div className="PageTitle">Failed to load events</div>
      ) : (
        <>
          <EventFilter onFilter={setFilter} />

          <div className="PageTitle">Upcoming Events</div>

          {filteredEvents.length > 0 ? (
            <div className="events-grid">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="no-results">No matches for your filter</div>
          )}
        </>
      )}
    </div>
  );
}

export default Events;
