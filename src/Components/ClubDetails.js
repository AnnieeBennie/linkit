import React from "react";
import "../css/ClubDetails.css";
import CloseIcon from "../Icons/close.svg";

function ClubDetails({ club, onClose, onJoin }) {
  function handleJoin() {
    if (onClose) onClose();
    if (onJoin) onJoin();
  }

  return (
    <div className="details-container2">
      <button
        className="details-close2"
        onClick={onClose}
        aria-label="Close club details"
      >
        <img src={CloseIcon} alt="close" />
      </button>

      <div className="details-inner2">

        {/* LEFT SIDE */}
        <div className="details-left2">
          <h2 className="title2">{club.name}</h2>

          <div className="info-row2">
            <p className="club-category">{club.category}</p>
          </div>

          <p className="description2">{club.description}</p>

          <div className="actions2">
            <button className="signup-details-button2" onClick={handleJoin}>
              Join Club
            </button>
            <button className="group-chat2">Group Chat</button>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="details-right2">
          {club.image ? (
            <img src={club.image} alt={club.name} className="event-image2" />
          ) : (
            <div className="event-image placeholder" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}

export default ClubDetails;
