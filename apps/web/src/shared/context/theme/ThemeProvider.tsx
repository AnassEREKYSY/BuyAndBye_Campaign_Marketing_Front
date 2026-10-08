import { useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeContext, type ThemeMode } from './ThemeContext'

const STORAGE_KEY = 'bb_theme'

function readStored(): ThemeMode {
  let raw = ''
  try {
    raw = (localStorage.getItem(STORAGE_KEY) ?? '').toLowerCase()
  } catch {}
  if (raw === 'light' || raw === 'dark') return raw
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyToDom(mode: ThemeMode) {
  const root = document.documentElement
  if (mode === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'dark'
    return readStored()
  })

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
    applyToDom(next)
  }, [])

  const toggle = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark')
  }, [mode, setMode])

  useEffect(() => {
    applyToDom(mode)
  }, [mode])

  const value = useMemo(() => ({ mode, setMode, toggle }), [mode, setMode, toggle])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}