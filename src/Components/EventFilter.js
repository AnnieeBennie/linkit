import React, { useState } from "react";
import "../css/EventFilter.css";

const ALL_CATEGORIES = [
  "Arts & Culture",
  "Sports & Fitness",
  "Hobbies & Lifestyle",
  "Party",
  "Registered Events",
];

function EventFilter({ onFilter, hideRegisteredEvents = false }) {
  const [selected, setSelected] = useState(null);

  const CATEGORIES = hideRegisteredEvents
    ? ALL_CATEGORIES.filter((c) => c !== "Registered Events")
    : ALL_CATEGORIES;

  const categories = ["All", ...CATEGORIES];

  function handleClick(cat) {
    const value = cat === "All" ? null : cat;
    setSelected(value);
    onFilter(value);
  }

  return (
    <div className="EventFilter">
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

export default EventFilter;
