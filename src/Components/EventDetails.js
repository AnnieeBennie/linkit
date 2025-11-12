import React, { useEffect, useState } from "react";
import "../css/EventDetails.css";
import TicketIcon from "../Icons/Ticket.svg";
import TimeIcon from "../Icons/Time Circle.svg";
import LocationIcon from "../Icons/Location.svg";

function eventDetails({ event }) {
  return (
    <div className="details-container">
      {event.image ? (
        <img src={event.image} alt={event.title} className="event-image" />
      ) : (
        <div className="event-image placeholder" aria-hidden="true" />
      )}
      <h2 className="Title">{event.title}</h2>
      <div>
        <img src={TicketIcon} alt="Organizer" className="icon"></img>
        <p className="event-org">{event.organizer}</p>
      </div>
      <div>
        <img src={TimeIcon} alt="Time" className="icon"></img>
        <p className="event-date">{event.date}</p>
      </div>
      <div>
        <img src={LocationIcon} alt="Location" className="icon"></img>
        <p className="event-location" title={event.location}>
          {event.location}
        </p>
      </div>

      <p className="description">{event.description}</p>
      <button className="signup-button">Sign Up</button>
      <button className="add-to-my-calendar">Add to my Calendar</button>
      <button className="group-chat">Group Chat</button>
    </div>
  );
}
