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

  // State for clubs list and user's joined clubs
  const [clubs, setClubs] = useState([]);
  const [joinedClubs, setJoinedClubs] = useState([]); // only source of truth
  
  // State for loading, error handling and UI 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(null);
  
  // State for success popup after joining/leaving
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMode, setSuccessMode] = useState("join");
  
  // Track which clubs are processing join/leave to prevent double-clicks
  const [pendingClubIds, setPendingClubIds] = useState(new Set());


  let filteredClubs = clubs;
  if (filter === "My Clubs") {
    filteredClubs = clubs.filter((c) => joinedClubs.includes(c.id));
  } else if (filter) {
    filteredClubs = clubs.filter((c) => c.category === filter);
  }

  useEffect(() => {
    async function loadEverything() {
      setLoading(true);
      setError(null);

      try {
        // Fetch all clubs from db
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

        // Load current user's joined club IDs
        const joinedIds = await loadJoinedClubs();
        setJoinedClubs(joinedIds);
      } catch (err) {
        console.error("Failed to load clubs", err);
        setError("Failed to load clubs");
      } finally {
        setLoading(false);
      }
    }

    loadEverything();
  }, []);

  // Handle club join/leave
  async function handleToggleJoin(clubId) {
    if (pendingClubIds.has(clubId)) return;

    setPendingClubIds((prev) => new Set(prev).add(clubId));

    try {
      if (joinedClubs.includes(clubId)) {
        // User is already in club, so leave it
        await leaveClub(clubId);
        setJoinedClubs((prev) => prev.filter((id) => id !== clubId));
      } else {
        // User is not in club, so join it
        await joinClub(clubId);
        setJoinedClubs((prev) => [...prev, clubId]);
      }
    } finally {
      // Always clear pending state, even if request fails
      setPendingClubIds((prev) => {
        const next = new Set(prev);
        next.delete(clubId);
        return next;
      });
    }
  }

  // Show success modal with appropriate message (join or leave)
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
              loading={pendingClubIds.has(club.id)}
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