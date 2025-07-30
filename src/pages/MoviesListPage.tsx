import { useEffect, useState } from "react";
import MovieCarousel from "../components/MovieCarousel.tsx";
import { CATEGORIES } from "../constants.ts";
import Toast from "../components/Toast.tsx";
import "../styles/pages/MoviesListPage.scss";

const MoviesListPage = () => {
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("logoutSuccess")) {
      setShowLogoutToast(true);
      localStorage.removeItem("logoutSuccess");
    }
  }, []);

  return (
    <div className="movies-list-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Amazing Movies</h1>
          <p className="hero-subtitle">
            Explore the latest releases, popular hits, and top-rated films from around the world
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {CATEGORIES.map((category, index) => (
            <section 
              key={category.id} 
              className="card-section fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-header">
                <h2>
                  <span className="card-icon">
                    <category.icon size={20} color="white" />
                  </span>
                  {category.name}
                </h2>
                <p className="card-description">
                  {category.id === 'upcoming' && 'Coming soon to theaters near you'}
                  {category.id === 'popular' && 'Trending movies everyone is talking about'}
                  {category.id === 'top_rated' && 'Critically acclaimed masterpieces'}
                </p>
              </div>
              <div className="card-content">
                <MovieCarousel
                  categoryId={category.id}
                />
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Toast Notifications */}
      {showLogoutToast && (
        <div className="toast-container">
          <Toast 
            message="Logout successful!" 
            color="green" 
            onClose={() => setShowLogoutToast(false)} 
          />
        </div>
      )}
    </div>
  );
};

export default MoviesListPage;
