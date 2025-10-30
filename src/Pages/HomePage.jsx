import React from "react";
import "../css/Home.css";
import { RECENT_EVENTS, YOUR_CLUBS } from "../mock/events";

/*Creating categories shown in lightblue bar*/
const EVENT_CATEGORIES = [
  "Arts & Culture",
  "Sports & Fitness",
  "Hobbies & Lifestyle",
  "Party",
];
const CLUB_CATEGORIES = [
  "Arts & Culture",
  "Sports & Fitness",
  "Hobbies & Lifestyle",
];

/*Creating the lightblue bar*/

function FilterBar({ items, ariaLabel }) {
  return (
    <nav className="filter-pill" role="navigation" aria-label={ariaLabel}>
      {items.map((label) => (
        <span key={label} className="filter-item">
          {label}
        </span>
      ))}
    </nav>
  );
}

/* Small dark-blue banner at the top of the page for:"Heyyy! Don't forget to join today’s events!"*/
function AnnouncementBanner() {
  return (
    <div className="announcement">
      Heyyy! Don't forget to join today’s events!
    </div>
  );
}

/* Section ttiles used for: "Yooo, welcome!", "Recently added events", "Your events" and "Your clubs"*/
function SectionTitle({ children, variant = "h1" }) {
  return <h2 className={`section-title ${variant}`}>{children}</h2>;
}

/* Event cards - showing one event with image and info */
function EventCard({
  img,
  title,
  org,
  date,
  time,
  location,
  actionLabel = "Sign Up", // for now default button - planning on making it interactive
}) {
  return (
    <article className="card">
      <img className="event-img" src={img} alt={title} />
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <div className="card-meta">{org}</div>

        {/*Small row for event date and time*/}
        <div className="event-row">
          <span>{date}</span>
          <span className="dot">•</span>
          <span>{time}</span>
        </div>
        <div className="card-meta">{location}</div>
        {/*Disabled button for now not functional*/}
        <button className="btn-primary" disabled>
          {actionLabel}
        </button>
      </div>
    </article>
  );
}
/* Componnets for club card*/
function ClubCard({ img, name, category }) {
  return (
    <article className="card">
      <img className="event-img" src={img} alt={name} />
      <div className="card-body">
        <h3 className="card-title">{name}</h3>
        <div className="card-meta">{category}</div>
        <button className="btn-primary" disabled>
          Leave
        </button>
      </div>
    </article>
  );
}

/* Horizontal scrollable row for clubs/events */
function HorizontalRow({ children, ariaLabel }) {
  const items = React.Children.toArray(children); // turning child-componints into arrays

  /*Enabling Keybord scrolling*/
  const onKeyDown = (e) => {
    const el = e.currentTarget;
    if (e.key === "ArrowRight") {
      el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
      e.preventDefault();
    }
    if (e.key === "ArrowLeft") {
      el.scrollBy({ left: -el.clientWidth * 0.8, behavior: "smooth" });
      e.preventDefault();
    }
  };
  /*Rendering scrolable list with separators between the cards*/
  return (
    <ul
      className="hrow"
      aria-label={ariaLabel}
      role="list"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <li className="cap cap--left" aria-hidden="true" />
      {items.map((child, i) => (
        <React.Fragment key={i}>
          <li className="hrow-item" role="listitem">
            {child}
          </li>
          {i < items.length - 1 && <li className="sep" aria-hidden="true" />}
        </React.Fragment>
      ))}
      <li className="cap cap--right" aria-hidden="true" />
    </ul>
  );
}

/* Main page layout */
export default function HomePage() {
  const YOUR_EVENTS = RECENT_EVENTS.slice(0, 5);

  return (
    <>
      {/*top blue banner*/}
      <AnnouncementBanner />
      <main className="container">
        <SectionTitle variant="h1">Yooo, Welcome!</SectionTitle>

        {/*"recently added events" section*/}

        <SectionTitle variant="h2">Recently Added Events</SectionTitle>
        <HorizontalRow ariaLabel="Recently added events">
          {RECENT_EVENTS.map((e) => (
            <EventCard key={e.id} {...e} />
          ))}
        </HorizontalRow>

        {/*"your events" section*/}

        <SectionTitle variant="h2">Your Events</SectionTitle>
        <FilterBar items={EVENT_CATEGORIES} ariaLabel="Event categories" />
        <HorizontalRow ariaLabel="Your events">
          {YOUR_EVENTS.map((e) => (
            <EventCard key={`mine-${e.id}`} {...e} actionLabel="Leave" />
          ))}
        </HorizontalRow>

        {/*"your clubs" section*/}

        <SectionTitle variant="h2">Your Clubs</SectionTitle>
        <FilterBar items={CLUB_CATEGORIES} ariaLabel="Club categories" />
        <HorizontalRow ariaLabel="Your clubs">
          {YOUR_CLUBS.map((c) => (
            <ClubCard key={c.id} {...c} />
          ))}
        </HorizontalRow>
      </main>
    </>
  );
}
