import { getBackgroundColor, handleMovieSelection } from '../functions.ts';

describe('Testing getBackgroundColor function', () => {
  it('returns pink for categoryupcoming', () => {
    expect(getBackgroundColor('upcoming')).toBe('pink');
  });
  it('returns blue for category popular', () => {
    expect(getBackgroundColor('popular')).toBe('blue');
  });
  it('returns orange for any other category', () => {
    expect(getBackgroundColor('top_rated')).toBe('orange');
    expect(getBackgroundColor('anything')).toBe('orange');
  });
});

describe('Testing handleMovieSelection function', () => {
  beforeEach(() => {
    vi.spyOn(window.history, 'pushState');
    vi.spyOn(window, 'dispatchEvent');
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('updates the URL and dispatches popstate', () => {
    handleMovieSelection(123, 'popular');
    expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/popular/123');
    expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(PopStateEvent));
  });
});
