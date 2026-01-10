import { useEffect, useState } from "react"

// Custom hook to check if a media query matches
export function useMediaQuery(query: string) {

  // Initialize state with current match status
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia(query).matches
  })

  // Update matches state on media query change
  useEffect(() => {
    const media = window.matchMedia(query)

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}
