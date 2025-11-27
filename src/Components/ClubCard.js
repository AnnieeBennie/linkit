import React, { useState } from "react";
import "../css/Clubs.css";
import ClubDetails from "./ClubDetails";
import ClubSuccess from "./ClubSuccess";

function ClubCard({ club, onToggleJoin, readOnly = false }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleJoin = () => {
    if (onToggleJoin) onToggleJoin(club.id);
    setShowSuccess(true);
  };

  return (
    <>
      <div className="club-card" onClick={() => setShowDetails(true)}>
        <img src={club.image} alt={club.name} className="club-image" />

        <div className="club-info">
          <p className="club-category">{club.category}</p>
          <h2 className="club-title">{club.name}</h2>

          {/* SHORT DESCRIPTION */}
          {club.description && (
            <p className="club-short-description">
              {club.description.length > 80
                ? club.description.substring(0, 80) + "..."
                : club.description}
            </p>
          )}

          {!readOnly && (
            <button
              className={club.joined ? "leave-btn" : "join-btn"}
              onClick={(e) => {
                e.stopPropagation();
                handleJoin();
              }}
            >
              {club.joined ? "Leave" : "Join"}
            </button>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="details-overlay" onClick={() => setShowDetails(false)}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <ClubDetails
              club={club}
              onClose={() => setShowDetails(false)}
              onJoin={handleJoin}
            />
          </div>
        </div>
      )}

      {showSuccess && (
        <div
          className="details-success-overlay"
          onClick={() => setShowSuccess(false)}
        >
          <div
            className="details-success-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <ClubSuccess onClose={() => setShowSuccess(false)} />
          </div>
        </div>
      )}
    </>
  );
}

export default ClubCard;
