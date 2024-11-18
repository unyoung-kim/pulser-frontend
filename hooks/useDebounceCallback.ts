import { useCallback, useRef } from "react";

export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options?: {
    onStart?: () => void;
  }
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      options?.onStart?.();

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay, options?.onStart]
  );
}
