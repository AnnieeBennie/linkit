import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./Components/Header";
import HomePage from "./Pages/HomePage";
import Calendar from "./Components/Calendar";
import Clubs from "./Clubs.js";
import Events from "./Pages/Events";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/clubs" element={<Clubs/>} />
        <Route path="/events" element={<Events />} />
        <Route path="/chats" element={<div>Chats Page</div>} />
        <Route path="/settings" element={<div>Settings Page</div>} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}
