import React, { useEffect, useState } from "react";
import "../css/Clubs.css";
import ClubCard from "../Components/ClubCard";
import ClubFilter from "../Components/ClubFilter";
import ClubSuccess from "../Components/ClubSuccess";
import "../css/ClubFilter.css";

import { fetchClubs } from "../services/clubService";
import {
  joinClub,
  leaveClub,
  loadJoinedClubs,
} from "../services/membershipService";

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [joinedClubs, setJoinedClubs] = useState([]); // only source of truth
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [filter, setFilter] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMode, setSuccessMode] = useState("join");

  // Filter logic
  let filteredClubs = clubs;

  if (filter === "My Clubs") {
    filteredClubs = clubs.filter((c) => joinedClubs.includes(c.id));
  } else if (filter) {
    filteredClubs = clubs.filter((c) => c.category === filter);
  }

  useEffect(() => {
    async function loadEverything() {
      setLoading(true);

      // Load clubs
      const data = await fetchClubs();
      const clubList = data.map((club) => {
        const img = club.get("image");
        return {
          id: club.id,
          name: club.get("name"),
          category: club.get("category"),
          description: club.get("club_description"),
          image: img ? img.url() : undefined,
        };
      });

      setClubs(clubList);

      // Load user's joined club IDs
      const joinedIds = await loadJoinedClubs();
      setJoinedClubs(joinedIds);

      setLoading(false);
    }

    loadEverything();
  }, []);

  // JOIN / LEAVE
  async function handleToggleJoin(clubId) {
    if (joinedClubs.includes(clubId)) {
      await leaveClub(clubId);
      setJoinedClubs((prev) => prev.filter((id) => id !== clubId));
    } else {
      await joinClub(clubId);
      setJoinedClubs((prev) => [...prev, clubId]);
    }
  }

  function handleSuccess(mode) {
    setSuccessMode(mode);
    setShowSuccess(true);
  }

  if (loading) return <div className="PageTitle">Loading clubs…</div>;
  if (error) return <div className="PageTitle">Failed to load clubs</div>;

  return (
    <div className="clubs-container">
      <ClubFilter onFilter={setFilter} />

      <div className="PageTitle">Clubs</div>

      {filteredClubs.length > 0 ? (
        <div className="clubs-grid">
          {filteredClubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              isJoined={joinedClubs.includes(club.id)}
              onToggleJoin={handleToggleJoin}
              onSuccess={handleSuccess}
            />
          ))}
        </div>
      ) : (
        <div className="no-results">No matches for your filter</div>
      )}

      {showSuccess && (
        <div className="details-success-overlay">
          <div
            className="details-success-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <ClubSuccess
              mode={successMode}
              onClose={() => setShowSuccess(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}