// // src/Pages/HomePage.jsx
// import React, { useMemo, useState } from "react";
// import "../css/Home.css";
// import { RECENT_EVENTS, YOUR_CLUBS } from "../mock/events";

// import EventCard from "../Components/EventCard";
// import ClubCard from "../Components/ClubCard";
// import EventFilter from "../Components/EventFilter";
// import ClubFilter from "../Components/ClubFilter";

// import AnnouncementBanner from "../Components/AnnouncementBanner";
// import SectionTitle from "../Components/SectionTitle";
// import HorizontalRow from "../Components/HorizontalRow";
// import Toast from "../Components/Toast";

// // map helpers
// const mapToEventProp = (e) => ({
//   id: e.id,
//   image: e.img,
//   title: e.title,
//   category: e.category,
//   organizer: e.org,
//   date: e.date,
//   time: e.time,
//   location: e.location,
// });

// const mapToClubProp = (c) => ({
//   id: c.id,
//   image: c.img,
//   name: c.name,
//   category: c.category,
//   joined: c.joined ?? false,
// });

// export default function HomePage() {
//   const YOUR_EVENTS = useMemo(() => RECENT_EVENTS.slice(0, 5), []);

//   const [joinedEvents, setJoinedEvents] = useState(() => new Set());
//   const [joinedClubs, setJoinedClubs] = useState(() => new Set());

//   const [loadingId, setLoadingId] = useState(null);

//   const [toast, setToast] = useState({ open: false, message: "", undo: null });

//   const handleToggleEvent = (eventObj) => {
//     const id = eventObj.id;
//     const currentlyJoined = joinedEvents.has(id);

//     const next = new Set(joinedEvents);
//     if (currentlyJoined) next.delete(id);
//     else next.add(id);
//     setJoinedEvents(next);
//     setLoadingId(id);

//     if (currentlyJoined) {
//       // left event
//       setToast({
//         open: true,
//         message: `Left "${eventObj.title}"`,
//         undo: () => {
//           setJoinedEvents((prev) => {
//             const s = new Set(prev);
//             s.add(id);
//             return s;
//           });
//           setToast({ open: false, message: "", undo: null });
//         },
//       });
//     } else {
//       // joined event
//       setToast({
//         open: true,
//         message: `Signed up for "${eventObj.title}"`,
//         undo: null,
//       });
//     }

//     setTimeout(() => setLoadingId(null), 300);
//   };

//   const handleToggleClub = (clubObj) => {
//     const id = clubObj.id;
//     const currentlyJoined = joinedClubs.has(id);

//     const next = new Set(joinedClubs);
//     if (currentlyJoined) next.delete(id);
//     else next.add(id);
//     setJoinedClubs(next);
//     setLoadingId(id);

//     if (currentlyJoined) {
//       setToast({
//         open: true,
//         message: `Left "${clubObj.name}"`,
//         undo: () => {
//           setJoinedClubs((prev) => {
//             const s = new Set(prev);
//             s.add(id);
//             return s;
//           });
//           setToast({ open: false, message: "", undo: null });
//         },
//       });
//     } else {
//       setToast({
//         open: true,
//         message: `Joined "${clubObj.name}"`,
//         undo: null,
//       });
//     }

//     setTimeout(() => setLoadingId(null), 300);
//   };

//   return (
//     <>
//       <AnnouncementBanner />
//       <main className="container home">
//         <SectionTitle variant="h1">Yooo, Welcome!</SectionTitle>

//         {/* Recently added */}
//         <SectionTitle variant="h2">Recently Added Events</SectionTitle>
//         <HorizontalRow ariaLabel="Recently added events">
//           {RECENT_EVENTS.length > 0 ? (
//             RECENT_EVENTS.map((e) => {
//               const ev = mapToEventProp(e);
//               return (
//                 <EventCard
//                   key={ev.id}
//                   event={ev}
//                   joined={joinedEvents.has(ev.id)}
//                   loading={loadingId === ev.id}
//                   onToggle={() => handleToggleEvent(ev)}
//                 />
//               );
//             })
//           ) : (
//             <div className="no-results">No events available</div>
//           )}
//         </HorizontalRow>

