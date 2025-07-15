import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useCallback, useEffect, useRef, StrictMode } from "react";
import { renderToString } from "react-dom/server";
const useMovies = (category = "upcoming") => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchMovies = useCallback(async (pageToFetch = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tmdb/movie/list?category=${category}&page=${pageToFetch}`);
      if (!response.ok) throw new Error("Failed to fetch movies");
      const data = await response.json();
      setMovies((prev) => {
        if (pageToFetch === 1) return data.results;
        const existingIds = new Set(prev.map((m) => m.id));
        const newUnique = data.results.filter((m) => !existingIds.has(m.id));
        return [...prev, ...newUnique];
      });
      setPage(pageToFetch);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [category]);
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setTotalPages(null);
    fetchMovies(1);
  }, [fetchMovies]);
  const loadMore = () => {
    const nextPage = page + 1;
    if (totalPages && nextPage <= totalPages && !loading) {
      fetchMovies(nextPage);
    }
  };
  return { movies, loading, error, loadMore, hasMore: totalPages ? page < totalPages : true };
};
const MovieCard = ({ movie, ref, onClick }) => {
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-testid": "movie-card",
      ref,
      style: {
        flex: "0 0 auto",
        scrollSnapAlign: "start",
        minWidth: 150,
        maxWidth: 150
      },
      onClick: () => onClick(movie.id),
      children: /* @__PURE__ */ jsx(
        "img",
        {
          src: imageUrl,
          alt: movie.title,
          style: { width: "150px" }
        }
      )
    }
  );
};
const Loading = () => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        minWidth: 220,
        maxWidth: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      },
      children: "Loading more movies..."
    }
  );
};
const MovieCarousel = ({
  title,
  category
}) => {
  const { movies, loading, error, loadMore, hasMore } = useMovies(category);
  const observer = useRef(null);
  const lastMovieRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading) {
            loadMore();
          }
        },
        { root: null, rootMargin: "0px", threshold: 1 }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );
  const handleCardClick = (movieId) => {
    window.history.pushState({}, "", `/${movieId}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };
  return /* @__PURE__ */ jsxs("div", { "data-testid": `carousel-${category}`, style: { padding: 16 }, children: [
    /* @__PURE__ */ jsx("h4", { children: title }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "row",
          overflowX: "auto",
          gap: 16,
          padding: "16px 0",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none"
        },
        children: [
          movies.map((movie, idx) => {
            const imageRef = idx === movies.length - 1 ? lastMovieRef : void 0;
            return /* @__PURE__ */ jsx(MovieCard, { movie, ref: imageRef, onClick: handleCardClick }, movie.id);
          }),
          loading && movies.length > 0 && /* @__PURE__ */ jsx(Loading, {})
        ]
      }
    ),
    error && /* @__PURE__ */ jsxs("div", { style: { color: "red" }, children: [
      "Error: ",
      error
    ] }),
    !hasMore && /* @__PURE__ */ jsx("div", { children: "No more movies." })
  ] });
};
const MoviesListPage = () => {
  return /* @__PURE__ */ jsxs("div", { style: { padding: 16 }, children: [
    /* @__PURE__ */ jsx("h2", { children: "Movies" }),
    /* @__PURE__ */ jsx(MovieCarousel, { title: "Upcoming", category: "upcoming" }),
    /* @__PURE__ */ jsx(MovieCarousel, { title: "Popular", category: "popular" }),
    /* @__PURE__ */ jsx(MovieCarousel, { title: "Top Rated", category: "top_rated" })
  ] });
};
const MovieDetailsPage = ({ movieId, category }) => {
  console.log(movieId);
  console.log(category);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("h1", { children: [
      "Movie ID: ",
      movieId
    ] }),
    /* @__PURE__ */ jsx("p", { children: category })
  ] });
};
const NotFoundPage = () => {
  return /* @__PURE__ */ jsx("h1", { children: "404 - Page Not Found" });
};
const GUEST_SESSION_STORAGE_KEY = "tmdb_guest_session";
const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guestSessionId, setGuestSessionId] = useState(null);
  const isSessionExpired = (expiresAt) => {
    const expiryDate = new Date(expiresAt);
    const now = /* @__PURE__ */ new Date();
    return now >= expiryDate;
  };
  const getStoredGuestSession = () => {
    try {
      const stored = localStorage.getItem(GUEST_SESSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };
  const storeGuestSession = (data) => {
    try {
      localStorage.setItem(GUEST_SESSION_STORAGE_KEY, JSON.stringify(data));
    } catch (error2) {
      console.error("Failed to store guest session:", error2);
    }
  };
  const doAuthentication = async () => {
    try {
      setLoading(true);
      setError(null);
      const storedSession = getStoredGuestSession();
      if (storedSession && storedSession.success && !isSessionExpired(storedSession.expires_at)) {
        console.log("Using existing guest session:", storedSession.guest_session_id);
        setIsAuthenticated(true);
        setGuestSessionId(storedSession.guest_session_id);
        setLoading(false);
        return true;
      }
      console.log("Creating new guest session...");
      const response = await fetch("/api/tmdb/guest-session");
      if (!response.ok) {
        throw new Error("Failed to create guest session");
      }
      const data = await response.json();
      console.log("Guest session response:", data);
      if (data.success) {
        storeGuestSession(data);
        setIsAuthenticated(true);
        setGuestSessionId(data.guest_session_id);
        return true;
      } else {
        setIsAuthenticated(false);
        setError("Failed to create guest session");
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      setIsAuthenticated(false);
      console.error("Guest session error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    doAuthentication();
  }, []);
  const clearGuestSession = () => {
    try {
      localStorage.removeItem(GUEST_SESSION_STORAGE_KEY);
      setIsAuthenticated(false);
      setGuestSessionId(null);
    } catch (error2) {
      console.error("Failed to clear guest session:", error2);
    }
  };
  const refreshGuestSession = () => {
    clearGuestSession();
    return doAuthentication();
  };
  return {
    isAuthenticated,
    loading,
    error,
    guestSessionId,
    doAuthentication,
    clearGuestSession,
    refreshGuestSession
  };
};
const App = ({ initialUrl }) => {
  const { loading, error } = useAuthentication();
  const [url, setUrl] = useState(initialUrl);
  useEffect(() => {
    const onPopState = () => {
      const newUrl = window.location.pathname + window.location.search;
      setUrl(newUrl);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [initialUrl]);
  const pathname = new URL(url, "http://localhost").pathname;
  if (loading) {
    return /* @__PURE__ */ jsx("div", { children: "Setting up guest session..." });
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", { children: [
      "Error: ",
      error
    ] });
  }
  if (pathname === "/") return /* @__PURE__ */ jsx(MoviesListPage, {});
  const movieMatch = pathname.match(/^\/(\d+)$/);
  if (movieMatch) {
    return /* @__PURE__ */ jsx(MovieDetailsPage, { movieId: movieMatch[1] });
  }
  return /* @__PURE__ */ jsx(NotFoundPage, {});
};
function render(url) {
  const html = renderToString(
    /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(App, { initialUrl: url }) })
  );
  return html;
}
export {
  render
};
//# sourceMappingURL=entry-server.js.map
