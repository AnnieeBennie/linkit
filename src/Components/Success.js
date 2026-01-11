import React from "react";
import "../css/Success.css";
import CloseIcon from "../Icons/close.svg";
import { useNavigate } from "react-router-dom";

/* ---------------------- HELPER FUNCTIONS ---------------------- */

function getSuccessContent(mode) {
  const isLeave = mode === "leave";
  return {
    title: isLeave ? "See you next time!" : "Success!",
    message: isLeave
      ? "You've left this event. Come back anytime!"
      : "You successfully signed up for a new event! We are waiting to see you soon!",
  };
}

/* ---------------------- COMPONENT ---------------------- */

function Success({ onClose, mode = "signup" }) {
  const navigate = useNavigate();
  const { title, message } = getSuccessContent(mode);

  function handleSeeOtherEvents() {
    onClose?.();
    navigate("/events");
  }

  return (
    <div className="details-container-success-card">
      <button
        className="details-success-close"
        onClick={onClose}
        aria-label="Close event details"
      >
        <img src={CloseIcon} alt="close" />
      </button>
      <div className="success-inner">
        <h1 className="title-success">{title}</h1>
        <h3 className="text">{message}</h3>

        <button className="see-other" onClick={handleSeeOtherEvents}>
          See other events
        </button>
      </div>
    </div>
  );
}

export default Success;
