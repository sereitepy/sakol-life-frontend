import { useEffect, RefObject } from 'react'

/**
 * TODO: this is from the official document btw
 * Smooth-scrolls `anchorRef` into view whenever `trigger` changes.
 * The ref should point to an invisible element at the very top of the page/section.
 *
 * Reusable anywhere — works with any ref + any trigger.
 *
 * @example
 * const topRef = useRef<HTMLDivElement>(null)
 * useScrollToTop(topRef, currentIndex)
 */
export function useScrollToTop(
  anchorRef: RefObject<HTMLElement | null>,
  trigger: unknown
) {
  useEffect(() => {
    anchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [trigger]) // eslint-disable-line react-hooks/exhaustive-deps
}
