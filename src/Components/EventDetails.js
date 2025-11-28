import React, { useEffect, useState } from "react";
import "../css/EventDetails.css";
import TicketIcon from "../Icons/Ticket.svg";
import TimeIcon from "../Icons/Time Circle.svg";
import LocationIcon from "../Icons/Location.svg";
import CloseIcon from "../Icons/close.svg";

import {
  registerForEvent,
  getRegistrationForEvent,
  unregisterForEvent,
} from "../services/eventSignupService";
import Login from "./Login";

function EventDetails({ event, onClose, onSignup, onUnsignup }) {
  const [registered, setRegistered] = useState(false);
  const [loadingReg, setLoadingReg] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Small helper → avoids duplicated code
  async function checkRegistration() {
    setLoadingReg(true);
    const reg = await getRegistrationForEvent(event.id);
    setRegistered(!!reg);
    setLoadingReg(false);
  }

  // Check once on mount
  useEffect(() => {
    checkRegistration();
  }, [event.id]);

  // Re-check if auth changes
  useEffect(() => {
    const handler = () => checkRegistration();
    window.addEventListener("auth-change", handler);
    return () => window.removeEventListener("auth-change", handler);
  }, [event.id]);

  async function handleSignup() {
    try {
      await registerForEvent(event.id);
      setRegistered(true);
      onSignup?.();
      onClose?.();
    } catch (err) {
      const msg = err?.message || "";
      // If not logged in → ask user to log in
      if (/not logged in|must be logged in/i.test(msg)) {
        setShowLogin(true);
        return;
      }
      console.error(err);
    }
  }

  async function handleLeave() {
    const removed = await unregisterForEvent(event.id);
    if (removed) {
      setRegistered(false);
      onUnsignup?.();
    }
    onClose?.();
  }

  async function handleLoginSuccess() {
    setShowLogin(false);
    handleSignup(); // simply retry signup after login
  }

  return (
    <div className="details-container">
      <button className="details-close" onClick={onClose}>
        <img src={CloseIcon} alt="close" />
      </button>

      <div className="details-inner">
        <div className="details-left">
          <h2 className="title">{event.title}</h2>

          <div className="info-row">
            <img src={TicketIcon} alt="" className="icon" />
            <p>{event.organizer}</p>
          </div>

          <div className="info-row">
            <img src={TimeIcon} alt="" className="icon" />
            <p>{event.date}</p>
          </div>

          <div className="info-row">
            <img src={LocationIcon} alt="" className="icon" />
            <p title={event.location}>{event.location}</p>
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
            <div className="event-image placeholder" />
          )}
        </div>
      </div>

      {showLogin && <Login onSuccess={handleLoginSuccess} />}
    </div>
  );
}

export default EventDetails;
