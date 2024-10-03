import { useCallback } from 'react';
import { debounce } from 'lodash';

/*
 * Debounce a callback function. Useful for preventing a function from being
 * called too frequently, such as when a user is typing.
 *
 * Note: Be sure to pass a stable reference (wrapped in a useCallback) to the
 * debounced function to avoid re-creating the debounced function on every
 * render.
 */
export function useDebouncedCallback<T extends (...args: any) => any>(
  debounced: T,
  timeout = 500,
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(debounce(debounced, timeout), [debounced]);
}
