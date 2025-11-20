import React, { useState } from "react";
import "../css/EventCard.css";
import EventDetails from "./EventDetails";

function EventCard({ event }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div className="event-card">
        {event.image ? (
          <img src={event.image} alt={event.title} className="event-image" />
        ) : (
          <div className="event-image placeholder" aria-hidden="true" />
        )}
        <div className="event-container">
          <h3>{event.title}</h3>
          <p className="event-org">{event.organizer}</p>
          <p className="event-date">{event.date}</p>
          <p className="event-location" title={event.location}>
            {event.location}
          </p>
          <button
            onClick={() => setShowDetails(true)}
            className="signup-button"
            aria-expanded={showDetails}
          >
            Sign Up
          </button>
        </div>
      </div>

      {showDetails && (
        <div
          className="details-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowDetails(false)}
        >
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <EventDetails event={event} onClose={() => setShowDetails(false)} />
          </div>
        </div>
      )}
    </>
  );
}

export default EventCard;
