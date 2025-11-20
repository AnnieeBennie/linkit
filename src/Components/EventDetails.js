import React, { useEffect, useState } from "react";
import "../css/EventDetails.css";
import TicketIcon from "../Icons/Ticket.svg";
import TimeIcon from "../Icons/Time Circle.svg";
import LocationIcon from "../Icons/Location.svg";
import CloseIcon from "../Icons/close.svg";

function EventDetails({ event, onClose }) {
  return (
    <div className="details-container">
      <button
        className="details-close"
        onClick={onClose}
        aria-label="Close event details"
      >
        <img src={CloseIcon} alt="close" />
      </button>

      <div className="details-inner">
        <div className="details-left">
          <h2 className="title">{event.title}</h2>

          <div className="info-row">
            <img src={TicketIcon} alt="Organizer" className="icon" />
            <p className="event-org">{event.organizer}</p>
          </div>

          <div className="info-row">
            <img src={TimeIcon} alt="Time" className="icon" />
            <p className="event-date">{event.date}</p>
          </div>

          <div className="info-row">
            <img src={LocationIcon} alt="Location" className="icon" />
            <p className="event-location" title={event.location}>
              {event.location}
            </p>
          </div>

          <p className="description">{event.description}</p>

          <div className="actions">
            <button className="signup-details-button">Sign Up</button>
            <button className="add-to-my-calendar">Add to my calendar</button>
            <button className="group-chat">Group Chat</button>
          </div>
        </div>

        <div className="details-right">
          {event.image ? (
            <img src={event.image} alt={event.title} className="event-image" />
          ) : (
            <div className="event-image placeholder" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
