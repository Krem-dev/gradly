'use client'

import { useRef, useState, type ReactElement } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import {
  createDOMRenderer,
  RendererProvider,
  SSRProvider,
} from '@fluentui/react-components'

/**
 * Griffel's canonical style-bucket order, lowest precedence first.
 *
 * Mirrored from `@griffel/core`'s internal `styleBucketOrdering`. The DOM order of
 * the `<style>` tags *is* the cascade, so this order has to be reproduced exactly:
 * `r` (the `makeResetStyles` base) must come before `d` (the `makeStyles`
 * catch-all), or every component override silently loses to the Fluent reset it is
 * meant to override. Deliberately a local copy rather than a deep import from
 * griffel internals, which are not a public entry point.
 */
const BUCKET_ORDER = [
  'r', // reset styles
  'd', // catch-all
  'l', // :link
  'v', // :visited
  'w', // :focus-within
  'f', // :focus
  'i', // :focus-visible
  'h', // :hover
  'a', // :active
  's', // at-rules for reset styles
  'k', // keyframes
  't', // at-rules
  'm', // @media
  'c', // @container (legacy)
  'x', // @container (sorted)
]

function bucketRank(bucketName: string | undefined): number {
  const i = BUCKET_ORDER.indexOf(bucketName ?? 'd')
  // Unknown buckets sort last rather than first, so a future griffel bucket
  // can't quietly outrank the reset.
  return i === -1 ? BUCKET_ORDER.length : i
}

/**
 * Server-side rendering bridge for Fluent + the Next.js App Router.
 *
 * Without this, two things go wrong on every page:
 *
 *   1. Griffel (Fluent's CSS-in-JS engine) injects its rules into the DOM only
 *      after hydration, so the first paint is unstyled — a visible flash, and
 *      layout shift on anything measured from CSS.
 *   2. Fluent's `useId` has no shared counter across the server/client boundary,
 *      so generated ids differ between the two renders and React discards the
 *      server tree with a hydration mismatch.
 *
 * ### Why this doesn't just call `renderToStyleElements`
 *
 * Fluent's own `renderToStyleElements(renderer)` has two problems here. It
 * re-serialises the *entire* stylesheet on every call, and Next calls
 * `useServerInsertedHTML` once per streaming flush — on this app's gallery that
 * produced ~16.5k duplicate rules. And it emits sheets in renderer *insertion*
 * order, which is the order components happened to render in, not griffel's
 * bucket precedence. That reliably puts `r` after `d` (Fluent's reset is created
 * when the first Button renders, often after some catch-all rules), at which point
 * `makeStyles` overrides stop working — the symptom was icon-only buttons stuck at
 * Fluent's `min-width: 96px` despite an explicit `min-width: 0`.
 *
 * So this does two things differently: it tracks how many rules each bucket has
 * already flushed and emits only the new ones, and it sorts the emitted tags into
 * `BUCKET_ORDER` so the cascade matches what griffel builds client-side.
 *
 * The tags carry each bucket's own `elementAttributes` plus
 * `data-make-styles-rehydration`, which is what griffel's client-side rehydration
 * looks for — so the client adopts these rules instead of re-inserting them.
 */
export function FluentSSR({ children }: { children: React.ReactNode }) {
  // One renderer per mount. Recreating it on re-render would drop the cache of
  // inserted rules and re-emit every class.
  const [renderer] = useState(() => createDOMRenderer())
  const flushed = useRef<Record<string, number>>({})

  useServerInsertedHTML(() => {
    const pending: Array<{ key: string; rank: number; priority: number; el: ReactElement }> = []

    for (const [sheetKey, sheet] of Object.entries(renderer.stylesheets)) {
      const rules = sheet.cssRules()
      const already = flushed.current[sheetKey] ?? 0
      if (rules.length <= already) continue

      const fresh = rules.slice(already).join('')
      flushed.current[sheetKey] = rules.length

      const attrs = sheet.elementAttributes ?? {}
      pending.push({
        key: sheetKey,
        rank: bucketRank(sheet.bucketName),
        priority: Number(attrs['data-priority'] ?? 0),
        el: (
          <style
            key={sheetKey}
            {...attrs}
            data-make-styles-rehydration="true"
            dangerouslySetInnerHTML={{ __html: fresh }}
          />
        ),
      })
    }

    if (pending.length === 0) return null

    pending.sort((a, b) => a.rank - b.rank || a.priority - b.priority)
    return <>{pending.map((p) => p.el)}</>
  })

  return (
    <RendererProvider renderer={renderer}>
      <SSRProvider>{children}</SSRProvider>
    </RendererProvider>
  )
}
