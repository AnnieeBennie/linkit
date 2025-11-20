import React from "react";
import ReactDOM from "react-dom/client";
import "./css/Colors.css";
import "./index.css";
import "./services/parse";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Parse is initialized in `src/services/parse.js` which is imported above.

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
