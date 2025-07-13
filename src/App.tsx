import React from "react";
import '@/styles/App.scss';
import '@/styles/main.scss';

interface AppProps {
  url: string;
}

const App: React.FC<AppProps> = ({ url }) => {
  const pathname = new URL(url, "http://localhost").pathname;

  if (pathname === "/") return <h1>Home</h1>;
  if (pathname === "/movies") return <h1>Movies List</h1>;

  const movieMatch = pathname.match(/^\/movies\/(\d+)$/);
  if (movieMatch) {
    return <h1>Movie ID: {movieMatch[1]}</h1>;
  }

  return <h1>404 - Not Found</h1>;
};

export default App;
