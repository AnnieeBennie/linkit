import React, { useState } from "react";
import "../css/Clubs.css";
import ClubDetails from "./ClubDetails";
import ClubSuccess from "./ClubSuccess";
import { joinClub, leaveClub } from "../services/membershipService";


function ClubCard({club, isJoined}) {
  const [showDetails, setShowDetails] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);

  // Handle join/leave 
  const handleJoin = async () => {
    if (isPending) return;

    setIsPending(true);

    try {
      if (isJoined) {
        await leaveClub(club.id);
        setShowSuccess("leave");
      } else {
        await joinClub(club.id);
        setShowSuccess("join");
      }
      
      window.dispatchEvent(new Event("club-status-changed"));
    } finally {
      setIsPending(false);
      setShowDetails(false);
    }
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
            disabled={isPending}
          >
            {isJoined ? "Leave" : "Join"}
          </button>
        </div>
      </div>

      {/* Details popup */}
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

      {/* Success modal */}
      {showSuccess && (
        <div className="details-success-overlay">
          <div
            className="details-success-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <ClubSuccess
              mode={showSuccess}
              onClose={() => setShowSuccess(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ClubCard;
