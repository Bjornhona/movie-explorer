import { useState, useEffect, FC } from "react";
import "./styles/main.scss";
import MoviesListPage from "./pages/MoviesListPage.tsx";
import MovieDetailsPage from "./pages/MovieDetailsPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import WishlistedMoviePage from "./pages/WishlistPage.tsx";
import NavBar from "./components/NavBar.tsx";
import Footer from "./components/Footer.tsx";
import LogoutPage from "./pages/LogoutPage.tsx";

interface AppProps {
  initialUrl: string;
  initialMovie?: any;
}

const App: FC<AppProps> = ({ initialUrl, initialMovie }) => {
  const [url, setUrl] = useState<string>(initialUrl);

  useEffect(() => {
    const onPopState = () => {
      const newUrl = window.location.pathname + window.location.search;
      setUrl(newUrl);
    };
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
      {/^\/([^/]+)\/(\d+)$/.test(pathname) &&
        (() => {
          const movieMatch = pathname.match(/^\/([^/]+)\/(\d+)$/);
          if (movieMatch) {
            const categoryId = movieMatch[1];
            const movieId = movieMatch[2];
            return (
              <MovieDetailsPage movieId={movieId} categoryId={categoryId} />
            );
          }
          return null;
        })()}
      {!["/", "/wishlist", "/logout"].includes(pathname) &&
        !/^\/([^/]+)\/(\d+)$/.test(pathname) && <NotFoundPage />}
      <Footer />
    </>
  );
};

export default App;
