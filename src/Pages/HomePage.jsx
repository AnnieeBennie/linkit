import React, { useEffect, useMemo, useState } from "react";
import "../css/Home.css";

import EventCard from "../Components/EventCard";
import ClubCard from "../Components/ClubCard";
import EventFilter from "../Components/EventFilter";
import ClubFilter from "../Components/ClubFilter";

import AnnouncementBanner from "../Components/AnnouncementBanner";
import SectionTitle from "../Components/SectionTitle";
import HorizontalRow from "../Components/HorizontalRow";

import { fetchEvents } from "../services/eventService";
import { fetchClubs } from "../services/clubService";
import { getRegisteredEventIdsForCurrentUser } from "../services/eventSignupService";
import {
  loadJoinedClubs,
  joinClub,
  leaveClub,
} from "../services/membershipService";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [joinedEvents, setJoinedEvents] = useState(() => new Set());
  const [joinedClubs, setJoinedClubs] = useState(() => new Set());
  const [loadingId, setLoadingId] = useState(null); // for club buttons

  const [eventFilter, setEventFilter] = useState(null);
  const [clubFilter, setClubFilter] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHomeData() {
      try {
        setLoading(true);
        setError(null);

        const [eventsFromDb, clubsFromDb] = await Promise.all([
          fetchEvents(),
          fetchClubs(),
        ]);

        if (cancelled) return;

        const clubList = (clubsFromDb || []).map((club) => {
          const img = club.get("image");
          return {
            id: club.id,
            name: club.get("name"),
            category: club.get("category"),
            description: club.get("club_description"),
            image: img ? img.url() : undefined,
          };
        });

        setEvents(eventsFromDb || []);
        setClubs(clubList);

        const [eventIds, clubIds] = await Promise.all([
          getRegisteredEventIdsForCurrentUser().catch(() => []),
          loadJoinedClubs().catch(() => []),
        ]);

        if (cancelled) return;

        setJoinedEvents(new Set(eventIds || []));
        setJoinedClubs(new Set(clubIds || []));
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError(err?.message || "Something went wrong loading home data.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHomeData();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    async function reloadMembership() {
      try {
        const [eventIds, clubIds] = await Promise.all([
          getRegisteredEventIdsForCurrentUser().catch(() => []),
          loadJoinedClubs().catch(() => []),
        ]);

        setJoinedEvents(new Set(eventIds || []));
        setJoinedClubs(new Set(clubIds || []));
      } catch (err) {
        console.error("Failed to reload membership on auth-change", err);
      }
    }

    const handler = () => {
      reloadMembership();
    };

    window.addEventListener("auth-change", handler);
    return () => window.removeEventListener("auth-change", handler);
  }, []);

  // 6 newest events (“Recently added”)
  const recentEvents = useMemo(() => {
    if (!events || events.length === 0) return [];
    const sorted = [...events].sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt) : 0;
      const db = b.createdAt ? new Date(b.createdAt) : 0;
      return db - da; // newest first
    });
    return sorted.slice(0, 6);
  }, [events]);

  // Events that the user has signed up for
  const yourEvents = useMemo(
    () => events.filter((e) => joinedEvents.has(e.id)),
    [events, joinedEvents]
  );

  const filteredYourEvents = useMemo(() => {
    if (!eventFilter) return yourEvents;
    return yourEvents.filter((e) => e.category === eventFilter);
  }, [yourEvents, eventFilter]);

  // Clubs that the user has joined
  const yourClubs = useMemo(
    () => clubs.filter((c) => joinedClubs.has(c.id)),
    [clubs, joinedClubs]
  );

  const filteredYourClubs = useMemo(() => {
    if (!clubFilter) return yourClubs;
    return yourClubs.filter((c) => c.category === clubFilter);
  }, [yourClubs, clubFilter]);

  const handleEventRegistrationChange = (action, eventId) => {
    setJoinedEvents((prev) => {
      const next = new Set(prev);
      if (action === "signup") {
        next.add(eventId);
      } else if (action === "leave") {
        next.delete(eventId);
      }
      return next;
    });
  };

  // club toggle (uses DB membership service)
  const handleToggleClub = async (clubObj) => {
    const id = clubObj.id;
    const currentlyJoined = joinedClubs.has(id);

    setLoadingId(id);

    try {
      if (currentlyJoined) {
        await leaveClub(id);

        setJoinedClubs((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } else {
        await joinClub(id);

        setJoinedClubs((prev) => {
          const next = new Set(prev);
          next.add(id);
          return next;
        });
      }
    } catch (err) {
      console.error("Something went wrong updating your club membership.", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <AnnouncementBanner />

      <main className="container home">
        <SectionTitle variant="h1">Yooo, Welcome!</SectionTitle>

        {loading && (
          <div className="home-loading">Loading your events and clubs…</div>
        )}
        {error && <div className="home-error">{error}</div>}

        {/* Recently added events (DB, 6 newest) */}
        <SectionTitle variant="h2">Recently Added Events</SectionTitle>
        {recentEvents.length > 0 ? (
          <HorizontalRow ariaLabel="Recently added events">
            {recentEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                joined={joinedEvents.has(event.id)}
                onRegistrationChange={handleEventRegistrationChange}
              />
            ))}
          </HorizontalRow>
        ) : (
          !loading && (
            <div className="home-no-results">
              No events available right now.
            </div>
          )
        )}

        {/* Your events = events you actually registered for */}
        <SectionTitle variant="h2">Your Events</SectionTitle>
        <EventFilter onFilter={setEventFilter} hideRegisteredEvents />

        {filteredYourEvents.length > 0 ? (
          <HorizontalRow ariaLabel="Your events">
            {filteredYourEvents.map((event) => (
              <EventCard
                key={`mine-${event.id}`}
                event={event}
                joined={joinedEvents.has(event.id)}
                onRegistrationChange={handleEventRegistrationChange}
              />
            ))}
          </HorizontalRow>
        ) : (
          !loading && (
            <div className="home-no-results">
              You have no upcoming events. Go sign up for some!
            </div>
          )
        )}

        {/* Your clubs = clubs you actually joined */}
        <SectionTitle variant="h2">Your Clubs</SectionTitle>
        <ClubFilter onFilter={setClubFilter} hideMyClubs />

        {filteredYourClubs.length > 0 ? (
          <HorizontalRow ariaLabel="Your clubs">
            {filteredYourClubs.map((club) => (
              <ClubCard
                key={club.id}
                club={club}
                isJoined={joinedClubs.has(club.id)}
                onToggleJoin={() => handleToggleClub(club)}
                loading={loadingId === club.id}
              />
            ))}
          </HorizontalRow>
        ) : (
          !loading && (
            <div className="home-no-results">
              You have not joined any clubs yet.
            </div>
          )
        )}
      </main>
    </>
  );
}
