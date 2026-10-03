import { motionTokens } from '@fluentui/react-components'

/**
 * Shared motion vocabulary, expressed entirely in Fluent motion tokens.
 *
 * Fluent ships duration + easing tokens but no opinion about which pairing means
 * what. These four presets are that opinion, so a fade in a dialog and a fade in a
 * card use the same timing rather than two hand-picked numbers.
 *
 * `curveDecelerateMid` for entrances (fast start, soft landing), `curveAccelerateMin`
 * for exits (things leave quicker than they arrive), `curveEasyEase` for state
 * changes that are neither.
 */
export const gradlyMotion = {
  enter: {
    duration: motionTokens.durationGentle,
    easing: motionTokens.curveDecelerateMid,
  },
  exit: {
    duration: motionTokens.durationFast,
    easing: motionTokens.curveAccelerateMin,
  },
  settle: {
    duration: motionTokens.durationNormal,
    easing: motionTokens.curveEasyEase,
  },
  /** Long, cinematic — hero and scroll reveals only. */
  editorial: {
    duration: motionTokens.durationSlower,
    easing: motionTokens.curveDecelerateMid,
  },
} as const

/** Distance (px) a reveal travels. Kept small — editorial, not bouncy. */
export const REVEAL_DISTANCE = 24

/** Transition string for plain CSS hover/active states, token-derived. */
export const hoverTransition = `all ${motionTokens.durationNormal}ms ${motionTokens.curveEasyEase}`