//         {/* Your events */}
//         <SectionTitle variant="h2">Your Events</SectionTitle>
//         <EventFilter events={YOUR_EVENTS} hideRegisteredEvents>
//           {(filteredEvents) => (
//             <HorizontalRow ariaLabel="Your events">
//               {filteredEvents.length > 0 ? (
//                 filteredEvents.map((e) => {
//                   const ev = mapToEventProp(e);
//                   return (
//                     <EventCard
//                       key={`mine-${ev.id}`}
//                       event={ev}
//                       joined={joinedEvents.has(ev.id)}
//                       loading={loadingId === ev.id}
//                       onToggle={() => handleToggleEvent(ev)}
//                     />
//                   );
//                 })
//               ) : (
//                 <div className="no-results">You have no upcoming events</div>
//               )}
//             </HorizontalRow>
//           )}
//         </EventFilter>

//         {/* Your clubs */}
//         <SectionTitle variant="h2">Your Clubs</SectionTitle>
//         <ClubFilter clubs={YOUR_CLUBS} hideMyClubs>
//           {(filteredClubs) => (
//             <HorizontalRow ariaLabel="Your clubs">
//               {filteredClubs.length > 0 ? (
//                 filteredClubs.map((c) => {
//                   const club = mapToClubProp(c);
//                   return (
//                     <ClubCard
//                       key={club.id}
//                       club={{
//                         ...club,
//                         joined: joinedClubs.has(club.id),
//                       }}
//                       onToggleJoin={() => handleToggleClub(club)}
//                     />
//                   );
//                 })
//               ) : (
//                 <div className="no-results">You have not joined any clubs</div>
//               )}
//             </HorizontalRow>
//           )}
//         </ClubFilter>
//       </main>

//       <Toast
//         open={toast.open}
//         message={toast.message}
//         actionText={toast.undo ? "Undo" : undefined}
//         onAction={toast.undo || undefined}
//         onClose={() => setToast({ open: false, message: "", undo: null })}
//       />
//     </>
//   );
// }
//
import React, { useMemo, useState } from "react";
import "../css/Home.css";
import { RECENT_EVENTS, YOUR_CLUBS } from "../mock/events";

import EventCard from "../Components/EventCard";
import ClubCard from "../Components/ClubCard";
import EventFilter from "../Components/EventFilter";
import ClubFilter from "../Components/ClubFilter";

import AnnouncementBanner from "../Components/AnnouncementBanner";
import SectionTitle from "../Components/SectionTitle";
import HorizontalRow from "../Components/HorizontalRow";
import Toast from "../Components/Toast";

// map helpers
const mapToEventProp = (e) => ({
  id: e.id,
  image: e.img,
  title: e.title,
  category: e.category,
  organizer: e.org,
  date: e.date,
  time: e.time,
  location: e.location,
});

const mapToClubProp = (c) => ({
  id: c.id,
  image: c.img,
  name: c.name,
  category: c.category,
  joined: c.joined ?? false,
});

