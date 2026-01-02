import React, { useState } from "react";
import "../css/ClubDetails.css";
import CloseIcon from "../Icons/close.svg";

import Parse from "../services/parse";
import Login from "./Login";
import "../css/AuthModal.css";

function ClubDetails({ club, onClose, onJoin, isJoined }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  function handleJoin() {
    // If not logged in: show prompt, do NOT close details
    if (!Parse.User.current()) {
      setShowLoginPrompt(true);
      return;
    }

    // Logged in: proceed as before
    if (onJoin) onJoin();
    if (onClose) onClose();
  }

  return (
    <>
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
                {isJoined ? "Leave" : "Join"}
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

      {/* Existing Login popup */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setShowLogin(false);
            setShowLoginPrompt(false);
            handleJoin();
          }}
        />
      )}

      {/* Login required prompt */}
      {showLoginPrompt && (
        <div
          className="auth-overlay login-prompt-overlay"
          role="dialog"
          aria-modal="true"
        >
          <div className="auth-modal login-prompt-modal">
            <h2 className="please-log-in-title">Please log in</h2>
            <p className="hint">Log in to continue</p>

            <div className="auth-actions">
              <button
                className="auth-submit"
                onClick={() => {
                  setShowLoginPrompt(false);
                  setShowLogin(true);
                }}
              >
                Log in
              </button>

              <button
                className="auth-close secondary"
                onClick={() => setShowLoginPrompt(false)}
              >
                <img src={CloseIcon} alt="close" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ClubDetails;
