import { useState, useCallback } from 'react'

export function useSimulation(initialSpeed = 1) {
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(initialSpeed)

  const play = useCallback(() => setPlaying(true), [])
  const pause = useCallback(() => setPlaying(false), [])
  const toggle = useCallback(() => setPlaying((p) => !p), [])

  return { playing, speed, setSpeed, play, pause, toggle }
}
