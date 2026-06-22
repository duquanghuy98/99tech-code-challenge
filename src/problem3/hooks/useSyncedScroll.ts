import { useRef, useCallback } from 'react'

export function useSyncedScroll() {
  const leftScrollRef = useRef<HTMLDivElement>(null)
  const rightScrollRef = useRef<HTMLDivElement>(null)
  const syncingRef = useRef(false)

  const syncScroll = useCallback((source: 'left' | 'right') => {
    if (syncingRef.current) return
    syncingRef.current = true
    const from = source === 'left' ? leftScrollRef.current : rightScrollRef.current
    const to = source === 'left' ? rightScrollRef.current : leftScrollRef.current
    if (from && to) to.scrollTop = from.scrollTop
    requestAnimationFrame(() => { syncingRef.current = false })
  }, [])

  return { leftScrollRef, rightScrollRef, syncScroll }
}
