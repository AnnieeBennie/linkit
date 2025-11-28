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
  getRegistrationCountForEvent,
} from "../services/eventSignupService";
import Login from "./Login";

function EventDetails({ event, onClose, onSignup, onUnsignup }) {
  const [registered, setRegistered] = useState(false);
  const [loadingReg, setLoadingReg] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // NEW: how many people are going
  const [attendeeCount, setAttendeeCount] = useState(null);

  // Small helper toavoid duplicated code
  async function checkRegistrationAndCount() {
    try {
      setLoadingReg(true);
      const [reg, count] = await Promise.all([
        getRegistrationForEvent(event.id),
        getRegistrationCountForEvent(event.id),
      ]);
      setRegistered(!!reg);
      setAttendeeCount(count);
    } finally {
      setLoadingReg(false);
    }
  }

  useEffect(() => {
    checkRegistrationAndCount();
  }, [event.id]);

  // Re-check if authentication changes (login/logout elsewhere)
  useEffect(() => {
    const handler = () => checkRegistrationAndCount();
    window.addEventListener("auth-change", handler);
    return () => window.removeEventListener("auth-change", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id]);

  async function handleSignup() {
    try {
      await registerForEvent(event.id);
      setRegistered(true);

      setAttendeeCount((prev) => (typeof prev === "number" ? prev + 1 : prev));
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

      setAttendeeCount((prev) =>
        typeof prev === "number" ? Math.max(0, prev - 1) : prev
      );
      onUnsignup?.();
    }
    onClose?.();
  }

  async function handleLoginSuccess() {
    setShowLogin(false);
    handleSignup();
  }

  function renderAttendeeText() {
    if (attendeeCount === null) return null;
    if (attendeeCount === 0) return "Be the first to join";
    if (attendeeCount === 1) return "1 person is going";
    return `${attendeeCount} people are going`;
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

          {/* NEW: counter text */}
          {renderAttendeeText() && (
            <p className="going-counter">{renderAttendeeText()}</p>
          )}

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
