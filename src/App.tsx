import { useState, useEffect, FC } from "react";
import "@/styles/main.scss";
import MoviesListPage from "./components/MoviesListPage.tsx";
import MovieDetailsPage from "./components/MovieDetailsPage.tsx";
import NotFoundPage from "./components/NotFoundPage.tsx";
import WishlistedMoviePage from "./components/WishlistPage.tsx";
import NavBar from "./components/NavBar.tsx";
import LogoutPage from "./components/LogoutPage.tsx";

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

  return (
    <>
      <NavBar />
      {pathname === "/" && <MoviesListPage />}
      {pathname === "/wishlist" && <WishlistedMoviePage />}
      {pathname === "/logout" && <LogoutPage />}
      {/^\/([^/]+)\/(\d+)$/.test(pathname) && (() => {
        const movieMatch = pathname.match(/^\/([^/]+)\/(\d+)$/);
        if (movieMatch) {
          const categoryId = movieMatch[1];
          const movieId = movieMatch[2];
          return <MovieDetailsPage movieId={movieId} categoryId={categoryId} />;
        }
        return null;
      })()}
      {!['/', '/wishlist', '/logout'].includes(pathname) && !/^\/([^/]+)\/(\d+)$/.test(pathname) && <NotFoundPage />}
    </>
  );
};

export default App;
