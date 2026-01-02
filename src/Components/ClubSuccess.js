import React from "react";
import "../css/Success.css";
import CloseIcon from "../Icons/close.svg";
import { useNavigate } from "react-router-dom";

function ClubSuccess({ onClose }) {
  const navigate = useNavigate();

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
        <h1 className="title-success">Success!</h1>
        <h3 className="text">You successfully joined a club!</h3>
        <h3 className="text">Check out other clubs you might like.</h3>

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