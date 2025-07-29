import { useState, useEffect, useMemo } from "react";
import { useAuthentication } from "../hooks/useAuthentication.ts";
import { useMovieById } from "../hooks/useMovieById.ts";
import { useWishlist } from "../hooks/useWishlist.ts";
import Toast from "../components/Toast.tsx";
import { CATEGORIES } from "../constants.ts";
import { Category } from "../types.ts";
import { useAccountStates } from "../hooks/useAccountStates.ts";
import "../styles/pages/MovieDetailsPage.scss";
import Card from "../components/Card.tsx";
import Loading from "../components/Loading.tsx";
import Error from "../components/Error.tsx";

interface MovieDetailsPageProps {
  movieId: string;
  categoryId: string;
}

const MovieDetailsPage = ({ movieId, categoryId }: MovieDetailsPageProps) => {
  const {
    movieById,
    loading: movieLoading,
    error: movieError,
  } = useMovieById(movieId);

  const {
    sessionId,
    accountId,
    loading: authLoading,
    error: authError,
    getRequestToken,
    redirectToTmdbApproval,
  } = useAuthentication();

  const {
    addToWishlist,
    loading: wishlistLoading,
    error: wishlistError,
    success: wishlistSuccess,
  } = useWishlist();

  const { isMovieInWishlist, loading: accountStatesLoading } =
    useAccountStates();

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
    return (
      CATEGORIES.find((c: Category) => c.id === categoryId) || CATEGORIES[0]
    );
  }, [categoryId]);

  const handleLogin = async () => {
    const requestToken = await getRequestToken();
    if (requestToken) {
      const redirectUrl =
        window.location.origin +
        window.location.pathname +
        window.location.search;
      redirectToTmdbApproval(requestToken, redirectUrl);
    }
  };

  const handleWishlistToggle = async () => {
    if (!accountId || !sessionId) return;
    await addToWishlist({
      accountId,
      sessionId,
      movieId,
      addToWishlist: !isInWishlist,
    });
    setIsInWishlist(!isInWishlist);
  };

  if (movieLoading) <Loading type={"loading-movie-details"} />;

  if (movieError)
    <Error
      icon={"⚠️"}
      title={"Error Loading Movie"}
      error={movieError}
      buttonText={"Try Again"}
      buttonOnClick={() => window.location.reload()}
    />;

  if (!movieById)
    <Error
      icon={"🔍"}
      title={"Movie Not Found"}
      error={"The movie you're looking for doesn't exist or has been removed."}
      buttonText={"Go Back"}
      buttonOnClick={() => window.history.back()}
    />;

  const backdropUrl =
    movieById &&
    `https://image.tmdb.org/t/p/original${movieById.backdrop_path}`;
  const posterUrl =
    movieById && `https://image.tmdb.org/t/p/w500${movieById.poster_path}`;
  const Icon = currentCategory.icon;

  const movieDetailsListItem = [
    {
      label: "Title",
      value: movieById ? movieById.title : "",
    },
    {
      label: "Release Date",
      value: movieById
        ? new Date(movieById.release_date).toLocaleDateString()
        : "",
    },
    {
      label: "Category",
      value: currentCategory.name,
    },
  ];

  const heroBackdropImage = backdropUrl
    ? { backgroundImage: `url(${backdropUrl})` }
    : { backgroundColor: "#64748b" };

  return (
    <div className="movie-details-page">
      {/* Hero Section */}
      {movieById && (
        <section className="movie-hero">
          <div className="hero-backdrop" style={heroBackdropImage} />
          <div className="hero-content">
            <div className="movie-header">
              <div className="movie-poster">
                {posterUrl ? (
                  <img src={posterUrl} alt={movieById.title} loading="lazy" />
                ) : (
                  <div className={"no-poster-image"} />
                )}
              </div>
              <div className="movie-info">
                <h1 className={`movie-title ${currentCategory.id}`}>
                  {movieById.title}
                </h1>
                {movieById.tagline && (
                  <p className="movie-tagline">"{movieById.tagline}"</p>
                )}
                <div className="movie-meta">
                  <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span>
                      {new Date(movieById.release_date).getFullYear()}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">🎬</span>
                    <span>{currentCategory.name}</span>
                  </div>
                </div>
                <div className="movie-actions">
                  <button
                    className="wishlist-button"
                    aria-label={
                      isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                    }
                    onClick={
                      !sessionId || !accountId
                        ? handleLogin
                        : handleWishlistToggle
                    }
                    disabled={
                      authLoading || wishlistLoading || accountStatesLoading
                    }
                  >
                    <Icon
                      size={24}
                      color={isInWishlist ? currentCategory.iconColor : "none"}
                      border={isInWishlist ? "none" : "white"}
                    />
                    {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                  </button>
                  {movieById.homepage && (
                    <a
                      href={movieById.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="homepage-button"
                    >
                      <span className="meta-icon">🌐</span>
                      Visit Homepage
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      {movieById && (
        <main className={`movie-content bg-${currentCategory.id}`}>
          <div className="content-wrapper">
            <div className="main-section">
              {/* Overview Section */}
              <Card icon={"📖"} title={"Overview"}>
                <p className="overview-text">{movieById.overview}</p>
              </Card>

              {/* Category Section */}
              <Card icon={"🎭"} title={"Category"}>
                <div className="category-info">
                  <div className="category-icon">
                    <Icon size={24} color="white" />
                  </div>
                  <div className="category-details">
                    <h3 className="category-name">{currentCategory.name}</h3>
                    <p className="category-description">
                      {currentCategory.description}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="sidebar">
              {/* Movie Details Side-section */}
              <Card icon={"ℹ️"} title={"Movie Details"}>
                <ul className="details-list">
                  {movieDetailsListItem.map((item, index) => (
                    <li key={index} className="detail-item">
                      <span className="detail-label">{item.label}</span>
                      <span className="detail-value">{item.value}</span>
                    </li>
                  ))}
                  {movieById.homepage && (
                    <li className="detail-item">
                      <span className="detail-label">Homepage</span>
                      <span className="detail-value">
                        <a
                          href={movieById.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "inherit",
                            textDecoration: "underline",
                          }}
                        >
                          Visit
                        </a>
                      </span>
                    </li>
                  )}
                </ul>
              </Card>
            </div>
          </div>
        </main>
      )}

      {showWishlistToast && (
        <div className="toast-container">
          {wishlistSuccess ? (
            <Toast
              message={
                isInWishlist
                  ? "Movie added to wishlist!"
                  : "Movie removed from wishlist!"
              }
              color="green"
              onClose={() => setShowWishlistToast(false)}
            />
          ) : wishlistError ? (
            <Toast
              message={`Failed to update wishlist: ${wishlistError}`}
              color="red"
              onClose={() => setShowWishlistToast(false)}
            />
          ) : null}
        </div>
      )}
      {showAuthToast && authError && (
        <div className="toast-container">
          <Toast
            message={`Auth error: ${authError}`}
            color="red"
            onClose={() => setShowAuthToast(false)}
          />
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage;
