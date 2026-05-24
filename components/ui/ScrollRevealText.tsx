'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from 'framer-motion'

export default function ScrollRevealText({
  children,
  className,
  base = 'text-ink-300',
  highlight = 'text-ink-900',
}: {
  children: string
  className?: string
  base?: string
  highlight?: string
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.2'],
  })

  const words = children.split(/(\s+)/)
  const wordCount = words.filter((w) => w.trim().length).length

  if (reduce) {
    return (
      <p ref={ref} className={`${className ?? ''} ${highlight}`}>
        {children}
      </p>
    )
  }

  let visibleIndex = -1
  return (
    <p ref={ref} className={`${className ?? ''} ${base} relative leading-snug`}>
      {words.map((w, i) => {
        if (!w.trim()) return <span key={i}>{w}</span>
        visibleIndex += 1
        const start = visibleIndex / wordCount
        const end = (visibleIndex + 1) / wordCount
        return (
          <Word
            key={i}
            progress={scrollYProgress}
            range={[start, end]}
            highlight={highlight}
          >
            {w}
          </Word>
        )
      })}
    </p>
  )
}

function Word({
  children,
  progress,
  range,
  highlight,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
  highlight: string
}) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <motion.span style={{ opacity }} className={`inline ${highlight}`}>
      {children}
    </motion.span>
  )
}
