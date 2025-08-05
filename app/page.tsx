'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { LiveStream } from '@/components/LiveStream'
import { Chat } from '@/components/Chat'
import { StreamerInfo } from '@/components/StreamerInfo'
import { DonationButton } from '@/components/DonationButton'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface Stream {
  id: string
  user_id: string
  date: string
  title: string
  description: string
  is_live: boolean
  views_count: number
  streamer: {
    name: string
    profile_picture: string
    bio: string
    social_links: any
  }
}

// Demo-data för att visa hur plattformen ser ut
const demoStream: Stream = {
  id: 'demo-stream-1',
  user_id: 'demo-user-1',
  date: new Date().toISOString().split('T')[0],
  title: 'Min resa som digital konstnär',
  description: 'En djupdykning i digital konst, AI-genererat innehåll och framtidens kreativa processer. Jag delar med mig av mina erfarenheter och visar live hur jag skapar konst med hjälp av moderna verktyg.',
  is_live: true,
  views_count: 1247,
  streamer: {
    name: 'Anna Andersson',
    profile_picture: '',
    bio: 'Digital konstnär och kreatör med passion för AI-genererad konst. Jag skapar unika verk som blandar traditionell konst med modern teknologi.',
    social_links: {
      instagram: 'https://instagram.com/annaandersson',
      twitter: 'https://twitter.com/annaandersson',
      website: 'https://annaandersson.se'
    }
  }
}

export default function HomePage() {
  const { supabase } = useSupabase()
  const [currentStream, setCurrentStream] = useState<Stream | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulera laddning och sätt demo-data
    setTimeout(() => {
      setCurrentStream(demoStream)
      setLoading(false)
    }, 1500)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-stream-darker flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stream-darker">
      {/* Header */}
      <header className="bg-stream-dark/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">
                The Stream
              </h1>
              {currentStream?.is_live && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full live-indicator"></div>
                  <span className="text-red-400 text-sm font-medium">LIVE</span>
                </div>
              )}
            </div>
            
            <nav className="flex items-center space-x-6">
              <a href="/schedule" className="text-gray-300 hover:text-white transition-colors">
                Schema
              </a>
              <a href="/apply" className="text-gray-300 hover:text-white transition-colors">
                Ansök
              </a>
              <a href="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
                Logga in
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStream ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Live Stream - Takes up 3 columns */}
            <div className="lg:col-span-3">
              <div className="bg-stream-dark rounded-xl overflow-hidden stream-glow">
                <LiveStream stream={currentStream} />
              </div>
              
              {/* Streamer Info */}
              <div className="mt-6">
                <StreamerInfo streamer={currentStream.streamer} />
              </div>
            </div>

            {/* Sidebar - Takes up 1 column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Chat */}
              <div className="bg-stream-dark rounded-xl overflow-hidden">
                <Chat streamId={currentStream.id} />
              </div>

              {/* Donation Button */}
              <div className="bg-stream-dark rounded-xl p-6">
                <DonationButton streamId={currentStream.id} streamerName={currentStream.streamer.name} />
              </div>

              {/* Today's Schedule */}
              <div className="bg-stream-dark rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Dagens Stream</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {currentStream.streamer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{currentStream.streamer.name}</p>
                      <p className="text-gray-400 text-sm">{currentStream.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* No stream today */
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Ingen stream idag</h2>
              <p className="text-gray-400 mb-8">
                Kolla schemat för att se när nästa streamer går live, eller ansök för att bli streamer själv!
              </p>
              <div className="space-x-4">
                <a href="/schedule" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors">
                  Se Schema
                </a>
                <a href="/apply" className="bg-transparent border border-primary-600 text-primary-400 hover:bg-primary-600 hover:text-white px-6 py-3 rounded-lg transition-colors">
                  Ansök
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 