import React, { useState } from "react";
import "../css/EventCard.css";
import EventDetails from "./EventDetails";
import Success from "./Success";

function EventCard({ event }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <>
      <div className="event-card">
        {event.image ? (
          <img src={event.image} alt={event.title} className="event-image" />
        ) : (
          <div className="event-image placeholder" aria-hidden="true" />
        )}
        <div className="event-container">
          <h3 className="event-title">{event.title}</h3>
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
            <EventDetails
              event={event}
              onClose={() => setShowDetails(false)}
              onSignup={() => setShowSuccess(true)}
            />
          </div>
        </div>
      )}

      {showSuccess && (
        <div
          className="details-success-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowSuccess(false)}
        >
          <div
            className="details-success-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <Success onClose={() => setShowSuccess(false)} />
          </div>
        </div>
      )}
    </>
  );
}

export default EventCard;
