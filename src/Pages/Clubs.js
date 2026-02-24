import React, { useEffect, useState } from "react";
import "../css/Clubs.css";
import "../css/ClubFilter.css";
import ClubCard from "../Components/ClubCard";
import ClubFilter from "../Components/ClubFilter";

import { fetchClubs } from "../services/clubService";
import { loadJoinedClubs } from "../services/membershipService";

export default function Clubs() {

  const [clubs, setClubs] = useState([]);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(null);


  // Filtering
  let filteredClubs = clubs;

  if (filter === "My Clubs") {
    filteredClubs = clubs.filter((c) => 
      joinedClubs.includes(c.id)
    );
  } else if (filter) {
    filteredClubs = clubs.filter((c) => 
      c.category === filter
    );
  }


  // Load clubs
  async function loadAllClubs() {
    setLoading(true);
    setError(null);

    try {
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

      const joinedIds = await loadJoinedClubs();
      setJoinedClubs(joinedIds);
    } catch (err) {
      console.error("Failed to load clubs", err);
      setError("Failed to load clubs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAllClubs();
  }, []);


  useEffect(() => {
    const handleStatusChange = async () => {
      try {
        const joinedIds = await loadJoinedClubs();
        setJoinedClubs(joinedIds);
      } catch (err) {
        console.error("Failed to refetch joined clubs", err);
      }
    };

    window.addEventListener("club-status-changed", handleStatusChange);
    return () => window.removeEventListener("club-status-changed", handleStatusChange);
  }, []);


  // Loading and error states
  if (loading) {
    return <div className="PageTitle">Loading clubs…</div>;
  } 

  if (error) {
    return <div className="PageTitle">Failed to load clubs</div>;
  } 
  

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
            />
          ))}
        </div>
      ) : (
        <div className="no-results">
          No matches for your filter
        </div>
      )}
    </div>
  );
}