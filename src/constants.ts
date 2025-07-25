import { Category } from './types.ts'

export const BASE_URL = 'http://localhost:3000';

export const REQUEST_TOKEN_KEY = "tmdb_request_token";
export const SESSION_ID_KEY = "tmdb_session_id";
export const ACCOUNT_ID_KEY = "tmdb_account_id";

export const CATEGORIES: Category[] = [
  {
    id: 'upcoming',
    name: 'Upcoming',
    icon: 'star-icon',
    iconColor: 'gold',
    bgColor: 'pink',
    fontFamily: 'Poppins, sans-serif',
  },
  {
    id: 'popular',
    name: 'Popular',
    icon: 'star-icon',
    iconColor: 'gold',
    bgColor: 'blue',
    fontFamily: 'Poppins, sans-serif',
  },
    {
    id: 'top_rated',
    name: 'Top Rated',
    icon: 'star-icon',
    iconColor: 'gold',
    bgColor: 'orange',
    fontFamily: 'Poppins, sans-serif',
  }
];
