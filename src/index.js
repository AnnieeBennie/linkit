import React from "react";
import ReactDOM from "react-dom/client";
import "./css/Colors.css";
import "./index.css";
import Parse from "parse/dist/parse.min.js";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Initialize Parse (run once) after imports
Parse.initialize(
  process.env.REACT_APP_PARSE_APP_ID ||
    "rxX7m4vzLGRd3yZnesjokyWoPHtBTa0G0sjuMocr",
  process.env.REACT_APP_PARSE_JS_KEY ||
    "Zc3PJPcbi8cGbvOfOg9Tn2Q3XkFfMXbx4FulIw7N"
); // JS key optional depending on server
Parse.serverURL =
  process.env.REACT_APP_PARSE_SERVER_URL || "https://parseapi.back4app.com";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
