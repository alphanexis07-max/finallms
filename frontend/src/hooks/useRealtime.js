import { useEffect, useRef } from 'react'
import { createRoomSocket } from '../lib/api'

export default function useRealtime(room, onMessage) {
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  useEffect(() => {
    if (!room) return undefined
    let ws
    let reconnectTimer
    let manuallyClosed = false
    let attempts = 0

    const connect = () => {
      ws = createRoomSocket(room)

      ws.onopen = () => {
        attempts = 0
      }

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data)
          onMessageRef.current?.(payload)
        } catch {
          // ignore malformed messages
        }
      }

      ws.onclose = () => {
        if (manuallyClosed) return
        const delayMs = Math.min(1000 * (2 ** attempts), 10000)
        attempts += 1
        reconnectTimer = window.setTimeout(connect, delayMs)
      }

      ws.onerror = () => {
        // Let the browser/socket lifecycle emit close naturally.
      }
    }

    connect()

    return () => {
      manuallyClosed = true
      window.clearTimeout(reconnectTimer)
      if (!ws) return

      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }

      if (ws.readyState === WebSocket.CONNECTING) {
        // Avoid forcing close during handshake, which triggers noisy console warnings.
        ws.onopen = () => ws.close()
      }
    }
  }, [room])
}
