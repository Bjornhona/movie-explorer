import { useState, useEffect } from "react";
import { NAVIGATION_LINKS } from "../constants.ts";
import { NavigationLink } from "../types.ts";
import "../styles/NavBar.scss";

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle path changes
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNav = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
    setCurrentPath(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getNavIcon = (route: string) => {
    switch (route) {
      case '/':
        return '🎬';
      case '/wishlist':
        return '❤️';
      default:
        return '📱';
    }
  };

  const getWishlistCount = () => {
    // This could be connected to your wishlist state
    // For now, returning a placeholder
    return 0;
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand/Logo */}
        <div className="navbar-brand" onClick={() => handleNav('/')}>
          <div className="brand-logo">
            🎬
          </div>
          <span className="brand-text">MovieNight</span>
        </div>

        {/* Desktop Navigation */}
        <ul className="navbar-nav">
          {NAVIGATION_LINKS.map((navLink: NavigationLink, index: number) => (
            <li key={index} className="nav-item">
              <div
                className={`nav-link ${currentPath === navLink.route ? 'active' : ''}`}
                onClick={() => handleNav(navLink.route)}
              >
                <span className="nav-icon">
                  {getNavIcon(navLink.route)}
                </span>
                <span className="nav-text">
                  {navLink.name}
                </span>
                {navLink.route === '/wishlist' && getWishlistCount() > 0 && (
                  <span className="nav-badge">
                    {getWishlistCount()}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Toggle */}
        <button 
          className={`navbar-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <ul className="mobile-nav">
          {NAVIGATION_LINKS.map((navLink: NavigationLink, index: number) => (
            <li key={index} className="nav-item">
              <div
                className={`nav-link ${currentPath === navLink.route ? 'active' : ''}`}
                onClick={() => handleNav(navLink.route)}
              >
                <span className="nav-icon">
                  {getNavIcon(navLink.route)}
                </span>
                <span className="nav-text">
                  {navLink.name}
                </span>
                {navLink.route === '/wishlist' && getWishlistCount() > 0 && (
                  <span className="nav-badge">
                    {getWishlistCount()}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
