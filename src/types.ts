import type { JSX, SVGProps } from "react";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  tagline: string;
  backdrop_path: string;
  release_date: string;
  homepage: string;
}

export interface MovieCardProps {
  movie: Movie;
  onClick: (movieId: number) => void;
}

export interface MovieDetailsProps {
  movieId: string;
  categoryId: string;
}

export interface IconProps {
  color?: string;
  size?: number;
  strokeWidth?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: (props: IconProps) => JSX.Element;
  iconColor: string;
  bgColor: string;
  fontFamily: string;
}

export interface NavigationLink {
  name: string;
  route: string;
}
