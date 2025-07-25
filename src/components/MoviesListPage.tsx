import { useEffect, useState } from "react";
import MovieCarousel from "./MovieCarousel.tsx";
import { CATEGORIES } from "../constants.ts";
import Toast from "./Toast.tsx";

const MoviesListPage = () => {
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("logoutSuccess")) {
      setShowLogoutToast(true);
      localStorage.removeItem("logoutSuccess");
    }
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Movies</h2>
      {CATEGORIES.map((category) => (
        <MovieCarousel
          key={category.id}
          title={category.name}
          categoryId={category.id}
        />
      ))}
      {showLogoutToast && (
        <Toast message="Logout successful!" color="green" onClose={() => setShowLogoutToast(false)} />
      )}
    </div>
  );
};

export default MoviesListPage;
