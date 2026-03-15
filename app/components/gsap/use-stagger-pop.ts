import { useEffect, RefObject } from 'react'
import gsap from 'gsap'

// TODO: this is from the official document btw

interface UseStaggerPopOptions {
  /** How far down (px) items start before animating up */
  fromY?: number
  /** Duration of each item's animation in seconds */
  duration?: number
  /** Delay between each item in seconds */
  stagger?: number
  /** Initial delay before the first item starts */
  delay?: number
  /** GSAP easing string */
  ease?: string
}

/**
 * Animates all direct children of `containerRef` into view with a staggered
 * slide-up + fade-in on every change of `trigger`.
 *
 * Reusable anywhere — pass any container ref and any trigger value.
 *
 * @example
 * const listRef = useRef<HTMLDivElement>(null)
 * useStaggerPop(listRef, currentIndex)
 */
export function useStaggerPop(
  containerRef: RefObject<HTMLElement | null>,
  trigger: unknown,
  {
    fromY = 24,
    duration = 0.38,
    stagger = 0.07,
    delay = 0.05,
    ease = 'power2.out',
  }: UseStaggerPopOptions = {}
) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const items = Array.from(container.children) as HTMLElement[]
    if (items.length === 0) return

    gsap.killTweensOf(items)
    gsap.set(items, { opacity: 0, y: fromY })
    gsap.to(items, { opacity: 1, y: 0, duration, ease, stagger, delay })

    return () => {
      gsap.killTweensOf(items)
    }
  }, [trigger]) // eslint-disable-line react-hooks/exhaustive-deps
}
