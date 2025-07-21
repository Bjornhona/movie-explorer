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
