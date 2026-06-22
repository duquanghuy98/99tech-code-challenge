import { useEffect, useRef, useState } from 'react'

export const DEFAULT_DELAY_MS = 1000

/** Promise-based delay for simulated API / calculation latency. */
export function delay(ms = DEFAULT_DELAY_MS): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

interface UseDelayedValueOptions {
  delayMs?: number
  /** When false, value updates immediately and isPending stays false. */
  enabled?: boolean
}

/**
 * Delays propagating `value` to the returned `value` by `delayMs`.
 * Use with a skeleton while `isPending` is true.
 */
export function useDelayedValue<T>(
  value: T,
  options?: UseDelayedValueOptions,
): { value: T; isPending: boolean } {
  const delayMs = options?.delayMs ?? DEFAULT_DELAY_MS
  const enabled = options?.enabled ?? true

  const [delayedValue, setDelayedValue] = useState(value)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setDelayedValue(value)
      setIsPending(false)
      return
    }

    setIsPending(true)
    const timer = window.setTimeout(() => {
      setDelayedValue(value)
      setIsPending(false)
    }, delayMs)

    return () => window.clearTimeout(timer)
  }, [value, delayMs, enabled])

  return { value: delayedValue, isPending: enabled && isPending }
}

/**
 * Keeps loading UI visible for at least `minMs` after `active` becomes true,
 * so fast network responses still show a brief skeleton state.
 */
export function useMinLoadingTime(active: boolean, minMs = DEFAULT_DELAY_MS): boolean {
  const [visible, setVisible] = useState(active)
  const startedAtRef = useRef<number | null>(active ? Date.now() : null)

  useEffect(() => {
    if (active) {
      startedAtRef.current = Date.now()
      setVisible(true)
      return
    }

    if (startedAtRef.current === null) {
      setVisible(false)
      return
    }

    const elapsed = Date.now() - startedAtRef.current
    const remaining = minMs - elapsed

    if (remaining <= 0) {
      startedAtRef.current = null
      setVisible(false)
      return
    }

    const timer = window.setTimeout(() => {
      startedAtRef.current = null
      setVisible(false)
    }, remaining)

    return () => window.clearTimeout(timer)
  }, [active, minMs])

  return visible
}

/** Shows a skeleton for at least `minMs` on first mount (pages with no real async fetch). */
export function useInitialMinLoading(minMs = DEFAULT_DELAY_MS): boolean {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return useMinLoadingTime(!mounted, minMs)
}
