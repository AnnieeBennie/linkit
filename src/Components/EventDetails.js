import React, { useEffect, useState } from "react";
import "../css/EventDetails.css";
import Parse from "../services/parse";

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
import SignUp from "./SignUp";
import { downloadICS } from "../services/calendarExport";

/* ---------------------- HELPER FUNCTIONS ---------------------- */

function generateGoingText(count) {
  if (count === 0) return "Be the first to join";
  if (count === 1) return "1 person is going";
  if (typeof count === "number") return `${count} people are going`;
  return "";
}

function validateEventDate(date) {
  return date instanceof Date && !isNaN(date);
}

function calculateEndDate(startDate, endDate) {
  if (validateEventDate(endDate)) {
    return endDate;
  }
  return new Date(startDate.getTime() + 60 * 60 * 1000);
}

/* ---------------------- COMPONENT ---------------------- */

function EventDetails({ event, onClose, onSignup, onUnsignup }) {
  const [registered, setRegistered] = useState(false);
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // 1) load registration + attendee count
  useEffect(() => {
    async function loadInfo() {
      setLoading(true);
      const reg = await getRegistrationForEvent(event.id);
      const c = await getRegistrationCountForEvent(event.id);
      setRegistered(!!reg);
      setCount(c);
      setLoading(false);
    }

    loadInfo();

    // refresh when login/logout happens
    window.addEventListener("auth-change", loadInfo);
    return () => window.removeEventListener("auth-change", loadInfo);
  }, [event.id]);

  // 2) sign up
  async function handleSignup() {
    if (!Parse.User.current()) {
      setShowLoginPrompt(true);
      return;
    }

    setLoading(true);
    await registerForEvent(event.id);
    setRegistered(true);
    setCount((c) => (typeof c === "number" ? c + 1 : c));
    setLoading(false);

    onSignup?.();
    onClose?.();
  }

  // 3) Leave event
  async function handleLeave() {
    setLoading(true);
    const ok = await unregisterForEvent(event.id);
    if (ok) {
      setRegistered(false);
      setCount((c) => (typeof c === "number" ? Math.max(0, c - 1) : c));
      onUnsignup?.();
    }
    setLoading(false);
    onClose?.();
  }

  // 3) Add to calendar
  function addToCalendar() {
    if (!validateEventDate(event._startDate)) {
      alert("Event date is not available.");
      return;
    }

    const start = event._startDate;
    const end = calculateEndDate(start, event._endDate);

    downloadICS({
      title: event.title,
      description: event.description,
      location: event.location,
      start,
      end,
    });
  }

  const goingText = generateGoingText(count);

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

          {goingText && <p className="going-counter">{goingText}</p>}

          <p className="description">{event.description}</p>

          <div className="actions">
            {registered ? (
              <button
                className="leave-details-button"
                onClick={handleLeave}
                disabled={loading}
              >
                Leave
              </button>
            ) : (
              <button
                className="signup-details-button"
                onClick={handleSignup}
                disabled={loading}
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

      {/* Login */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setShowLogin(false);
            setShowLoginPrompt(false);
            handleSignup();
          }}
          onShowRegister={() => {
            setShowLogin(false);
            setShowSignUp(true);
          }}
        />
      )}

      {/* Sign Up */}
      {showSignUp && (
        <SignUp
          onClose={() => setShowSignUp(false)}
          onSuccess={() => {
            setShowSignUp(false);
            setShowLoginPrompt(false);
            handleSignup();
          }}
        />
      )}

      {/* Prompt */}
      {showLoginPrompt && (
        <div
          className="auth-overlay login-prompt-overlay"
          role="dialog"
          aria-modal="true"
        >
          <div className="auth-modal login-prompt-modal">
            <h2 className="please-log-in-title">Please log in</h2>
            <p className="hint">Log in to continue</p>

            <div className="auth-actions">
              <button
                className="auth-submit"
                onClick={() => {
                  setShowLoginPrompt(false);
                  setShowLogin(true);
                }}
              >
                Log in
              </button>

              <button
                className="auth-close secondary"
                onClick={() => setShowLoginPrompt(false)}
              >
                <img src={CloseIcon} alt="close" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetails;
