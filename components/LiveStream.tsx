'use client'

import { useEffect, useState } from 'react'
import { Room, RoomEvent, RemoteParticipant, LocalParticipant } from 'livekit-client'

interface Stream {
  id: string
  title: string
  is_live: boolean
  streamer: {
    name: string
  }
}

interface LiveStreamProps {
  stream: Stream
}

export function LiveStream({ stream }: LiveStreamProps) {
  const [room, setRoom] = useState<Room | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!stream.is_live) return

    const connectToStream = async () => {
      setIsConnecting(true)
      setError(null)

      try {
        const newRoom = new Room({
          adaptiveStream: true,
          dynacast: true,
        })

        // Hämta token från API
        const response = await fetch('/api/livekit/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomName: stream.id,
            participantName: 'viewer',
          }),
        })

        if (!response.ok) {
          throw new Error('Kunde inte hämta stream-token')
        }

        const { token } = await response.json()

        // Anslut till rummet
        await newRoom.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, token)
        setRoom(newRoom)

        // Lyssna på events
        newRoom.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
          console.log('Streamer anslöt:', participant.identity)
        })

        newRoom.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
          console.log('Streamer kopplade från:', participant.identity)
        })

        newRoom.on(RoomEvent.Disconnected, () => {
          console.log('Kopplad från rummet')
          setRoom(null)
        })

      } catch (err) {
        console.error('Fel vid anslutning till stream:', err)
        setError('Kunde inte ansluta till streamen')
      } finally {
        setIsConnecting(false)
      }
    }

    connectToStream()

    return () => {
      if (room) {
        room.disconnect()
      }
    }
  }, [stream.id, stream.is_live])

  if (!stream.is_live) {
    return (
      <div className="aspect-video bg-stream-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Stream startar snart</h3>
          <p className="text-gray-400">Väntar på {stream.streamer.name}...</p>
        </div>
      </div>
    )
  }

  if (isConnecting) {
    return (
      <div className="aspect-video bg-stream-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Ansluter till streamen...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="aspect-video bg-stream-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Anslutningsfel</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Försök igen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="aspect-video bg-black relative">
      {/* LiveKit video element kommer att renderas här */}
      <div id="livekit-video" className="w-full h-full"></div>
      
      {/* Stream overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
          <h2 className="text-white font-semibold">{stream.title}</h2>
          <p className="text-gray-300 text-sm">Live nu</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-red-500/80 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-white text-sm font-medium">LIVE</span>
        </div>
      </div>
    </div>
  )
} 