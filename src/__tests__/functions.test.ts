import { handleMovieSelection } from '../functions.ts';

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
