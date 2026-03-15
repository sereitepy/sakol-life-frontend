import { useRef } from "react"

  // Top of the scroll container — used for smooth scroll-to-top on advance

  export const scrollTopRef = useRef<HTMLDivElement>(null)
  // Container for answer option list — GSAP stagger target
  const optionsRef = useRef<HTMLDivElement>(null)
  // Individual group row refs — keyed by index
  const groupRowRefs = useRef<(HTMLDivElement | null)[]>([])