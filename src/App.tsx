import { useState, useEffect, FC } from "react";
import "@/styles/App.scss";
import "@/styles/main.scss";
import MoviesListPage from "./components/MoviesListPage.tsx";
import MovieDetailsPage from "./components/MovieDetailsPage.tsx";
import NotFoundPage from "./components/NotFoundPage.tsx";
import { useAuthentication } from "./hooks/useAuthentication.ts";

interface AppProps {
  initialUrl: string;
}

const App: FC<AppProps> = ({ initialUrl }) => {
  const { loading, error } = useAuthentication();
  const [url, setUrl] = useState(initialUrl);

 useEffect(() => {
    const onPopState = () => {
      const newUrl = window.location.pathname + window.location.search;
      setUrl(newUrl);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [initialUrl]);

  const pathname = new URL(url, "http://localhost").pathname;

  if (loading) {
    return <div>Setting up guest session...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (pathname === "/") return <MoviesListPage />;

  const movieMatch = pathname.match(/^\/(\d+)$/);
  if (movieMatch) {
    return <MovieDetailsPage movieId={movieMatch[1]} />;
  }

  return <NotFoundPage />;
};

export default App;
