'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { Icon } from './Icons'
import { usePlatform } from './PlatformProvider'

const emptySubscribe = () => () => {}

export default function SpeakButton({
  text,
  className = '',
}: {
  text: string
  className?: string
}) {
  const { speechRate } = usePlatform()
  const [speaking, setSpeaking] = useState(false)

  const supported = useSyncExternalStore(
    emptySubscribe,
    () => typeof window !== 'undefined' && 'speechSynthesis' in window,
    () => false,
  )

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  if (!supported) return null

  const speak = () => {
    const synth = window.speechSynthesis
    synth.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-IN'
    utter.rate = speechRate || 0.9
    utter.onstart = () => setSpeaking(true)
    utter.onend = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)
    synth.speak(utter)
  }

  return (
    <button
      type="button"
      onClick={speak}
      title={`Sun kar seekho (${speechRate}x)`}
      aria-label={`Sunao: ${text}`}
      className={`inline-grid h-8 w-8 flex-none place-items-center rounded-full transition-colors ${
        speaking
          ? 'bg-ink-900 text-white ring-2 ring-ink-300'
          : 'bg-ink-50 text-ink-700 hover:bg-ink-100 hover:text-ink-900'
      } ${className}`}
    >
      <Icon name="volume" className="h-4 w-4" />
    </button>
  )
}
