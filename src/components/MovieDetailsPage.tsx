import { useState } from 'react';
import { MovieDetailsProps } from "../types.ts";
import { useEffect } from "react";
import StarIcon from './icons/StarIcon.tsx';
import HeartIcon from './icons/HeartIcon.tsx';
import BookmarkIcon from "./icons/BookmarkIcon.tsx";
import { getBackgroundColor } from "../functions.ts";
import { useAuthentication } from '../hooks/useAuthentication.ts';
import { useMovieById } from '../hooks/useMovieById.ts';
import { BASE_URL } from '../constants.ts';

interface SessionTypes {
  success: boolean;
  session_id: string;
  expires_at: string;
}

const MovieDetailsPage = ({
  movieId,
  category,
}: MovieDetailsProps) => {
  const { movieById, getMovieById, loading } = useMovieById();
  const { doRequestToken, createSession, getStoredSession } = useAuthentication();

  const sessionData = getStoredSession();
  console.log(sessionData);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
      const isApproved = params.get('approved');
      isApproved && createSession();
  }, []);

  useEffect(() => {
    getMovieById(movieId);
  }, [movieId]);

  const handleAddToWishlist = async () => {
    const token = await doRequestToken();
    if (!token) {
      alert('Could not get a valid request token. Try again.');
      return;
    }
    window.location.href = `https://www.themoviedb.org/authenticate/${token}?redirect_to=${BASE_URL}/${category}/${movieId}`;
  };

  const getWishlistIcon = () => {
    switch (category) {
      case 'upcoming':
        return <HeartIcon color={'red'} />;
      case 'popular':
        return <StarIcon color={'gold'} />;
      default:
        return <BookmarkIcon color={'teal'} />;
    }
  }

  if (loading && !movieById) return <p>Loading...</p>;

  return (
    <div data-testid={'movie-details'} style={{ backgroundColor: getBackgroundColor(category) }}>
      <h1>{movieById?.title}</h1>
      <p>{category}</p>
        <button aria-label="Add to wishlist" onClick={handleAddToWishlist}>
          {getWishlistIcon()}
        </button>
    </div>
  );
};

export default MovieDetailsPage;
