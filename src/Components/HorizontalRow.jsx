import React from "react";
import "../css/Home.css";

export default function HorizontalRow({ children, ariaLabel }) {
  const items = React.Children.toArray(children);

  function onKeyDown(e) {
    const el = e.currentTarget;
    if (e.key === "ArrowRight") {
      el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
      e.preventDefault();
    }
    if (e.key === "ArrowLeft") {
      el.scrollBy({ left: -el.clientWidth * 0.8, behavior: "smooth" });
      e.preventDefault();
    }
  }

  return (
    <ul
      className="hrow"
      aria-label={ariaLabel}
      role="list"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <li className="cap cap--left" aria-hidden="true" />
      {items.map((child, i) => (
        <React.Fragment key={i}>
          <li className="hrow-item" role="listitem">
            {child}
          </li>
          {i < items.length - 1 && <li className="sep" aria-hidden="true" />}
        </React.Fragment>
      ))}
      <li className="cap cap--right" aria-hidden="true" />
    </ul>
  );
}
