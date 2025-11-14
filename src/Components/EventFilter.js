import React, { useMemo, useState } from "react";
import "../css/EventFilter.css";

const DEFAULT_CATEGORIES = [
  "Arts & Culture",
  "Sports & Fitness",
  "Hobbies & Lifestyle",
  "Party",
  "Registered Events",
];

function EventFilter({
  events = [],
  categories: propCategories = null,
  children,
  //HomePage has only registered event showing, hence no need for "Registered Events"
  hideRegisteredEvents = false,
}) {
  const categories = useMemo(() => {
    const base = propCategories || DEFAULT_CATEGORIES;

    if (hideRegisteredEvents) {
      return base.filter((cat) => cat !== "Registered Events");
    }
    return base;
  }, [propCategories, hideRegisteredEvents]);

  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    if (!selected) return events;
    return events.filter((e) => e.category === selected);
  }, [events, selected]);

  return (
    <div>
      <div className="EventFilter">
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

export default EventFilter;
