export const getBackgroundColor = (category: string) => {
  switch (category) {
    case 'upcoming':
      return 'light-pink';
    case 'popular':
      return 'light-blue';
    default:
      return 'light-orange'
  }
}

export const handleMovieSelection = (movieId: number, category: string) => {
  window.history.pushState({}, "", `/${category}/${movieId}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
};