export default function HomePage() {
  const YOUR_EVENTS = useMemo(() => RECENT_EVENTS.slice(0, 5), []);

  // MEMBERSHIP STATES
  const [joinedEvents, setJoinedEvents] = useState(() => new Set());
  const [joinedClubs, setJoinedClubs] = useState(() => new Set());
  const [loadingId, setLoadingId] = useState(null);

  // FILTER STATES
  const [eventFilter, setEventFilter] = useState(null);
  const [clubFilter, setClubFilter] = useState(null);

  // FILTERED DATA
  const filteredEvents = eventFilter
    ? YOUR_EVENTS.filter((e) => e.category === eventFilter)
    : YOUR_EVENTS;

  const filteredClubs = clubFilter
    ? YOUR_CLUBS.filter((c) => c.category === clubFilter)
    : YOUR_CLUBS;

  // EVENT TOGGLE LOGIC
  const [toast, setToast] = useState({ open: false, message: "", undo: null });

  const handleToggleEvent = (eventObj) => {
    const id = eventObj.id;
    const currentlyJoined = joinedEvents.has(id);

    const next = new Set(joinedEvents);
    if (currentlyJoined) next.delete(id);
    else next.add(id);
    setJoinedEvents(next);
    setLoadingId(id);

    if (currentlyJoined) {
      setToast({
        open: true,
        message: `Left "${eventObj.title}"`,
        undo: () => {
          setJoinedEvents((prev) => {
            const s = new Set(prev);
            s.add(id);
            return s;
          });
          setToast({ open: false, message: "", undo: null });
        },
      });
    } else {
      setToast({
        open: true,
        message: `Signed up for "${eventObj.title}"`,
        undo: null,
      });
    }

    setTimeout(() => setLoadingId(null), 300);
  };

  // CLUB TOGGLE LOGIC
  const handleToggleClub = (clubObj) => {
    const id = clubObj.id;
    const currentlyJoined = joinedClubs.has(id);

    const next = new Set(joinedClubs);
    if (currentlyJoined) next.delete(id);
    else next.add(id);
    setJoinedClubs(next);
    setLoadingId(id);

    if (currentlyJoined) {
      setToast({
        open: true,
        message: `Left "${clubObj.name}"`,
        undo: () => {
          setJoinedClubs((prev) => {
            const s = new Set(prev);
            s.add(id);
            return s;
          });
          setToast({ open: false, message: "", undo: null });
        },
      });
    } else {
      setToast({
        open: true,
        message: `Joined "${clubObj.name}"`,
        undo: null,
      });
    }

    setTimeout(() => setLoadingId(null), 300);
  };

  return (
    <>
      <AnnouncementBanner />

      <main className="container home">
        <SectionTitle variant="h1">Yooo, Welcome!</SectionTitle>

        {/* Recently added */}
        <SectionTitle variant="h2">Recently Added Events</SectionTitle>
        <HorizontalRow ariaLabel="Recently added events">
          {RECENT_EVENTS.map((e) => {
            const ev = mapToEventProp(e);
            return (
              <EventCard
                key={ev.id}
                event={ev}
                joined={joinedEvents.has(ev.id)}
                loading={loadingId === ev.id}
                onToggle={() => handleToggleEvent(ev)}
              />
            );
          })}
        </HorizontalRow>

        {/* Your events */}
        <SectionTitle variant="h2">Your Events</SectionTitle>
        <EventFilter onFilter={setEventFilter} hideRegisteredEvents />

        {filteredEvents.length > 0 ? (
          <HorizontalRow ariaLabel="Your events">
            {filteredEvents.map((e) => {
              const ev = mapToEventProp(e);
              return (
                <EventCard
                  key={`mine-${ev.id}`}
                  event={ev}
                  joined={joinedEvents.has(ev.id)}
                  loading={loadingId === ev.id}
                  onToggle={() => handleToggleEvent(ev)}
                />
              );
            })}
          </HorizontalRow>
        ) : (
          <div className="home-no-results">You have no upcoming events</div>
        )}

        {/* Your clubs */}
        <SectionTitle variant="h2">Your Clubs</SectionTitle>
        <ClubFilter onFilter={setClubFilter} hideMyClubs />

        {filteredClubs.length > 0 ? (
          <HorizontalRow ariaLabel="Your clubs">
            {filteredClubs.map((c) => {
              const club = mapToClubProp(c);
              return (
                <ClubCard
                  key={club.id}
                  club={{ ...club, joined: joinedClubs.has(club.id) }}
                  onToggleJoin={() => handleToggleClub(club)}
                />
              );
            })}
          </HorizontalRow>
        ) : (
          <div className="home-no-results">You have not joined any clubs</div>
        )}
      </main>

      <Toast
        open={toast.open}
        message={toast.message}
        actionText={toast.undo ? "Undo" : undefined}
        onAction={toast.undo || undefined}
        onClose={() => setToast({ open: false, message: "", undo: null })}
      />
    </>
  );
}
