import { useState, useEffect } from 'react'
import { isWebGLSupported } from '../utils/webgl'

export function useWebGLSupport() {
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    setSupported(isWebGLSupported())
  }, [])

  return supported
}
