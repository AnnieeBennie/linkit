import React, { useEffect, useState } from "react";
import "../css/EventDetails.css";
import TicketIcon from "../Icons/Ticket.svg";
import TimeIcon from "../Icons/Time Circle.svg";
import LocationIcon from "../Icons/Location.svg";
import CloseIcon from "../Icons/close.svg";

// navigation handled by parent when showing Success as a popup

import {
  registerForEvent,
  getRegistrationForEvent,
  unregisterForEvent,
} from "../services/eventSignupService";
import Login from "./Login";

function EventDetails({ event, onClose, onSignup, onUnsignup }) {
  // track whether the current user is registered for this event
  const [registered, setRegistered] = useState(false);
  const [loadingReg, setLoadingReg] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // simple check when component mounts: set registered state
    setLoadingReg(true);
    getRegistrationForEvent(event.id)
      .then((reg) => setRegistered(!!reg))
      .catch((err) => console.warn("EventDetails: check failed", err))
      .finally(() => setLoadingReg(false));
  }, [event.id]);

  // Re-check registration if auth changes (user logged in/out or switched account)
  useEffect(() => {
    function handleAuthChange() {
      setLoadingReg(true);
      getRegistrationForEvent(event.id)
        .then((reg) => setRegistered(!!reg))
        .catch((err) => console.warn("EventDetails: check failed", err))
        .finally(() => setLoadingReg(false));
    }

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, [event.id]);

  // When signup is pressed, attempt registration then notify parent via onSignup
  async function handleSignup() {
    try {
      await registerForEvent(event.id);
      setRegistered(true);
      if (onClose) onClose();
      if (onSignup) onSignup();
    } catch (err) {
      console.error("handleSignup failed", err);
      const msg = (err && err.message) || String(err);
      // If the error indicates the user must be logged in, open Login popup
      if (/must be logged in|not logged in|must be signed in/i.test(msg)) {
        setShowLogin(true);
        return;
      }
      // otherwise rethrow or surface
      throw err;
    }
  }

  async function handleLeave() {
    try {
      const deleted = await unregisterForEvent(event.id);
      if (deleted) {
        setRegistered(false);
        if (onUnsignup) onUnsignup();
      }
      if (onClose) onClose();
    } catch (err) {
      console.error("handleLeave failed", err);
      throw err;
    }
  }

  // Called after login succeeds: attempt registration again
  async function handleLoginSuccess(user) {
    try {
      setShowLogin(false);
      await registerForEvent(event.id);
      setRegistered(true);
      if (onClose) onClose();
      if (onSignup) onSignup();
    } catch (err) {
      console.error("handleLoginSuccess: registration after login failed", err);
      // show a simple alert for now
      alert(err?.message || "Registration failed after login");
    }
  }

  return (
    <div className="details-container">
      <button
        className="details-close"
        onClick={onClose}
        aria-label="Close event details"
      >
        <img src={CloseIcon} alt="close" />
      </button>

      <div className="details-inner">
        <div className="details-left">
          <h2 className="title">{event.title}</h2>

          <div className="info-row">
            <img src={TicketIcon} alt="Organizer" className="icon" />
            <p className="event-org">{event.organizer}</p>
          </div>

          <div className="info-row">
            <img src={TimeIcon} alt="Time" className="icon" />
            <p className="event-date">{event.date}</p>
          </div>

          <div className="info-row">
            <img src={LocationIcon} alt="Location" className="icon" />
            <p className="event-location" title={event.location}>
              {event.location}
            </p>
          </div>

          <p className="description">{event.description}</p>

          <div className="actions">
            {registered ? (
              <button
                className="leave-details-button"
                onClick={handleLeave}
                disabled={loadingReg}
              >
                Leave
              </button>
            ) : (
              <button
                className="signup-details-button"
                onClick={handleSignup}
                disabled={loadingReg}
              >
                Sign Up
              </button>
            )}
            <button className="add-to-my-calendar">Add to my calendar</button>
            <button className="group-chat">Group Chat</button>
          </div>
        </div>

        <div className="details-right">
          {event.image ? (
            <img src={event.image} alt={event.title} className="event-image" />
          ) : (
            <div className="event-image placeholder" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
