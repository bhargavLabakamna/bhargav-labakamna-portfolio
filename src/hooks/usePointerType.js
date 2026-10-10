import { useEffect, useState } from 'react'

// Detects whether the primary input supports fine hover (desktop/laptop)
// vs. a coarse touch pointer — used to disable the custom cursor and
// mouse-parallax effects on mobile / tablet / touch devices.
export function useIsFinePointer() {
  const [isFine, setIsFine] = useState(true)

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    setIsFine(query.matches)
    const handler = (e) => setIsFine(e.matches)
    query.addEventListener('change', handler)
    return () => query.removeEventListener('change', handler)
  }, [])

  return isFine
}
