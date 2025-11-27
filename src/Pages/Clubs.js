import React, { useEffect, useState } from "react";
import "../css/Clubs.css";
import ClubCard from "../Components/ClubCard";
import ClubFilter from "../Components/ClubFilter";
import "../css/ClubFilter.css";

import { fetchClubs } from "../services/clubService";
import {
  joinClub,
  leaveClub,
  loadJoinedClubs,
} from "../services/membershipService";

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(null);

  const filteredClubs = filter
    ? clubs.filter((e) => e.category === filter)
    : clubs;

  useEffect(() => {
    async function loadEverything() {
      setLoading(true);

      // 1. Load clubs from DB
      const data = await fetchClubs();
      const clubList = data.map((club) => {
        const img = club.get("image");
        return {
          id: club.id,
          name: club.get("name"),
          category: club.get("category"),
          description: club.get("club_description"),
          image: img ? img.url() : undefined,
          joined: false,
        };
      });

      // 2. Load user memberships
      const joinedIds = await loadJoinedClubs();

      // 3. Mark clubs as joined
      const merged = clubList.map((c) => ({
        ...c,
        joined: joinedIds.includes(c.id),
      }));

      setClubs(merged);
      setLoading(false);
    }

    loadEverything();
  }, []);

  // JOIN / LEAVE
  const handleToggleJoin = async (clubId) => {
    setClubs((prev) =>
      prev.map((c) => (c.id === clubId ? { ...c, joined: !c.joined } : c))
    );

    const club = clubs.find((c) => c.id === clubId);
    if (!club) return;

    if (club.joined) {
      await leaveClub(clubId);
    } else {
      await joinClub(clubId);
    }
  };

  if (loading) return <div className="PageTitle">Loading clubs…</div>;
  if (error) return <div className="PageTitle">Failed to load clubs</div>;
  return (
    <div className="clubs-container">
      <ClubFilter onFilter={setFilter} />
      <div className="PageTitle">Clubs</div>
      {filteredClubs.length > 0 ? (
        <div className="clubs-grid">
          {filteredClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      ) : (
        <div className="no-results">No matches for your filter</div>
      )}
    </div>
  );
}
