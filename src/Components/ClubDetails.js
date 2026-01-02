import React, { useState } from "react";
import "../css/ClubDetails.css";
import CloseIcon from "../Icons/close.svg";

import Parse from "../services/parse";
import Login from "./Login";
import SignUp from "./SignUp";
import "../css/AuthModal.css";

function ClubDetails({ club, onClose, onJoin, isJoined }) {
  // Track which modal is open: null, "prompt", "login", or "signup"
  const [modalType, setModalType] = useState(null);

  // Check if user is logged in
  function handleJoin() {
    if (!Parse.User.current()) {
      setModalType("prompt");
      return;
    }
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
          {/* Left side: club info and join/leave button */}
          <div className="details-left2">
            <h2 className="title2">{club.name}</h2>

            <div className="info-row2">
              <p className="club-category">{club.category}</p>
            </div>

            <p className="description2">{club.description}</p>

            <div className="actions2">
              <button 
                className={isJoined ? "leave-details-button2" : "signup-details-button2"} 
                onClick={handleJoin}
              >
                {isJoined ? "Leave" : "Join"}
              </button>
              <button className="group-chat2">Group Chat</button>
            </div>
          </div>

          {/* Right side: club image */}
          <div className="details-right2">
            {club.image ? (
              <img src={club.image} alt={club.name} className="event-image2" />
            ) : (
              <div className="event-image placeholder" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>

      {/* Login */}
      {modalType === "login" && (
        <Login
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);
            handleJoin();
          }}
          onShowRegister={() => setModalType("signup")}
        />
      )}

      {/* Sign Up */}
      {modalType === "signup" && (
        <SignUp
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);
            handleJoin();
          }}
        />
      )}

      {/* Login required prompt */}
      {modalType === "prompt" && (
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
                onClick={() => setModalType("login")}
              >
                Log in
              </button>

              <button
                className="auth-close secondary"
                onClick={() => setModalType(null)}
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
