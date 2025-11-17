import React, { useState } from "react";
import "../css/ClubFilter.css";

const CATEGORIES = [
  "Arts & Culture",
  "Sports & Fitness",
  "Hobbies & Lifestyle",
  "My Clubs",
];

function ClubFilter({ onFilter }) {
  const [selected, setSelected] = useState(null);
  const categories = ["All", ...CATEGORIES];

  function handleClick(cat) {
    const value = cat === "All" ? null : cat;
    setSelected(value);
    onFilter(value);
  }

  return (
    <div className="ClubFilter">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`filter-button ${
            selected === (cat === "All" ? null : cat) ? "active" : ""
          }`}
          onClick={() => handleClick(cat)}
          type="button"
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default ClubFilter;
