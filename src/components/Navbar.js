import React from "react";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src="images/Logo.svg" alt="Travel Planner Logo" className="logo" />
        <span className="brand">Travel Planner</span>
      </div>
      <div className="nav-right">
        <a href="/about" className="nav-link">
          About
        </a>
        <a href="/blog" className="nav-link">
          Blog
        </a>
        <a href="/sign-in" className="nav-button-link">
          Sign in
        </a>
        <a href="register" className="nav-button">
          Register
        </a>
      </div>
    </nav>
  );
}
