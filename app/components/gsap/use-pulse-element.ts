import { useCallback } from 'react'
import gsap from 'gsap'

interface UsePulseElementOptions {
  scale?: number
  duration?: number
  ease?: string
  /** ms to wait after scrollIntoView before pulsing (lets scroll settle) */
  scrollDelay?: number
  scrollBlock?: ScrollLogicalPosition
}

/**
 * TODO: this is from the official document btw
 * Returns a `pulse(el)` function that:
 *   1. Smooth-scrolls the element to the centre of the viewport.
 *   2. After a short delay (for scroll to settle), plays a GSAP scale yoyo.
 *
 * Reusable anywhere — call `pulse(someRef.current)` from any handler.
 *
 * @example
 * const pulse = usePulseElement()
 * pulse(groupRowRefs.current[nextIdx])
 */
export function usePulseElement({
  scale = 1.03,
  duration = 0.18,
  ease = 'power1.out',
  scrollDelay = 320,
  scrollBlock = 'center',
}: UsePulseElementOptions = {}) {
  return useCallback(
    (el: HTMLElement | null) => {
      if (!el) return

      el.scrollIntoView({ behavior: 'smooth', block: scrollBlock })

      setTimeout(() => {
        gsap.fromTo(
          el,
          { scale: 1 },
          { scale, duration, ease, yoyo: true, repeat: 1 }
        )
      }, scrollDelay)
    },
    [scale, duration, ease, scrollDelay, scrollBlock]
  )
}
