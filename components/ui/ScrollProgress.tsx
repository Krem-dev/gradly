'use client'

import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'

export default function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 30, mass: 0.3 })

  if (reduce) return null

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-amber origin-left pointer-events-none"
    />
  )
}
