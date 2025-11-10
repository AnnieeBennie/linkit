import React from "react";

export default function CalendarButton({ ariaLabel, onClick, children }) {
  return (
    <button
      type="button"
      className="arrow"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}