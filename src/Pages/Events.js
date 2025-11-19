import React, { useEffect, useState } from "react";
import "../css/Events.css";
import EventCard from "../Components/EventCard";
import EventFilter from "../Components/EventFilter";
import { fetchEvents } from "../services/eventService";

function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filteredEvents = filter
    ? events.filter((e) => e.category === filter)
    : events;

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const data = await fetchEvents();
        if (!mounted) return;
        setEvents(data);
        setLoading(false);
      } catch (err) {
        if (!mounted) return;
        setError(err);
        setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, []);

  if (loading) return <div className="PageTitle">Loading events…</div>;
  if (error) return <div className="PageTitle">Failed to load events</div>;

  return (
    <div className="events-container">
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
    </div>
  );
}

export default Events;
