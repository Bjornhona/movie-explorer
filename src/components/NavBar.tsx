import React from "react";

const NavBar = () => {
  const handleNav = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <nav style={{
      display: "flex",
      gap: 24,
      alignItems: "center",
      padding: "16px 32px",
      background: "#222",
      color: "#fff",
      fontSize: "1.1rem",
      marginBottom: 24,
      boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
    }}>
      <span
        style={{ cursor: "pointer", fontWeight: 600 }}
        onClick={() => handleNav("/")}
      >
        Movies
      </span>
      <span
        style={{ cursor: "pointer", fontWeight: 600 }}
        onClick={() => handleNav("/watchlist")}
      >
        My Watchlist
      </span>
    </nav>
  );
};

export default NavBar; 