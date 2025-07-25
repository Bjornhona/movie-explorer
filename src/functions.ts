export const handleMovieSelection = (movieId: number, categoryId: string) => {
  window.history.pushState({}, "", `/${categoryId}/${movieId}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
};