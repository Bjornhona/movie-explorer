import "../styles/components/Footer.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="brand-logo">
              🎬
            </div>
            <div className="brand-info">
              <h3 className="brand-name">MovieExplorer</h3>
              <p className="brand-tagline">Discover your next favorite movie</p>
            </div>
          </div>

          {/* Links Section */}
          <div className="footer-links">
            <div className="footer-section">
              <h4 className="section-title">Navigation</h4>
              <ul className="link-list">
                <li><a href="/" className="footer-link">Movies</a></li>
                <li><a href="/wishlist" className="footer-link">My Wishlist</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-info">
            <p className="copyright">
              © {currentYear} MovieExplorer. All rights reserved.
            </p>
            <p className="powered-by">
              Powered by TMDB API
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;