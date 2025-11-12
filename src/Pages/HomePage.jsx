import React from "react";
import "../css/Home.css";
import { RECENT_EVENTS, YOUR_CLUBS } from "../mock/events";

import EventCard from "../Components/EventCard";
import ClubCard from "../Components/ClubCard";
import EventFilter from "../Components/EventFilter";

import AnnouncementBanner from "../Components/AnnouncementBanner";
import SectionTitle from "../Components/SectionTitle";
import HorizontalRow from "../Components/HorizontalRow";

const mapToEventProp = (e) => ({
  image: e.img,
  title: e.title,
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
          {RECENT_EVENTS.map((e) => (
            <EventCard key={e.id} event={mapToEventProp(e)} />
          ))}
        </HorizontalRow>

        {/* Your events */}
        <SectionTitle variant="h2">Your Events</SectionTitle>
        <EventFilter events={YOUR_EVENTS}>
          {(filteredEvents) => (
            <HorizontalRow ariaLabel="Your events">
              {filteredEvents.map((e) => (
                <EventCard key={`mine-${e.id}`} event={mapToEventProp(e)} />
              ))}
            </HorizontalRow>
          )}
        </EventFilter>

        {/* Your clubs */}
        <SectionTitle variant="h2">Your Clubs</SectionTitle>
        <EventFilter events={YOUR_CLUBS}>
          {(filteredEvents) => (
            <HorizontalRow ariaLabel="Your clubs">
              {filteredEvents.map((c) => (
                <ClubCard
                  key={c.id}
                  club={mapToClubProp(c)}
                  onToggleJoin={noop}
                />
              ))}
            </HorizontalRow>
          )}
        </EventFilter>
      </main>
    </>
  );
}
