import React from "react";
import "../css/ClubDetails.css";
import CloseIcon from "../Icons/close.svg";

function ClubDetails({ club, onClose, onJoin }) {
  function handleJoin() {
    if (onClose) onClose();
    if (onJoin) onJoin();
  }

  return (
    <div className="details-container">
      <button
        className="details-close"
        onClick={onClose}
        aria-label="Close club details"
      >
        <img src={CloseIcon} alt="close" />
      </button>

      <div className="details-inner">

        {/* LEFT SIDE */}
        <div className="details-left">
          <h2 className="title">{club.name}</h2>

          <div className="info-row">
            <p className="club-category">{club.category}</p>
          </div>

          <p className="description">{club.description}</p>

          <div className="actions">
            <button className="signup-details-button" onClick={handleJoin}>
              Join Club
            </button>
            <button className="group-chat">Group Chat</button>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="details-right">
          {club.image ? (
            <img src={club.image} alt={club.name} className="event-image" />
          ) : (
            <div className="event-image placeholder" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}

export default ClubDetails;
