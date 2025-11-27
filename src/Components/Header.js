import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../css/Header.css";
import ProfileIcon from "../Icons/Profile.svg";
import SearchIcon from "../Icons/Search.svg";
import NotificationIcon from "../Icons/Notification.svg";
import Login from "../Components/Login";
import SignUp from "../Components/SignUp";

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <header className="navbar">
        {/* Left side: logo (clickable to go home) */}
        <NavLink to="/home" className="logo" aria-label="Home">
          LINKIT
        </NavLink>
        {/* Center: menu links */}
        <nav className="nav-links">
          <NavLink to="/clubs" className="nav-link">
            Clubs & Organizations
          </NavLink>
          <NavLink to="/calendar" className="nav-link">
            Calendar
          </NavLink>
          <NavLink to="/events" className="nav-link">
            Events
          </NavLink>
          <NavLink to="/chats" className="nav-link">
            Chats
          </NavLink>
          <NavLink to="/settings" className="nav-link">
            Settings
          </NavLink>
        </nav>
        {/* Right side: icons */}
        <div className="nav-icons">
          <img src={SearchIcon} alt="Search" className="icon" />
          <img src={NotificationIcon} alt="Notifications" className="icon" />

          <img
            src={ProfileIcon}
            alt="Profile"
            className="icon"
            onClick={() => setShowLogin(true)}
          />
        </div>
      </header>
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSuccess={(user) => {
            console.log("Logged in:", user.get("email"));
            setShowLogin(false);
          }}
          onShowRegister={() => setShowRegister(true)}
        />
      )}
      {showRegister && (
        <SignUp
          onClose={() => setShowRegister(false)}
          onSuccess={(user) => {
            console.log("Logged in:", user.get("email"));
            setShowRegister(false);
          }}
        />
      )}
    </>
  );
};
export default Header;
