export const PLAYBACK_BASE_INTERVAL_MS = 3000

export const PLAYBACK_SPEED_OPTIONS = [0.5, 1, 2, 3] as const

/** Cycle order when tapping the speed button: ×1 → ×2 → ×3 → ×0.5 */
export const PLAYBACK_SPEED_CYCLE = [1, 2, 3, 0.5] as const

export type PlaybackSpeed = (typeof PLAYBACK_SPEED_OPTIONS)[number]

export function playbackIntervalMs(speed: PlaybackSpeed): number {
  return PLAYBACK_BASE_INTERVAL_MS / speed
}

export function formatPlaybackSpeedLabel(speed: PlaybackSpeed): string {
  return speed === 0.5 ? '×0.5' : `×${speed}`
}

export function nextPlaybackSpeed(speed: PlaybackSpeed): PlaybackSpeed {
  const index = PLAYBACK_SPEED_CYCLE.indexOf(speed)
  const nextIndex = index === -1 ? 0 : (index + 1) % PLAYBACK_SPEED_CYCLE.length
  return PLAYBACK_SPEED_CYCLE[nextIndex]
}