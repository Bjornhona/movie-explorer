import { useState, useEffect } from "react";
import { NAVIGATION_LINKS } from "../constants.ts";
import { NavigationLink } from "../types.ts";
import "../styles/components/NavBar.scss";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    setCurrentPath(window.location.pathname);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isClient]);

  // Handle path changes
  useEffect(() => {
    if (!isClient) return;

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isClient]);

  const handleNav = (path: string) => {
    if (!isClient) return;

    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
    setCurrentPath(path);
  };

  const getNavIcon = (route: string) => {
    switch (route) {
      case "/":
        return "🎬";
      case "/wishlist":
        return "❤️";
      default:
        return "📱";
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Brand/Logo */}
        <div className="navbar-brand" onClick={() => handleNav("/")}>
          <div className="brand-logo">🎬</div>
          <span className="brand-text">MovieExplorer</span>
        </div>

        {/* Desktop Navigation */}
        <ul className="navbar-nav">
          {NAVIGATION_LINKS.map((navLink: NavigationLink, index: number) => (
            <li key={index} className="nav-item">
              <div
                className={`nav-link ${
                  currentPath === navLink.route ? "active" : ""
                }`}
                onClick={() => handleNav(navLink.route)}
              >
                <span className="nav-icon">{getNavIcon(navLink.route)}</span>
                <span className="nav-text">{navLink.name}</span>
              </div>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Toggle
        <button
          className={`navbar-toggle ${isMobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
        </button> */}
      </div>

      {/* Mobile Menu */}
      {/* <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
        <ul className="mobile-nav">
          {NAVIGATION_LINKS.map((navLink: NavigationLink, index: number) => (
            <li key={index} className="nav-item">
              <div
                className={`nav-link ${
                  currentPath === navLink.route ? "active" : ""
                }`}
                onClick={() => handleNav(navLink.route)}
              >
                <span className="nav-icon">{getNavIcon(navLink.route)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div> */}
    </nav>
  );
};

export default NavBar;
