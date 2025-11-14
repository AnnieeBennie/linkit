import React, { useMemo, useState } from "react";
import "../css/ClubFilter.css";

const DEFAULT_CATEGORIES = [
  "Arts & Culture",
  "Sports & Fitness",
  "Hobbies & Lifestyle",
  "My Clubs",
];

function ClubFilter({
  clubs = [],
  categories: propCategories = null,
  children,
}) {
  const categories = useMemo(
    () => propCategories || DEFAULT_CATEGORIES,
    [propCategories]
  );

  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    if (!selected) return clubs;
    if (selected === "My Clubs") return clubs.filter((c) => c.joined);
    return clubs.filter((e) => e.category === selected);
  }, [clubs, selected]);

  return (
    <div>
      <div className="ClubFilter">
        <button
          key="all"
          className={`filter-button ${selected === null ? "active" : ""}`}
          onClick={() => setSelected(null)}
          type="button"
        >
          All
        </button>
        {categories.map((cat, i) => (
          <button
            key={i}
            className={`filter-button ${selected === cat ? "active" : ""}`}
            onClick={() => setSelected((cur) => (cur === cat ? null : cat))}
            type="button"
          >
            {cat}
          </button>
        ))}
      </div>

      {typeof children === "function" ? children(filtered) : children}
    </div>
  );
}

export default ClubFilter;
