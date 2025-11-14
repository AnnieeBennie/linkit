import React from "react";
import "../css/Clubs.css";

function ClubCard({ club, onToggleJoin, readOnly = false }) {
  const handleClick = () => {
    if (readOnly || !onToggleJoin) return;
    onToggleJoin(club.id);
  };

  return (
    <div className="club-card">
      <img src={club.image} alt={club.name} className="club-image" />

      <div className="club-info">
        <p className="club-category">{club.category}</p>

        <h2 className="club-title">{club.name}</h2>

        {!readOnly && (
          <button
            className={club.joined ? "leave-btn" : "join-btn"}
            //onClick={() => onToggleJoin(club.id)}
            onClick={handleClick}
          >
            {club.joined ? "Leave" : "Sign Up"}
          </button>
        )}
      </div>
    </div>
  );
}

export default ClubCard;
