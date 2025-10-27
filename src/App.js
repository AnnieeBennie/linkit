import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Calendar from "./Components/Calendar";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/clubs" element={<div>Clubs Page</div>} />
        <Route path="/calendar" element={Calendar} />
        <Route path="/events" element={<div>Events Page</div>} />
        <Route path="/chats" element={<div>Chats Page</div>} />
        <Route path="/settings" element={<div>Settings Page</div>} />
        <Route path="/home" element={<div>Home Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;
