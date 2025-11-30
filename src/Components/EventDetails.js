import React, { useEffect, useState, useCallback } from "react";
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

  // how many people are going
  const [attendeeCount, setAttendeeCount] = useState(null);

  // Load: am I registered + how many attendees
  const checkRegistrationAndCount = useCallback(async () => {
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
  }, [event.id]);

  useEffect(() => {
    checkRegistrationAndCount();
  }, [checkRegistrationAndCount]);

  useEffect(() => {
    const handler = () => checkRegistrationAndCount();
    window.addEventListener("auth-change", handler);
    return () => window.removeEventListener("auth-change", handler);
  }, [checkRegistrationAndCount]);

  async function handleSignup() {
    try {
      setLoadingReg(true);
      await registerForEvent(event.id);
      setRegistered(true);

      setAttendeeCount((prev) => (typeof prev === "number" ? prev + 1 : prev));

      if (onSignup) onSignup();
      if (onClose) onClose();
    } catch (err) {
      const msg = err?.message || "";
      if (msg.toLowerCase().includes("not logged")) {
        setShowLogin(true);
        return;
      }
      console.error(err);
    } finally {
      setLoadingReg(false);
    }
  }

  async function handleLeave() {
    try {
      setLoadingReg(true);
      const ok = await unregisterForEvent(event.id);
      if (ok) {
        setRegistered(false);
        setAttendeeCount((prev) =>
          typeof prev === "number" ? Math.max(0, prev - 1) : prev
        );
        if (onUnsignup) onUnsignup();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReg(false);
    }
  }

  function handleLoginSuccess() {
    setShowLogin(false);
    handleSignup();
  }

  // Counter text
  function renderAttendeeText() {
    if (attendeeCount === null) return null;
    if (attendeeCount === 0) return "Be the first to join";
    if (attendeeCount === 1) return "1 person is going";
    return `${attendeeCount} people are going`;
  }

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
