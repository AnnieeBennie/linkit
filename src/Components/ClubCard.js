import React, { useState } from "react";
import "../css/Clubs.css";
import ClubDetails from "./ClubDetails";

function ClubCard({
  club,
  onToggleJoin,
  isJoined,
  loading = false,
  onSuccess = () => {},
}) {
  const [showDetails, setShowDetails] = useState(false);

  // Handle join/leave action and open success popup
  const handleJoin = async () => {
    const wasJoined = isJoined;
    await onToggleJoin(club.id);
    onSuccess(wasJoined ? "leave" : "join");
  };

  return (
    <>
      {/* Club card */}
      <div className="club-card" onClick={() => setShowDetails(true)}>
        <img src={club.image} alt={club.name} className="club-image" />

        <div className="club-info">
          <p className="club-category">{club.category}</p>
          <h2 className="club-title">{club.name}</h2>

          {/* Description */}
          {club.description && (
            <p className="club-short-description">
              {club.description.length > 80
                ? club.description.substring(0, 80) + "..."
                : club.description}
            </p>
          )}

          {/* Join/Leave button */}
          <button
            className={isJoined ? "leave-btn" : "join-btn"}
            onClick={() => {
              setShowDetails(true);
            }}
            disabled={loading}
          >
            {isJoined ? "Leave" : "Join"}
          </button>
        </div>
      </div>

      {/* Details popup overlay with full club info and login */}
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
