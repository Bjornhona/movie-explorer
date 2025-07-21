import { Ref } from 'react';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  tagline: string;
  backdrop_path: string;
  release_date: Date;
}

export interface MovieCardProps {
  movie: Movie;
  ref: Ref<HTMLDivElement> | undefined;
  onClick: (movieId: number) => void;
}

export interface MovieDetailsProps {
  movieId: string;
  initialMovie?: Movie;
  category: string;
}

export interface IconProps {
  color?: string;
  size?: number;
  strokeWidth?: number;
}