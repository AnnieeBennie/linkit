import React from "react";
import "../css/Home.css";

export default function SectionTitle({ children, variant = "h1" }) {
  return <h2 className={`section-title ${variant}`}>{children}</h2>;
}
