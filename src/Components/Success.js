import React from "react";
import "../css/Success.css";
import CloseIcon from "../Icons/close.svg";
import { useNavigate } from "react-router-dom";

function Success({ onClose, mode = "signup" }) {
  const navigate = useNavigate();
  const isLeave = mode === "leave";

  const title = "Success!";
  const message = isLeave
    ? "You successfully left this event."
    : "You successfully signed up for a new event! We are waiting to see you soon!";

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

        <button
          className="see-other-events"
          onClick={() => {
            if (onClose) onClose();
            navigate("/events");
          }}
        >
          See other events
        </button>
      </div>
    </div>
  );
}

export default Success;
