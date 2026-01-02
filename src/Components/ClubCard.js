import React, { useState } from "react";
import "../css/Clubs.css";
import ClubDetails from "./ClubDetails";

function ClubCard({
  club,
  onToggleJoin,
  isJoined,
  readOnly = false,
  loading = false,
  onSuccess = () => {},
}) {
  const [showDetails, setShowDetails] = useState(false);

  const handleJoin = () => {
    const wasJoined = isJoined;
    onToggleJoin(club.id);
    onSuccess(wasJoined ? "leave" : "join");
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
              className="join-btn"
              onClick={(e) => {
                e.stopPropagation(); // prevent opening details
                // Route through details modal so login guard + success modal stay consistent
                setShowDetails(true);
              }}
              disabled={loading}
            >
              {isJoined ? "Leave" : "Join"}
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
              isJoined={isJoined}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ClubCard;
