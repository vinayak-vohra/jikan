"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook that listens to a media query and returns whether it matches.
 *
 * @param {string} query - The media query string to evaluate.
 * @returns {boolean} - A boolean indicating whether the media query matches.
 *
 * @example
 * const isLargeScreen = useMediaQuery('(min-width: 1024px)');
 * console.log(isLargeScreen); // true or false based on the screen width
 *
 * @remarks
 * This hook uses the `window.matchMedia` API to evaluate the media query and
 * listens for changes to update the state accordingly. It ensures compatibility
 * with server-side rendering by checking if the `window` object is available.
 */
export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if the window object is available (prevents errors on the server-side)
    if (typeof window === "undefined") return;

    // Create a MediaQueryList object
    const mediaQueryList = window.matchMedia(query);

    // Define a listener to update state on changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value
    setMatches(mediaQueryList.matches);

    // Add event listener for changes to the media query
    mediaQueryList.addEventListener("change", handleChange);

    // Clean up the event listener when the component unmounts
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}
