import React from "react";
import "../css/EventCard.css";

function EventCard({ event }) {
  return (
    <div className="event-card">
      <img src={event.image} alt={event.title} className="event-image"></img>
      <div className="event-container">
        <h3>{event.title}</h3>
        <p className="event-org">{event.organizer}</p>
        <p className="event-date">{event.date}</p>
        <p className="event-location" title={event.location}>
          {event.location}
        </p>
        <button className="signup-button">Sign Up</button>
      </div>
    </div>
  );
}

export default EventCard;
