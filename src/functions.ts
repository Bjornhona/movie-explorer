export const getBackgroundColor = (category: string) => {
  switch (category) {
    case 'upcoming':
      return 'pink';
    case 'popular':
      return 'blue';
    default:
      return 'orange'
  }
}

export const handleMovieSelection = (movieId: number, category: string) => {
  window.history.pushState({}, "", `/${category}/${movieId}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
};