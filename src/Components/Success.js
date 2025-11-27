import React from "react";
import "../css/Success.css";
import CloseIcon from "../Icons/close.svg";
import { useNavigate } from "react-router-dom";

function Success({ onClose }) {
  const navigate = useNavigate();

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
        <h1 className="title-success">Success!</h1>
        <h3 className="text">You successfully signed up for a new event!</h3>
        <h3 className="text">We are waiting to see you soon!</h3>

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
