import React, { useEffect, useState } from "react";
import "../css/EventCard.css";
import EventDetails from "./EventDetails";
import Success from "./Success";
import { getRegistrationForEvent } from "../services/eventSignupService";

function EventCard({ event, joined, onRegistrationChange }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMode, setSuccessMode] = useState("signup"); // "signup" / "leave"

  const [internalJoined, setInternalJoined] = useState(false);
  const [loadingReg, setLoadingReg] = useState(false);

  const isControlled = typeof joined === "boolean";
  const isJoined = isControlled ? joined : internalJoined;

  useEffect(() => {
    if (isControlled) return;

    let cancelled = false;

    async function checkRegistration() {
      try {
        setLoadingReg(true);
        const reg = await getRegistrationForEvent(event.id);
        if (!cancelled) {
          setInternalJoined(!!reg);
        }
      } finally {
        if (!cancelled) {
          setLoadingReg(false);
        }
      }
    }

    checkRegistration();
    return () => {
      cancelled = true;
    };
  }, [event.id, isControlled]);

  useEffect(() => {
    if (isControlled) return;

    const handler = async () => {
      const reg = await getRegistrationForEvent(event.id);
      setInternalJoined(!!reg);
    };

    window.addEventListener("auth-change", handler);
    return () => window.removeEventListener("auth-change", handler);
  }, [event.id, isControlled]);

  // When signup inside popup succeeds
  const handleSignupFromDetails = () => {
    if (!isControlled) {
      // Events page: keep local state in sync
      setInternalJoined(true);
    }
    // Close details and show success
    setShowDetails(false);
    setSuccessMode("signup");
    setShowSuccess(true);
  };

  // When leave inside the popup succeeds
  const handleLeaveFromDetails = () => {
    if (!isControlled) {
      setInternalJoined(false);
    }
    setShowDetails(false);
    setSuccessMode("leave");
    setShowSuccess(true);
  };

  // When user closes the Success modal
  const handleSuccessClose = () => {
    setShowSuccess(false);

    if (isControlled && onRegistrationChange) {
      if (successMode === "signup") {
        onRegistrationChange("signup", event.id);
      } else if (successMode === "leave") {
        onRegistrationChange("leave", event.id);
      }
    }
  };

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
            className={isJoined ? "leave-button" : "signup-button"}
            aria-expanded={showDetails}
            disabled={!isControlled && loadingReg}
          >
            {isJoined ? "Leave" : "Sign Up"}
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
              // EventDetails uses DB to know if you're registered + updates counter.
              onClose={() => setShowDetails(false)}
              onSignup={handleSignupFromDetails}
              onUnsignup={handleLeaveFromDetails}
            />
          </div>
        </div>
      )}

      {showSuccess && (
        <div
          className="details-success-overlay"
          role="dialog"
          aria-modal="true"
          onClick={handleSuccessClose}
        >
          <div
            className="details-success-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <Success onClose={handleSuccessClose} mode={successMode} />
          </div>
        </div>
      )}
    </>
  );
}

export default EventCard;
