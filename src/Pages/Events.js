import React from "react";
import "../css/Events.css";
import EventCard from "../Components/EventCard";
import EventFilter from "../Components/EventFilter";
import "../css/EventCard.css";
import "../css/EventFilter.css";
import padelImage from "../Images/Padel.png";
import scrollBarImage from "../Images/scrollBar.png";
import boardgamesImage from "../Images/Boardgame.png";
import bookImage from "../Images/Books.png";
import knitingImage from "../Images/Knitting.png";
import quizImage from "../Images/Quiz.png";
import footballImage from "../Images/Football.png";
import designImage from "../Images/Design.png";

function Events() {
  const events = [
    {
      title: "Padel game",
      category: "Sports & Fitness",
      organizer: "ITU Padel",
      date: "10/10/25 | 14:45 - 16:00",
      location: "Raffinaderivej 20, 2300 København",
      image: padelImage,
    },
    {
      title: "Scroll Bar Party",
      category: "Party",
      organizer: "Scroll Bar",
      date: "10/10/25 | 18:00 - 23:00",
      location: "ITU Scroll bar",
      image: scrollBarImage,
    },
    {
      title: "Boardgames night",
      category: "Hobbies & Lifestyle",
      organizer: "ConnectIT",
      date: "13/10/25 | 17:00 - 20:00",
      location: "Aud. 3A52",
      image: boardgamesImage,
    },
    {
      title: "Book Club night",
      category: "Arts & Culture",
      organizer: "BookIT",
      date: "14/10/25 | 18:00 - 21:00",
      location: "Aud. 2A14",
      image: bookImage,
    },
    {
      title: "Knitting Together",
      category: "Hobbies & Lifestyle",
      organizer: "KnitIT",
      date: "15/10/25 | 15:00 - 18:00",
      location: "Aud. 3A14",
      image: knitingImage,
    },
    {
      title: "Quiz Night",
      category: "Hobbies & Lifestyle",
      organizer: "Analog & Node",
      date: "15/10/25 | 16:00 - 20:00",
      location: "Analog cafe",
      image: quizImage,
    },
    {
      title: "Football Training",
      category: "Sports & Fitness",
      organizer: "ITU Active",
      date: "15/10/25 | 18:00 - 20:00",
      location: "Raffinaderivej 20, 2300 København",
      image: footballImage,
    },
    {
      title: "Design event",
      category: "Arts & Culture",
      organizer: "DAK",
      date: "16/10/25 | 15:00 - 16:00",
      location: "Aud. 2A52",
      image: designImage,
    },
  ];

  return (
    <div className="events-Container">
      <EventFilter events={events}>
        {(filteredEvents) => (
          <>
            <div className="PageTitle">Upcoming Events</div>
            <div className="events-grid">
              {filteredEvents.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </div>
          </>
        )}
      </EventFilter>
    </div>
  );
}

export default Events;
