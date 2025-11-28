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
import { downloadICS } from "../services/calendarExport";

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
  }, []);
  // Load whether user is registered
  useEffect(() => {
    async function load() {
      setLoadingReg(true);
      const reg = await getRegistrationForEvent(event.id);
      setRegistered(!!reg);
      setLoadingReg(false);
    }
    load();
  }, [event.id]);

  // Refresh when login state changes
  useEffect(() => {
    function refresh() {
      // just re-check
      getRegistrationForEvent(event.id).then((res) => setRegistered(!!res));
    }

    window.addEventListener("auth-change", refresh);
    return () => window.removeEventListener("auth-change", refresh);
  }, [event.id]);

  async function handleSignup() {
    try {
      await registerForEvent(event.id);
      setRegistered(true);

      setAttendeeCount((prev) => (typeof prev === "number" ? prev + 1 : prev));
      onSignup?.();
      onClose?.();
      if (onSignup) onSignup();
      if (onClose) onClose();
    } catch (err) {
      const msg = err?.message || "";
      if (msg.toLowerCase().includes("not logged")) {
        setShowLogin(true);
        return;
      }
      console.error(err);
    }
  }

  async function handleLeave() {
    const ok = await unregisterForEvent(event.id);

    if (ok) {
      setRegistered(false);

      setAttendeeCount((prev) =>
        typeof prev === "number" ? Math.max(0, prev - 1) : prev
      );
      onUnsignup?.();
      if (onUnsignup) onUnsignup();
    }

    if (onClose) onClose();
  }

  // After login → try again
  function handleLoginSuccess() {
    setShowLogin(false);
    handleSignup();
  }

  function renderAttendeeText() {
    if (attendeeCount === null) return null;
    if (attendeeCount === 0) return "Be the first to join";
    if (attendeeCount === 1) return "1 person is going";
    return `${attendeeCount} people are going`;
  }
  // Handle .ics export
  function addToCalendar() {
    try {
      const start =
        event._startDate instanceof Date && !isNaN(event._startDate)
          ? event._startDate
          : event.date
          ? new Date(event.date)
          : new Date();

      const end =
        event._endDate instanceof Date && !isNaN(event._endDate)
          ? event._endDate
          : new Date(start.getTime() + 60 * 60 * 1000);

      downloadICS({
        title: event.title,
        description: event.description,
        location: event.location,
        start,
        end,
      });
    } catch (err) {
      console.error(err);
      alert("Couldn't create calendar file.");
    }
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
            <img src={TicketIcon} className="icon" alt="" />
            <p>{event.organizer}</p>
          </div>

          <div className="info-row">
            <img src={TimeIcon} className="icon" alt="" />
            <p>{event.date}</p>
          </div>

          <div className="info-row">
            <img src={LocationIcon} className="icon" alt="" />
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

            <button className="add-to-my-calendar" onClick={addToCalendar}>
              Add to my calendar
            </button>

            <button className="group-chat">Group Chat</button>
          </div>
        </div>

        <div className="details-right">
          {event.image ? (
            <img src={event.image} className="event-image" alt={event.title} />
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
