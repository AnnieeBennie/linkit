import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Clubs from "./Clubs.js";
import Events from "./Pages/Events";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/clubs" element={<Clubs/>} />
        <Route path="/calendar" element={<div>Calendar Page</div>} />
        <Route path="/events" element={<Events />} />
        <Route path="/chats" element={<div>Chats Page</div>} />
        <Route path="/settings" element={<div>Settings Page</div>} />
        <Route path="/home" element={<div>Home Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;
