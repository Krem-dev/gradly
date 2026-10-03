'use client'

import { useEffect, useRef, useState } from 'react'
import {
  createPresenceComponent,
  motionTokens,
  makeStyles,
  mergeClasses,
} from '@fluentui/react-components'
import { gradlyMotion, gradlyTokens, REVEAL_DISTANCE } from '@/lib/fluent'

/* ─────────────────────── Presence (enter / exit) ─────────────────────── */

/**
 * Fluent presence components animate a child in and out via the Web Animations
 * API and honour `prefers-reduced-motion` themselves (duration collapses to 1ms
 * unless a `reducedMotion` block is supplied), which is why these are built on
 * `createPresenceComponent` rather than hand-written transitions.
 *
 * Use these when an element mounts and unmounts. For "animate once when scrolled
 * into view", use `<Reveal>` below — presence components have no scroll awareness.
 */
export const Fade = createPresenceComponent({
  enter: {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    duration: gradlyMotion.enter.duration,
    easing: gradlyMotion.enter.easing,
    fill: 'both',
  },
  exit: {
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
    duration: gradlyMotion.exit.duration,
    easing: gradlyMotion.exit.easing,
    fill: 'both',
  },
})

export const FadeUp = createPresenceComponent({
  enter: {
    keyframes: [
      { opacity: 0, transform: `translateY(${REVEAL_DISTANCE}px)` },
      { opacity: 1, transform: 'translateY(0)' },
    ],
    duration: gradlyMotion.editorial.duration,
    easing: gradlyMotion.editorial.easing,
    fill: 'both',
  },
  exit: {
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: `translateY(${REVEAL_DISTANCE / 2}px)` },
    ],
    duration: gradlyMotion.exit.duration,
    easing: gradlyMotion.exit.easing,
    fill: 'both',
  },
})

export const Scale = createPresenceComponent({
  enter: {
    keyframes: [
      { opacity: 0, transform: 'scale(0.96)' },
      { opacity: 1, transform: 'scale(1)' },
    ],
    duration: gradlyMotion.enter.duration,
    easing: gradlyMotion.enter.easing,
    fill: 'both',
  },
  exit: {
    keyframes: [
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(0.96)' },
    ],
    duration: gradlyMotion.exit.duration,
    easing: gradlyMotion.exit.easing,
    fill: 'both',
  },
})

/**
 * Height collapse for accordions and conditional form sections.
 *
 * `grid-template-rows: 0fr → 1fr` animates to the content's natural height without
 * measuring it in JS — a fixed `max-height` either clips long content or eases
 * toward a number the content never reaches.
 */
export const Collapse = createPresenceComponent({
  enter: {
    keyframes: [
      { gridTemplateRows: '0fr', opacity: 0 },
      { gridTemplateRows: '1fr', opacity: 1 },
    ],
    duration: gradlyMotion.settle.duration,
    easing: gradlyMotion.settle.easing,
    fill: 'both',
  },
  exit: {
    keyframes: [
      { gridTemplateRows: '1fr', opacity: 1 },
      { gridTemplateRows: '0fr', opacity: 0 },
    ],
    duration: gradlyMotion.exit.duration,
    easing: gradlyMotion.exit.easing,
    fill: 'both',
  },
})

/* ─────────────────────── Scroll-driven ─────────────────────── */

const useStyles = makeStyles({
  reveal: {
    opacity: '0',
    transform: `translateY(${REVEAL_DISTANCE}px)`,
    transitionProperty: 'opacity, transform',
    transitionDuration: `${motionTokens.durationSlower}ms`,
    transitionTimingFunction: motionTokens.curveDecelerateMid,
    willChange: 'opacity, transform',
    '@media (prefers-reduced-motion: reduce)': {
      transitionDuration: '1ms',
      transform: 'none',
    },
  },
  revealed: { opacity: '1', transform: 'translateY(0)' },

  progressTrack: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    height: '2px',
    zIndex: 60,
    pointerEvents: 'none',
    backgroundColor: 'transparent',
  },
  progressBar: {
    height: '100%',
    transformOrigin: '0 50%',
    backgroundColor: gradlyTokens.amber,
    willChange: 'transform',
  },

  marqueeViewport: {
    overflowX: 'hidden',
    width: '100%',
    // Fades the edges so items enter and leave instead of popping at the border.
    maskImage:
      'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
  },
  marqueeTrack: {
    display: 'flex',
    width: 'max-content',
    animationName: {
      from: { transform: 'translateX(0)' },
      to: { transform: 'translateX(-50%)' },
    },
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    ':hover': { animationPlayState: 'paused' },
    '@media (prefers-reduced-motion: reduce)': { animationName: 'none' },
  },
  marqueeReverse: { animationDirection: 'reverse' },
})

/**
 * Animates its children in once, the first time they scroll into view.
 *
 * Deliberately not a Fluent presence component: presence is driven by a `visible`
 * prop and has no notion of the viewport, and faking it leaves the element at full
 * opacity before the observer fires (a visible flash on first paint). A CSS
 * transition toggled by IntersectionObserver starts from the hidden state in the
 * very first frame. Timing and easing still come from Fluent's motion tokens.
 */
export function Reveal({
  children,
  delay = 0,
  once = true,
  className,
}: {
  children: React.ReactNode
  /** Milliseconds. Stagger siblings with 60–100ms steps. */
  delay?: number
  once?: boolean
  className?: string
}) {
  const s = useStyles()
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            if (once) io.disconnect()
          } else if (!once) {
            setShown(false)
          }
        }
      },
      { rootMargin: '-80px 0px', threshold: 0.01 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [once])

  return (
    <div
      ref={ref}
      className={mergeClasses(s.reveal, shown && s.revealed, className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

/**
 * Thin amber reading-progress bar pinned to the top of the viewport.
 *
 * Writes `transform` directly to the node inside a rAF rather than going through
 * state: this runs on every scroll event, and a `setState` per frame would
 * re-render the whole subtree beneath it.
 */
export function ScrollProgress() {
  const s = useStyles()
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = barRef.current
      if (!el) return
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0
      el.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className={s.progressTrack} aria-hidden>
      <div ref={barRef} className={s.progressBar} style={{ transform: 'scaleX(0)' }} />
    </div>
  )
}

/**
 * Infinite horizontal scroller for the logo wall.
 *
 * Children are rendered twice and the track translates by exactly -50%, which is
 * what makes the loop seamless — so pass one set and let this duplicate it.
 */
export function Marquee({
  children,
  speed = 40,
  reverse = false,
  className,
}: {
  children: React.ReactNode
  /** Seconds for one full pass. */
  speed?: number
  reverse?: boolean
  className?: string
}) {
  const s = useStyles()
  return (
    <div className={mergeClasses(s.marqueeViewport, className)}>
      <div
        className={mergeClasses(s.marqueeTrack, reverse && s.marqueeReverse)}
        style={{ animationDuration: `${speed}s` }}
      >
        <div style={{ display: 'flex' }} aria-hidden={false}>
          {children}
        </div>
        <div style={{ display: 'flex' }} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}

export { createPresenceComponent, createMotionComponent, motionTokens } from '@fluentui/react-components'
