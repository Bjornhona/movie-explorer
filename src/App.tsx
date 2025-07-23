import { useState, useEffect, FC } from "react";
import "@/styles/App.scss";
import "@/styles/main.scss";
import MoviesListPage from "./components/MoviesListPage.tsx";
import MovieDetailsPage from "./components/MovieDetailsPage.tsx";
import NotFoundPage from "./components/NotFoundPage.tsx";
import WishlistedMoviePage from "./components/WishlistedMoviePage.tsx";

interface AppProps {
  initialUrl: string;
  initialMovie?: any;
}

const App: FC<AppProps> = ({ initialUrl, initialMovie }) => {
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

  if (pathname === "/") return <MoviesListPage />;
  if (pathname === "/wishlist") return <WishlistedMoviePage />;

  const movieMatch = pathname.match(/^\/([^/]+)\/(\d+)$/);

  if (movieMatch) {
    const category = movieMatch[1];
    const movieId = movieMatch[2];
    return <MovieDetailsPage movieId={movieId} category={category} />;
  }

  return <NotFoundPage />;
};

export default App;
