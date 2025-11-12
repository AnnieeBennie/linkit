import React from "react";
import "../css/Home.css";
import { RECENT_EVENTS, YOUR_CLUBS } from "../mock/events";

import EventCard from "../Components/EventCard";
import ClubCard from "../Components/ClubCard";
import EventFilter from "../Components/EventFilter";
import ClubFilter from "../Components/ClubFilter";

import AnnouncementBanner from "../Components/AnnouncementBanner";
import SectionTitle from "../Components/SectionTitle";
import HorizontalRow from "../Components/HorizontalRow";

const mapToEventProp = (e) => ({
  image: e.img,
  title: e.title,
  category: e.category,
  organizer: e.org,
  date: e.date,
  time: e.time,
  location: e.location,
});

const mapToClubProp = (c) => ({
  image: c.img,
  name: c.name,
  category: c.category,
  joined: c.joined ?? false,
});

const noop = () => {};

export default function HomePage() {
  const YOUR_EVENTS = RECENT_EVENTS.slice(0, 5);

  return (
    <>
      <AnnouncementBanner />
      <main className="container home">
        <SectionTitle variant="h1">Yooo, Welcome!</SectionTitle>

        {/* Recently added */}
        <SectionTitle variant="h2">Recently Added Events</SectionTitle>
        <HorizontalRow ariaLabel="Recently added events">
          {RECENT_EVENTS.length > 0 ? (
            RECENT_EVENTS.map((e) => (
              <EventCard key={e.id} event={mapToEventProp(e)} />
            ))
          ) : (
            <div className="no-results">No events available</div>
          )}
        </HorizontalRow>

        {/* Your events */}
        <SectionTitle variant="h2">Your Events</SectionTitle>
        <EventFilter events={YOUR_EVENTS}>
          {(filteredEvents) => (
            <HorizontalRow ariaLabel="Your events">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((e) => (
                  <EventCard key={`mine-${e.id}`} event={mapToEventProp(e)} />
                ))
              ) : (
                <div className="no-results">You have no upcoming events</div>
              )}
            </HorizontalRow>
          )}
        </EventFilter>

        {/* Your clubs */}
        <SectionTitle variant="h2">Your Clubs</SectionTitle>
        <ClubFilter clubs={YOUR_CLUBS}>
          {(filteredClubs) => (
            <HorizontalRow ariaLabel="Your clubs">
              {filteredClubs.length > 0 ? (
                filteredClubs.map((c) => (
                  <ClubCard
                    key={c.id}
                    club={mapToClubProp(c)}
                    onToggleJoin={noop}
                  />
                ))
              ) : (
                <div className="no-results">You have not joined any clubs</div>
              )}
            </HorizontalRow>
          )}
        </ClubFilter>
      </main>
    </>
  );
}
