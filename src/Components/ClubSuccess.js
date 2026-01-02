import React from "react";
import "../css/Success.css";
import CloseIcon from "../Icons/close.svg";
import { useNavigate } from "react-router-dom";

function ClubSuccess({ onClose, mode = "join" }) {
  const navigate = useNavigate();
  const isLeave = mode === "leave";

  const title = isLeave ? "See you next time!" : "Success!";
  const message = isLeave
    ? "You've left this club. Come back anytime!"
    : "You successfully joined a club! Check out other clubs you might like.";

  return (
    <div className="details-container-success-card">
      <button
        className="details-success-close"
        onClick={onClose}
        aria-label="Close success message"
      >
        <img src={CloseIcon} alt="close" />
      </button>

      <div className="success-inner">
        <h1 className="title-success">{title}</h1>
        <h3 className="text">{message}</h3>

        <button
          className="see-other"
          onClick={() => {
            if (onClose) onClose();
            navigate("/clubs");
          }}
        >
          See more clubs
        </button>
      </div>
    </div>
  );
}

export default ClubSuccess;