// src/Pages/Clubs.js
import React, { useState } from "react";
import "../css/Colors.css";
import "../css/Clubs.css";
import ClubCard from "../Components/ClubCard";

const categories = ["All", "Arts & Culture", "Sports & Fitness", "Hobbies & Lifestyle", "My Clubs"];

const theClubs = [
  { id: 1, name: "Photography Club", category: "Arts & Culture", image: "./images/photography.jpg", joined: true },
  { id: 2, name: "Basketball Club", category: "Sports & Fitness", image: "./images/basketball.jpg", joined: false },
  { id: 3, name: "Book Club", category: "Hobbies & Lifestyle", image: "./images/books.jpg", joined: false },
  { id: 4, name: "Dancing Club", category: "Sports & Fitness", image: "./images/dancing.jpg", joined: false },
  { id: 5, name: "Swimming Club", category: "Sports & Fitness", image: "./images/swimming.jpg", joined: false },
  { id: 6, name: "Painting Club", category: "Arts & Culture", image: "./images/painting.jpg", joined: false },
  { id: 7, name: "Padel Club", category: "Sports & Fitness", image: "./images/padel.jpg", joined: false },
  { id: 8, name: "Bouldering Club", category: "Sports & Fitness", image: "./images/bouldering.jpg", joined: false },
];

function Clubs() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [clubs, setClubs] = useState(theClubs);

  const toggleJoin = (id) => {
    setClubs((prevClubs) =>
      prevClubs.map((club) =>
        club.id === id ? { ...club, joined: !club.joined } : club
      )
    );
  };

  // filter logic
  const filteredClubs = clubs.filter((club) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "My Clubs") return club.joined;
    return club.category === activeFilter;
  });

  return (
    <div className="clubs-page">
      {/* Filter bar */}
      <div className="filter-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${activeFilter === cat ? "active" : ""}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Clubs grid */}
      <div className="clubs-grid">
        {filteredClubs.map((club) => (
          <ClubCard key={club.id} club={club} onToggleJoin={toggleJoin} />
        ))}
      </div>
    </div>
  );
}

export default Clubs;