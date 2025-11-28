import React, { useState, useEffect } from "react";
import "../css/EventCard.css";
import EventDetails from "./EventDetails";
import Success from "./Success";
import { getRegistrationForEvent } from "../services/eventSignupService";

function EventCard({ event }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [loadingReg, setLoadingReg] = useState(false);

  // Small helper so we don’t repeat code
  async function checkRegistration() {
    try {
      setLoadingReg(true);
      const reg = await getRegistrationForEvent(event.id);
      setRegistered(!!reg);
    } finally {
      setLoadingReg(false);
    }
  }

  // Run on mount
  useEffect(() => {
    checkRegistration();
  }, [event.id]);

  // Run again when login/logout happens elsewhere in the app
  useEffect(() => {
    const handler = () => checkRegistration();

    window.addEventListener("auth-change", handler);
    return () => window.removeEventListener("auth-change", handler);
  }, [event.id]);

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
            className={registered ? "leave-button" : "signup-button"}
            disabled={loadingReg}
          >
            {registered ? "Leave" : "Sign Up"}
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
              onSignup={() => {
                setRegistered(true);
                setShowSuccess(true);
              }}
              onUnsignup={() => setRegistered(false)}
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
