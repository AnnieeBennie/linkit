import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./Components/Header";
import HomePage from "./Pages/HomePage";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/clubs" element={<div>Clubs Page</div>} />
        <Route path="/calendar" element={<div>Calendar Page</div>} />
        <Route path="/events" element={<div>Events Page</div>} />
        <Route path="/chats" element={<div>Chats Page</div>} />
        <Route path="/settings" element={<div>Settings Page</div>} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}
