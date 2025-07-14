import React from "react";
import "@/styles/App.scss";
import "@/styles/main.scss";
import HomePage from "./components/HomePage.tsx";
import MoviesListPage from "./components/MoviesListPage.tsx";
import MoviePage from "./components/MoviePage.tsx";
import NotFoundPage from "./components/NotFoundPage.tsx";
import { useAuthentication } from "./hooks/useAuthentication.ts";

interface AppProps {
  url: string;
}

const App: React.FC<AppProps> = ({ url }) => {
  const { isAuthenticated, loading, error } = useAuthentication();
  const pathname = new URL(url, "http://localhost").pathname;

  if (loading) {
    return <div>Setting up guest session...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (pathname === "/") return <HomePage />;
  if (pathname === "/movies") return <MoviesListPage />;

  const movieMatch = pathname.match(/^\/movies\/(\d+)$/);
  if (movieMatch) {
    return <MoviePage movieId={movieMatch[1]} />;
  }

  return <NotFoundPage />;
};

export default App;
