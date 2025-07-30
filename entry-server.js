import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useCallback, useEffect, forwardRef, useRef, useMemo, StrictMode } from "react";
import { renderToString } from "react-dom/server";
const useMovies = (categoryId = "upcoming") => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchMovies = useCallback(async (pageToFetch = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tmdb/movie/list?category=${categoryId}&page=${pageToFetch}`);
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
  }, [categoryId]);
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
const MovieCard = forwardRef(
  ({ movie, onClick }, ref) => {
    const fallbackImgPath = "/fallback.png";
    const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    const pathname = window.location.pathname;
    const isWishlist = pathname === "/wishlist";
    return /* @__PURE__ */ jsxs(
      "div",
      {
        "data-testid": "movie-card",
        ref,
        className: "item-card movie-card",
        onClick: () => onClick(movie.id),
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: imageUrl ?? fallbackImgPath,
              alt: movie.title,
              className: "item-image movie-poster",
              loading: "lazy",
              onError: (e) => {
                e.target.src = fallbackImgPath;
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "item-info", children: [
            /* @__PURE__ */ jsx("h3", { className: "item-title movie-title", children: movie.title }),
            /* @__PURE__ */ jsxs("div", { className: "item-meta movie-rating", children: [
              !isWishlist && /* @__PURE__ */ jsx("span", { className: "star", children: "★" }),
              !isWishlist && /* @__PURE__ */ jsx("span", { children: movie.vote_average.toFixed(1) }),
              isWishlist && /* @__PURE__ */ jsx("span", { children: new Date(movie.release_date).getFullYear() })
            ] })
          ] })
        ]
      }
    );
  }
);
const Card = ({ icon, title, children }) => {
  return /* @__PURE__ */ jsxs("section", { className: "card-section fade-in", children: [
    (icon || title) && /* @__PURE__ */ jsx("div", { className: "card-header", children: /* @__PURE__ */ jsxs("h2", { children: [
      icon && /* @__PURE__ */ jsx("span", { className: "card-icon", children: icon }),
      title && title
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "card-content", children })
  ] });
};
const Loading = ({
  type = "loading-more",
  spinnerText,
  loadingText
}) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    type === "loading-more" && /* @__PURE__ */ jsx("div", { className: "loading-component", "data-testid": "loading-more-component", children: "Loading more movies..." }),
    type === "loading-state" && /* @__PURE__ */ jsx("div", { className: "movie-details-loading", "data-testid": "loading-state-component", children: /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx("div", { className: "loading-spinner", children: /* @__PURE__ */ jsx("div", { children: spinnerText }) }),
      /* @__PURE__ */ jsx("p", { className: "loading-text", children: loadingText })
    ] }) })
  ] });
};
const handleMovieSelection = (movieId, categoryId) => {
  window.history.pushState({}, "", `/${categoryId}/${movieId}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
};
const MovieCarousel = ({ categoryId }) => {
  const { movies, loading, error, loadMore, hasMore } = useMovies(categoryId);
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
    handleMovieSelection(movieId, categoryId);
  };
  return /* @__PURE__ */ jsxs("div", { "data-testid": `carousel-${categoryId}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "grid-container movies-grid", children: [
      movies.map((movie, idx) => {
        const imageRef = idx === movies.length - 1 ? lastMovieRef : void 0;
        return /* @__PURE__ */ jsx(
          MovieCard,
          {
            movie,
            ref: imageRef,
            onClick: handleCardClick
          },
          movie.id
        );
      }),
      loading && movies.length > 0 && /* @__PURE__ */ jsx("div", { className: "loading-state", children: /* @__PURE__ */ jsx(Loading, {}) })
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "error-state", children: [
      "Error: ",
      error
    ] }),
    !hasMore && movies.length > 0 && /* @__PURE__ */ jsx("div", { className: "empty-state", children: "No more movies to load" })
  ] });
};
const StarIcon = ({ color = "none", border = "white", size = 24, strokeWidth = 2 }) => {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      "aria-label": "star-icon",
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: color,
      stroke: border,
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ jsx("polygon", { points: "12 2 15 8.6 22 9.2 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.2 9 8.6 12 2" })
    }
  );
};
const HeartIcon = ({ color = "none", border = "white", size = 24, strokeWidth = 2 }) => {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      "aria-label": "heart-icon",
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: color,
      stroke: border,
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ jsx("path", { d: "M20.8 4.6c-1.6-1.4-4-1.4-5.6 0L12 7.2 8.8 4.6c-1.6-1.4-4-1.4-5.6 0-1.8 1.6-1.8 4.4 0 6l8.8 8.4 8.8-8.4c1.8-1.6 1.8-4.4 0-6z" })
    }
  );
};
const BookmarkIcon = ({ color = "none", border = "white", size = 24, strokeWidth = 2 }) => {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      "aria-label": "bookmark-icon",
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: color,
      stroke: border,
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ jsx("path", { d: "M6 3h12a1 1 0 0 1 1 1v17l-7-5-7 5V4a1 1 0 0 1 1-1z" })
    }
  );
};
const BASE_URL = "http://localhost:3000";
const REQUEST_TOKEN_KEY = "tmdb_request_token";
const SESSION_ID_KEY = "tmdb_session_id";
const ACCOUNT_ID_KEY = "tmdb_account_id";
const CATEGORIES = [
  {
    id: "upcoming",
    name: "Upcoming",
    description: "Coming soon to theaters near you",
    icon: HeartIcon,
    iconColor: "hotpink"
  },
  {
    id: "popular",
    name: "Popular",
    description: "Trending movies everyone is talking about",
    icon: StarIcon,
    iconColor: "gold"
  },
  {
    id: "top_rated",
    name: "Top Rated",
    description: "Critically acclaimed masterpieces",
    icon: BookmarkIcon,
    iconColor: "aquamarine"
  }
];
const NAVIGATION_LINKS = [
  {
    name: "Movies",
    route: "/"
  },
  {
    name: "My Wishlist",
    route: "/wishlist"
  }
];
const Toast = ({ message, color = "green", duration = 2500, onClose }) => {
  useEffect(() => {
    if (!onClose) return;
    const timeout = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timeout);
  }, [onClose, duration]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      "aria-label": "toast-message",
      className: `toast-message ${color}`,
      children: message
    }
  );
};
const MoviesListPage = () => {
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("logoutSuccess")) {
      setShowLogoutToast(true);
      localStorage.removeItem("logoutSuccess");
    }
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "movies-list-page", children: [
    /* @__PURE__ */ jsx("section", { className: "hero-section", children: /* @__PURE__ */ jsxs("div", { className: "hero-content", children: [
      /* @__PURE__ */ jsx("h1", { children: "Discover Amazing Movies" }),
      /* @__PURE__ */ jsx("p", { className: "hero-subtitle", children: "Explore the latest releases, popular hits, and top-rated films from around the world" })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "main-content", children: /* @__PURE__ */ jsx("div", { className: "content-wrapper", children: CATEGORIES.map((category, index) => /* @__PURE__ */ jsxs(
      "section",
      {
        className: "card-section fade-in",
        style: { animationDelay: `${index * 0.1}s` },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "card-header", children: [
            /* @__PURE__ */ jsxs("h2", { children: [
              /* @__PURE__ */ jsx("span", { className: "card-icon", children: /* @__PURE__ */ jsx(category.icon, { size: 20, color: "white" }) }),
              category.name
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "card-description", children: [
              category.id === "upcoming" && "Coming soon to theaters near you",
              category.id === "popular" && "Trending movies everyone is talking about",
              category.id === "top_rated" && "Critically acclaimed masterpieces"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "card-content", children: /* @__PURE__ */ jsx(
            MovieCarousel,
            {
              categoryId: category.id
            }
          ) })
        ]
      },
      category.id
    )) }) }),
    showLogoutToast && /* @__PURE__ */ jsx("div", { className: "toast-container", children: /* @__PURE__ */ jsx(
      Toast,
      {
        message: "Logout successful!",
        color: "green",
        onClose: () => setShowLogoutToast(false)
      }
    ) })
  ] });
};
const useAuthentication = () => {
  const [sessionId, setSessionId] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getStoredSessionId = () => localStorage.getItem(SESSION_ID_KEY);
    const storedSessionId = getStoredSessionId();
    storedSessionId && setSessionId(storedSessionId);
  }, []);
  useEffect(() => {
    const getStoredAccountId = () => localStorage.getItem(ACCOUNT_ID_KEY);
    const storedAccountId = getStoredAccountId();
    storedAccountId && setAccountId(storedAccountId);
  }, []);
  const getRequestToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tmdb/authentication/token/new");
      const data = await res.json();
      if (data.success && data.request_token) {
        localStorage.setItem(REQUEST_TOKEN_KEY, data.request_token);
        return data.request_token;
      } else {
        throw new Error("Failed to get request token");
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const redirectToTmdbApproval = (requestToken, redirectUrl) => {
    window.location.href = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${encodeURIComponent(redirectUrl)}`;
  };
  const createSession = async (requestToken) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tmdb/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_token: requestToken })
      });
      const data = await res.json();
      if (data.success && data.session_id) {
        setSessionId(data.session_id);
        localStorage.setItem(SESSION_ID_KEY, data.session_id);
        return data.session_id;
      } else {
        throw new Error("Failed to create session");
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const fetchAccountId = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tmdb/account");
      const data = await res.json();
      if (data.id) {
        setAccountId(data.id);
        localStorage.setItem(ACCOUNT_ID_KEY, data.id);
        return data.id;
      } else {
        throw new Error("Failed to get account ID");
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const approved = urlParams.get("approved");
    const requestToken = urlParams.get("request_token") || localStorage.getItem(REQUEST_TOKEN_KEY);
    if (approved === "true" && requestToken && !sessionId) {
      (async () => {
        const newSessionId = await createSession(requestToken);
        if (newSessionId) {
          await fetchAccountId();
        }
      })();
    }
  }, []);
  const logout = () => {
    setSessionId(null);
    setAccountId(null);
    localStorage.removeItem(SESSION_ID_KEY);
    localStorage.removeItem(ACCOUNT_ID_KEY);
    localStorage.removeItem(REQUEST_TOKEN_KEY);
  };
  return {
    sessionId,
    accountId,
    loading,
    error,
    getRequestToken,
    redirectToTmdbApproval,
    logout,
    createSession,
    fetchAccountId
  };
};
const useMovieById = (movieId) => {
  const [movieById, setMovieById] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const getMovieById = async (id, language = "en-US") => {
    setLoading(true);
    setError(null);
    setMovieById(null);
    try {
      const response = await fetch(`/api/tmdb/movie/${id}?language=${language}`);
      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }
      const data = await response.json();
      setMovieById(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      setMovieById(null);
      return null;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getMovieById(movieId);
  }, [movieId]);
  return { movieById, loading, error, getMovieById };
};
const useWishlist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const addToWishlist = async ({ accountId, sessionId, movieId, addToWishlist: addToWishlist2 = true }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/tmdb/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId,
          sessionId,
          movieId,
          addToWishlist: addToWishlist2
        })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update wishlist");
        setSuccess(false);
        return;
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };
  return { addToWishlist, loading, error, success };
};
const useAccountStates = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const isMovieInWishlist = async ({
    movieId,
    sessionId
  }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (!sessionId) {
      return false;
    }
    try {
      const res = await fetch(
        `/api/tmdb/account_states?movieId=${movieId}&session_id=${sessionId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        }
      );
      if (!res.ok) {
        console.error("Failed to check wishlist status");
        return false;
      }
      const data = await res.json();
      return data.watchlist || false;
    } catch (err) {
      console.error("Error checking wishlist status:", err);
      setError(err.message);
      setSuccess(false);
      return false;
    } finally {
      setLoading(false);
    }
  };
  return { isMovieInWishlist, loading, error, success };
};
const Button = ({ onClick, disabled = false, text = "OK", type = "primary" }) => {
  return /* @__PURE__ */ jsx(
    "button",
    {
      className: `button ${type && type}`,
      onClick,
      disabled,
      children: text
    }
  );
};
const Error$1 = ({
  icon = "⚠️",
  title = "Error",
  error = "An error has occured",
  buttonText = "OK",
  buttonOnClick,
  buttonType = "primary"
}) => {
  return /* @__PURE__ */ jsxs(Card, { icon, title, children: [
    /* @__PURE__ */ jsx("p", { className: "error-description", children: error }),
    buttonOnClick && /* @__PURE__ */ jsx(
      Button,
      {
        text: buttonText,
        onClick: buttonOnClick,
        type: buttonType
      }
    )
  ] });
};
const MovieDetailsPage = ({ movieId, categoryId }) => {
  const {
    movieById,
    loading: movieLoading
  } = useMovieById(movieId);
  const {
    sessionId,
    accountId,
    loading: authLoading,
    error: authError,
    getRequestToken,
    redirectToTmdbApproval
  } = useAuthentication();
  const {
    addToWishlist,
    loading: wishlistLoading,
    error: wishlistError,
    success: wishlistSuccess
  } = useWishlist();
  const { isMovieInWishlist, loading: accountStatesLoading } = useAccountStates();
  const [showWishlistToast, setShowWishlistToast] = useState(false);
  const [showAuthToast, setShowAuthToast] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!sessionId || !movieId) {
        setIsInWishlist(false);
        return;
      }
      try {
        const inWishlist = await isMovieInWishlist({ movieId, sessionId });
        setIsInWishlist(inWishlist);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
        setIsInWishlist(false);
      }
    };
    checkWishlistStatus();
  }, [movieId, sessionId]);
  useEffect(() => {
    if (wishlistSuccess) {
      setShowWishlistToast(true);
      const timeout = setTimeout(() => setShowWishlistToast(false), 2500);
      return () => clearTimeout(timeout);
    }
  }, [wishlistSuccess]);
  useEffect(() => {
    if (wishlistError) {
      setShowWishlistToast(true);
      const timeout = setTimeout(() => setShowWishlistToast(false), 2500);
      return () => clearTimeout(timeout);
    }
  }, [wishlistError]);
  useEffect(() => {
    if (authError) {
      setShowAuthToast(true);
      const timeout = setTimeout(() => setShowAuthToast(false), 2500);
      return () => clearTimeout(timeout);
    }
  }, [authError]);
  const currentCategory = useMemo(() => {
    return CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];
  }, [categoryId]);
  const handleLogin = async () => {
    const requestToken = await getRequestToken();
    if (requestToken) {
      const redirectUrl = window.location.origin + window.location.pathname + window.location.search;
      redirectToTmdbApproval(requestToken, redirectUrl);
    }
  };
  const handleWishlistToggle = async () => {
    if (!accountId || !sessionId) return;
    await addToWishlist({
      accountId,
      sessionId,
      movieId,
      addToWishlist: !isInWishlist
    });
    setIsInWishlist(!isInWishlist);
  };
  if (movieLoading) {
    return /* @__PURE__ */ jsx(
      Loading,
      {
        type: "loading-state",
        spinnerText: "Loading movie details...",
        loadingText: "Please wait while we fetch the movie information"
      }
    );
  }
  const backdropUrl = movieById && `https://image.tmdb.org/t/p/original${movieById.backdrop_path}`;
  const posterUrl = movieById && `https://image.tmdb.org/t/p/w500${movieById.poster_path}`;
  const Icon = currentCategory.icon;
  const movieDetailsListItem = [
    {
      label: "Title",
      value: movieById ? movieById.title : ""
    },
    {
      label: "Release Date",
      value: movieById ? new Date(movieById.release_date).toLocaleDateString() : ""
    },
    {
      label: "Category",
      value: currentCategory.name
    }
  ];
  const heroBackdropImage = backdropUrl ? { backgroundImage: `url(${backdropUrl})` } : { backgroundColor: "#64748b" };
  return /* @__PURE__ */ jsxs("div", { className: "movie-details-page", children: [
    movieById && /* @__PURE__ */ jsxs("section", { className: "movie-hero", children: [
      /* @__PURE__ */ jsx("div", { className: "hero-backdrop", style: heroBackdropImage }),
      /* @__PURE__ */ jsx("div", { className: "hero-content", children: /* @__PURE__ */ jsxs("div", { className: "movie-header", children: [
        /* @__PURE__ */ jsx("div", { className: "movie-poster", children: posterUrl ? /* @__PURE__ */ jsx("img", { src: posterUrl, alt: movieById.title, loading: "lazy" }) : /* @__PURE__ */ jsx("div", { className: "no-poster-image" }) }),
        /* @__PURE__ */ jsxs("div", { className: "movie-info", children: [
          /* @__PURE__ */ jsx("h1", { className: `movie-title ${currentCategory.id}`, children: movieById.title }),
          movieById.tagline && /* @__PURE__ */ jsxs("p", { className: "movie-tagline", children: [
            '"',
            movieById.tagline,
            '"'
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "movie-meta", children: [
            /* @__PURE__ */ jsxs("div", { className: "meta-item", children: [
              /* @__PURE__ */ jsx("span", { className: "meta-icon", children: "📅" }),
              /* @__PURE__ */ jsx("span", { children: new Date(movieById.release_date).getFullYear() })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "meta-item", children: [
              /* @__PURE__ */ jsx("span", { className: "meta-icon", children: "🎬" }),
              /* @__PURE__ */ jsx("span", { children: currentCategory.name })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "movie-actions", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                className: "wishlist-button",
                "aria-label": isInWishlist ? "Remove from wishlist" : "Add to wishlist",
                onClick: !sessionId || !accountId ? handleLogin : handleWishlistToggle,
                disabled: authLoading || wishlistLoading || accountStatesLoading,
                children: [
                  /* @__PURE__ */ jsx(
                    Icon,
                    {
                      size: 24,
                      color: isInWishlist ? currentCategory.iconColor : "none",
                      border: isInWishlist ? "none" : "white"
                    }
                  ),
                  isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"
                ]
              }
            ),
            movieById.homepage && /* @__PURE__ */ jsxs(
              "a",
              {
                href: movieById.homepage,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "homepage-button",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "meta-icon", children: "🌐" }),
                  "Visit Homepage"
                ]
              }
            )
          ] })
        ] })
      ] }) })
    ] }),
    movieById && /* @__PURE__ */ jsx(
      "main",
      {
        "data-testid": "movie-details-content",
        className: `movie-content bg-${currentCategory.id}`,
        children: /* @__PURE__ */ jsxs("div", { className: "content-wrapper", children: [
          /* @__PURE__ */ jsxs("div", { className: "main-section", children: [
            /* @__PURE__ */ jsx(Card, { icon: "📖", title: "Overview", children: /* @__PURE__ */ jsx("p", { className: "overview-text", children: movieById.overview }) }),
            /* @__PURE__ */ jsx(Card, { icon: "🎭", title: "Category", children: /* @__PURE__ */ jsxs("div", { className: "category-info", children: [
              /* @__PURE__ */ jsx("div", { className: "category-icon", children: /* @__PURE__ */ jsx(Icon, { size: 24, color: "white" }) }),
              /* @__PURE__ */ jsxs("div", { className: "category-details", children: [
                /* @__PURE__ */ jsx("h3", { className: "category-name", children: currentCategory.name }),
                /* @__PURE__ */ jsx("p", { className: "category-description", children: currentCategory.description })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "sidebar", children: /* @__PURE__ */ jsx(Card, { icon: "ℹ️", title: "Movie Details", children: /* @__PURE__ */ jsxs("ul", { className: "details-list", children: [
            movieDetailsListItem.map((item, index) => /* @__PURE__ */ jsxs("li", { className: "detail-item", children: [
              /* @__PURE__ */ jsx("span", { className: "detail-label", children: item.label }),
              /* @__PURE__ */ jsx("span", { className: "detail-value", children: item.value })
            ] }, index)),
            movieById.homepage && /* @__PURE__ */ jsxs("li", { className: "detail-item", children: [
              /* @__PURE__ */ jsx("span", { className: "detail-label", children: "Homepage" }),
              /* @__PURE__ */ jsx("span", { className: "detail-value", children: /* @__PURE__ */ jsx(
                "a",
                {
                  href: movieById.homepage,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  style: {
                    color: "inherit",
                    textDecoration: "underline"
                  },
                  children: "Visit"
                }
              ) })
            ] })
          ] }) }) })
        ] })
      }
    ),
    showWishlistToast && /* @__PURE__ */ jsx("div", { className: "toast-container", children: wishlistSuccess ? /* @__PURE__ */ jsx(
      Toast,
      {
        message: isInWishlist ? "Movie added to wishlist!" : "Movie removed from wishlist!",
        color: "green",
        onClose: () => setShowWishlistToast(false)
      }
    ) : wishlistError ? /* @__PURE__ */ jsx(
      Toast,
      {
        message: `Failed to update wishlist: ${wishlistError}`,
        color: "red",
        onClose: () => setShowWishlistToast(false)
      }
    ) : null }),
    showAuthToast && authError && /* @__PURE__ */ jsx("div", { className: "toast-container", children: /* @__PURE__ */ jsx(
      Toast,
      {
        message: `Auth error: ${authError}`,
        color: "red",
        onClose: () => setShowAuthToast(false)
      }
    ) })
  ] });
};
const NotFoundPage = () => {
  return /* @__PURE__ */ jsx("h1", { children: "404 - Page Not Found" });
};
const useWishlistMovies = (accountId, sessionId, reloadKey = 0) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchMovies = useCallback(async (pageToFetch = 1) => {
    if (!accountId || !sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tmdb/wishlist?accountId=${accountId}&sessionId=${sessionId}&page=${pageToFetch}`);
      if (!response.ok) throw new Error("Failed to fetch wishlist movies");
      const data = await response.json();
      setMovies((prev) => {
        if (pageToFetch === 1) return data.results;
        const existingIds = new Set(prev.map((m) => m.id));
        const newUnique = data.results.filter((m) => !existingIds.has(m.id));
        return [...prev, ...newUnique];
      });
      setPage(data.page);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [accountId, sessionId]);
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setTotalPages(null);
    fetchMovies(1);
  }, [fetchMovies, reloadKey]);
  const loadMore = () => {
    if (totalPages && page < totalPages && !loading) {
      fetchMovies(page + 1);
    }
  };
  return { movies, loading, error, loadMore, hasMore: totalPages ? page < totalPages : true };
};
const WishlistedMoviePage = () => {
  const {
    loading: authLoading,
    accountId,
    sessionId,
    getRequestToken,
    redirectToTmdbApproval
  } = useAuthentication();
  const { movies, error, loading, loadMore, hasMore } = useWishlistMovies(
    accountId,
    sessionId
  );
  const observer = useRef(null);
  const handleGetNewToken = async () => {
    const requestToken = await getRequestToken();
    if (requestToken) {
      const redirectUrl = window.location.origin + window.location.pathname + window.location.search;
      redirectToTmdbApproval(requestToken, redirectUrl);
    }
  };
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
    handleMovieSelection(movieId, "popular");
  };
  return /* @__PURE__ */ jsxs("div", { className: "wishlist-page", children: [
    /* @__PURE__ */ jsx("section", { className: "hero-section", children: /* @__PURE__ */ jsxs("div", { className: "hero-content", children: [
      /* @__PURE__ */ jsx("h1", { children: "My Wishlist" }),
      /* @__PURE__ */ jsx("p", { className: "hero-subtitle", children: "Your personal collection of movies you want to watch" })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "main-content", children: /* @__PURE__ */ jsxs("div", { className: "content-wrapper", children: [
      !sessionId && !accountId && /* @__PURE__ */ jsxs(Card, { icon: "🔐", title: "Authentication Required", children: [
        /* @__PURE__ */ jsx("p", { className: "auth-message", children: "To view your wishlist, you need to be logged in with your TMDB account." }),
        /* @__PURE__ */ jsx(
          Button,
          {
            text: authLoading ? "Connecting..." : "Login with TMDB",
            disabled: authLoading,
            onClick: handleGetNewToken
          }
        )
      ] }),
      authLoading && /* @__PURE__ */ jsx(
        Loading,
        {
          type: "loading-state",
          spinnerText: "Loading authentication...",
          loadingText: "Please wait while we connect to TMDB"
        }
      ),
      error && /* @__PURE__ */ jsx(
        Error$1,
        {
          icon: "⚠️",
          title: "Error Loading Wishlist",
          error: `Error: ${error}`,
          buttonText: "Try Again",
          buttonOnClick: handleGetNewToken,
          buttonType: "secondary"
        }
      ),
      sessionId && accountId && /* @__PURE__ */ jsxs(Card, { title: "My Wishlist", icon: "❤️", children: [
        movies.length === 0 && !loading && /* @__PURE__ */ jsx("div", { className: "empty-wishlist", children: /* @__PURE__ */ jsxs("div", { className: "card-content", children: [
          /* @__PURE__ */ jsx("div", { className: "empty-icon", children: "📽️" }),
          /* @__PURE__ */ jsx("h3", { className: "empty-title", children: "Your wishlist is empty" }),
          /* @__PURE__ */ jsx("p", { className: "empty-description", children: "Start building your collection by browsing movies and adding them to your wishlist." }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "browse-button",
              onClick: () => window.location.href = "/",
              children: "Browse Movies"
            }
          )
        ] }) }),
        movies.length > 0 && /* @__PURE__ */ jsxs("div", { className: "grid-container wishlist-grid", children: [
          movies.map((movie, idx) => {
            const movieRef = idx === movies.length - 1 ? lastMovieRef : void 0;
            return /* @__PURE__ */ jsx(
              MovieCard,
              {
                movie,
                ref: movieRef,
                onClick: handleCardClick
              },
              movie.id
            );
          }),
          loading && /* @__PURE__ */ jsx("div", { className: "loading-state", children: /* @__PURE__ */ jsx("div", { children: "Loading more movies..." }) })
        ] })
      ] })
    ] }) })
  ] });
};
const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    setCurrentPath(window.location.pathname);
  }, []);
  useEffect(() => {
    if (!isClient) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isClient]);
  useEffect(() => {
    if (!isClient) return;
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isClient]);
  const handleNav = (path) => {
    if (!isClient) return;
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
    setCurrentPath(path);
  };
  const getNavIcon = (route) => {
    switch (route) {
      case "/":
        return "🎬";
      case "/wishlist":
        return "❤️";
      default:
        return "📱";
    }
  };
  return /* @__PURE__ */ jsx("nav", { className: `navbar ${isScrolled ? "scrolled" : ""}`, children: /* @__PURE__ */ jsxs("div", { className: "navbar-container", children: [
    /* @__PURE__ */ jsxs("div", { className: "navbar-brand", onClick: () => handleNav("/"), children: [
      /* @__PURE__ */ jsx("div", { className: "brand-logo", children: "🎬" }),
      /* @__PURE__ */ jsx("span", { className: "brand-text", children: "MovieExplorer" })
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "navbar-nav", children: NAVIGATION_LINKS.map((navLink, index) => /* @__PURE__ */ jsx("li", { className: "nav-item", children: /* @__PURE__ */ jsxs(
      "div",
      {
        className: `nav-link ${currentPath === navLink.route ? "active" : ""}`,
        onClick: () => handleNav(navLink.route),
        children: [
          /* @__PURE__ */ jsx("span", { className: "nav-icon", children: getNavIcon(navLink.route) }),
          /* @__PURE__ */ jsx("span", { className: "nav-text", children: navLink.name })
        ]
      }
    ) }, index)) })
  ] }) });
};
const Footer = () => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsx("footer", { className: "footer", children: /* @__PURE__ */ jsxs("div", { className: "footer-container", children: [
    /* @__PURE__ */ jsxs("div", { className: "footer-content", children: [
      /* @__PURE__ */ jsxs("div", { className: "footer-brand", children: [
        /* @__PURE__ */ jsx("div", { className: "brand-logo", children: "🎬" }),
        /* @__PURE__ */ jsxs("div", { className: "brand-info", children: [
          /* @__PURE__ */ jsx("h3", { className: "brand-name", children: "MovieExplorer" }),
          /* @__PURE__ */ jsx("p", { className: "brand-tagline", children: "Discover your next favorite movie" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "footer-links", children: /* @__PURE__ */ jsxs("div", { className: "footer-section", children: [
        /* @__PURE__ */ jsx("h4", { className: "section-title", children: "Navigation" }),
        /* @__PURE__ */ jsxs("ul", { className: "link-list", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/", className: "footer-link", children: "Movies" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/wishlist", className: "footer-link", children: "My Wishlist" }) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "footer-bottom", children: /* @__PURE__ */ jsxs("div", { className: "footer-info", children: [
      /* @__PURE__ */ jsxs("p", { className: "copyright", children: [
        "© ",
        currentYear,
        " MovieExplorer. All rights reserved."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "powered-by", children: "Powered by TMDB API" })
    ] }) })
  ] }) });
};
const LogoutPage = () => {
  const { accountId, logout } = useAuthentication();
  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    if (!accountId) {
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, [accountId]);
  const handleLogout = () => {
    logout();
    setShowToast(true);
    localStorage.setItem("logoutSuccess", "1");
    setTimeout(() => {
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }, 1e3);
  };
  return /* @__PURE__ */ jsxs("div", { className: "logout-component", children: [
    /* @__PURE__ */ jsxs(Card, { icon: "🔐", title: "Log out", children: [
      /* @__PURE__ */ jsx("p", { className: "auth-message", children: "If you log out you will not be able to see your wishlist. You can login again at any moment by just navigating to My Wishlist." }),
      /* @__PURE__ */ jsx(Button, { text: "Logout", onClick: handleLogout })
    ] }),
    showToast && /* @__PURE__ */ jsx(
      Toast,
      {
        message: "Logout successful!",
        color: "green",
        onClose: () => setShowToast(false)
      }
    )
  ] });
};
const App = ({ initialUrl, initialMovie }) => {
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(NavBar, {}),
    pathname === "/" && /* @__PURE__ */ jsx(MoviesListPage, {}),
    pathname === "/wishlist" && /* @__PURE__ */ jsx(WishlistedMoviePage, {}),
    pathname === "/logout" && /* @__PURE__ */ jsx(LogoutPage, {}),
    /^\/([^/]+)\/(\d+)$/.test(pathname) && (() => {
      const movieMatch = pathname.match(/^\/([^/]+)\/(\d+)$/);
      if (movieMatch) {
        const categoryId = movieMatch[1];
        const movieId = movieMatch[2];
        return /* @__PURE__ */ jsx(MovieDetailsPage, { movieId, categoryId });
      }
      return null;
    })(),
    !["/", "/wishlist", "/logout"].includes(pathname) && !/^\/([^/]+)\/(\d+)$/.test(pathname) && /* @__PURE__ */ jsx(NotFoundPage, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
async function render(url) {
  const pathname = new URL(url, BASE_URL).pathname;
  let initialMovie = null;
  const movieMatch = pathname.match(/^\/([^/]+)\/(\d+)$/);
  if (movieMatch) {
    const movieId = movieMatch[2];
    const res = await fetch(`${BASE_URL}/api/tmdb/movie/${movieId}`);
    initialMovie = await res.json();
  }
  const html = renderToString(
    /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(App, { initialUrl: url, initialMovie }) })
  );
  return html;
}
export {
  render
};
//# sourceMappingURL=entry-server.js.map
