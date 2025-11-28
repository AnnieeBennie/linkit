import React, { useEffect, useState } from "react";
import "../css/Events.css";
import EventCard from "../Components/EventCard";
import EventFilter from "../Components/EventFilter";
import { fetchEvents } from "../services/eventService";
import { getRegisteredEventIdsForCurrentUser } from "../services/eventSignupService";

function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registeredIds, setRegisteredIds] = useState([]);

  const filteredEvents = filter
    ? filter === "Registered Events"
      ? events.filter((e) => registeredIds.includes(e.id))
      : events.filter((e) => e.category === filter)
    : events;

  useEffect(() => {
    setLoading(true);
    fetchEvents()
      .then((data) => {
        // sort events by start date, earliest first
        const sortedEvents = data.sort((a, b) => {
          if (!a._startDate) return 1;
          if (!b._startDate) return -1;

          return a._startDate - b._startDate;
        });

        setEvents(sortedEvents);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // When the Registered Events filter is selected, load the current user's registered event ids.
  useEffect(() => {
    let mounted = true;

    async function load() {
      if (filter !== "Registered Events") {
        if (mounted) setRegisteredIds([]);
        return;
      }

      try {
        const ids = await getRegisteredEventIdsForCurrentUser();
        if (mounted) setRegisteredIds(ids);
      } catch (err) {
        console.warn("Events: failed to load registered ids", err);
        if (mounted) setRegisteredIds([]);
      }
    }

    load();

    function onAuthChange() {
      // refresh when auth changes
      load();
    }

    window.addEventListener("auth-change", onAuthChange);
    return () => {
      mounted = false;
      window.removeEventListener("auth-change", onAuthChange);
    };
  }, [filter]);

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
