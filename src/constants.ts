import { Category } from './types.ts';
import StarIcon from "./components/icons/StarIcon.tsx";
import HeartIcon from "./components/icons/HeartIcon.tsx";
import BookmarkIcon from "./components/icons/BookmarkIcon.tsx";

export const BASE_URL = 'http://localhost:3000';

export const REQUEST_TOKEN_KEY = "tmdb_request_token";
export const SESSION_ID_KEY = "tmdb_session_id";
export const ACCOUNT_ID_KEY = "tmdb_account_id";

export const CATEGORIES: Category[] = [
  {
    id: 'upcoming',
    name: 'Upcoming',
    icon: HeartIcon,
    iconColor: 'red',
    bgColor: 'pink',
    fontFamily: 'Raleway, sans-serif',
  },
  {
    id: 'popular',
    name: 'Popular',
    icon: StarIcon,
    iconColor: 'gold',
    bgColor: 'blue',
    fontFamily: 'Poppins, sans-serif',
  },
  {
    id: 'top_rated',
    name: 'Top Rated',
    icon: BookmarkIcon,
    iconColor: 'green',
    bgColor: 'orange',
    fontFamily: 'Playfair Display, serif',
  }
];
