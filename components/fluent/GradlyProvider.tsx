'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { FluentProvider, Toaster, makeStyles, useId } from '@fluentui/react-components'
import {
  gradlyDarkTheme,
  gradlyLightTheme,
  type GradlyThemeMode,
} from '@/lib/fluent'
import { FluentSSR } from './FluentSSR'

const STORAGE_KEY = 'gradly-theme'

type ThemeContextValue = {
  mode: GradlyThemeMode
  setMode: (m: GradlyThemeMode) => void
  toggle: () => void
  /** The id every Gradly toast is dispatched to. */
  toasterId: string
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useGradlyTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useGradlyTheme must be used inside <GradlyProvider>')
  return ctx
}

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
})

/**
 * The single root every Gradly page mounts inside.
 *
 * Applies Fluent's web theme (and with it the whole token set), hosts one
 * `<Toaster>` so `useGradlyToast` works from anywhere, and owns light/dark mode
 * with the OS preference as the seed and localStorage as the override.
 *
 * Mode resolution runs in an effect rather than during render: reading
 * localStorage or `matchMedia` while rendering produces different output on the
 * server than the client, and React discards the hydrated tree.
 */
export function GradlyProvider({
  children,
  defaultMode = 'light',
}: {
  children: React.ReactNode
  defaultMode?: GradlyThemeMode
}) {
  const styles = useStyles()
  const toasterId = useId('gradly-toaster')
  const [mode, setModeState] = useState<GradlyThemeMode>(defaultMode)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored === 'light' || stored === 'dark') {
        setModeState(stored)
        return
      }
      if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        setModeState('dark')
      }
    } catch {
      // Private mode / blocked storage — keep the default, nothing to recover.
    }
  }, [])

  const setMode = useCallback((m: GradlyThemeMode) => {
    setModeState(m)
    try {
      window.localStorage.setItem(STORAGE_KEY, m)
    } catch {
      // Non-fatal: the choice just won't survive a reload.
    }
  }, [])

  const toggle = useCallback(
    () => setMode(mode === 'light' ? 'dark' : 'light'),
    [mode, setMode]
  )

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, setMode, toggle, toasterId }),
    [mode, setMode, toggle, toasterId]
  )

  return (
    <ThemeContext.Provider value={value}>
      <FluentSSR>
        <FluentProvider
          theme={mode === 'dark' ? gradlyDarkTheme : gradlyLightTheme}
          className={styles.root}
        >
          {children}
          <Toaster toasterId={toasterId} position="top-end" pauseOnHover />
        </FluentProvider>
      </FluentSSR>
    </ThemeContext.Provider>
  )
}
