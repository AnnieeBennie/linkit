// src/Pages/Clubs.js
import React, { useState } from "react";
import "../css/Colors.css";
import "../css/Clubs.css";
import ClubCard from "../Components/ClubCard";
import ClubFilter from "../Components/ClubFilter";
import "../css/ClubFilter.css";

const clubs = [
  {
    id: 1,
    name: "Photography Club",
    category: "Arts & Culture",
    image: "./images/photography.jpg",
    joined: true,
  },
  {
    id: 2,
    name: "Basketball Club",
    category: "Sports & Fitness",
    image: "./images/basketball.jpg",
    joined: false,
  },
  {
    id: 3,
    name: "Book Club",
    category: "Hobbies & Lifestyle",
    image: "./images/books.jpg",
    joined: false,
  },
  {
    id: 4,
    name: "Dancing Club",
    category: "Sports & Fitness",
    image: "./images/dancing.jpg",
    joined: false,
  },
  {
    id: 5,
    name: "Swimming Club",
    category: "Sports & Fitness",
    image: "./images/swimming.jpg",
    joined: false,
  },
  {
    id: 6,
    name: "Painting Club",
    category: "Arts & Culture",
    image: "./images/painting.jpg",
    joined: false,
  },
  {
    id: 7,
    name: "Padel Club",
    category: "Sports & Fitness",
    image: "./images/padel.jpg",
    joined: false,
  },
  {
    id: 8,
    name: "Bouldering Club",
    category: "Sports & Fitness",
    image: "./images/bouldering.jpg",
    joined: false,
  },
];

function Clubs() {
  return (
    <div className="clubs-page">
      <ClubFilter clubs={clubs}>
        {(filteredClubs) => (
          <>
            {filteredClubs.length > 0 ? (
              <div className="clubs-grid">
                {filteredClubs.map((club) => (
                  <ClubCard key={club.id} club={club} />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>No clubs found</p>
              </div>
            )}
          </>
        )}
      </ClubFilter>
    </div>
  );
}

export default Clubs;
