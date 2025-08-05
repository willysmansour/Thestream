'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { format, addDays } from 'date-fns'
import { sv } from 'date-fns/locale'

interface ScheduledStream {
  id: string
  date: string
  title: string
  description: string
  streamer: {
    name: string
    profile_picture?: string
  }
}

// Demo-data för schema
const demoSchedule: ScheduledStream[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0], // Idag
    title: 'Min resa som digital konstnär',
    description: 'En djupdykning i digital konst, AI-genererat innehåll och framtidens kreativa processer.',
    streamer: {
      name: 'Anna Andersson',
      profile_picture: ''
    }
  },
  {
    id: '2',
    date: addDays(new Date(), 1).toISOString().split('T')[0], // Imorgon
    title: 'Musikproduktion med AI-verktyg',
    description: 'Jag visar hur jag skapar musik med hjälp av moderna AI-verktyg och traditionella instrument.',
    streamer: {
      name: 'Marcus Lindberg',
      profile_picture: ''
    }
  },
  {
    id: '3',
    date: addDays(new Date(), 2).toISOString().split('T')[0],
    title: 'Fotografering i urbana miljöer',
    description: 'En guide till street photography och hur man fångar städernas själ och energi.',
    streamer: {
      name: 'Elin Johansson',
      profile_picture: ''
    }
  },
  {
    id: '4',
    date: addDays(new Date(), 3).toISOString().split('T')[0],
    title: 'Programmering av interaktiva konstverk',
    description: 'Jag visar hur jag bygger interaktiva konstinstallationer med JavaScript och WebGL.',
    streamer: {
      name: 'David Chen',
      profile_picture: ''
    }
  },
  {
    id: '5',
    date: addDays(new Date(), 4).toISOString().split('T')[0],
    title: 'Poesi och spoken word',
    description: 'En kväll med poesi, spoken word och diskussioner om språkets kraft.',
    streamer: {
      name: 'Sara Nilsson',
      profile_picture: ''
    }
  }
]

export default function SchedulePage() {
  const { supabase } = useSupabase()
  const [streams, setStreams] = useState<ScheduledStream[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulera laddning och sätt demo-data
    setTimeout(() => {
      setStreams(demoSchedule)
      setLoading(false)
    }, 1000)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, 'EEEE d MMMM', { locale: sv })
  }

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0]
    return dateString === today
  }

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
              <a href="/" className="text-2xl font-bold text-white">
                The Stream
              </a>
            </div>
            
            <nav className="flex items-center space-x-6">
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Schema</h1>
          <p className="text-gray-400 text-lg">
            Se vem som streamar varje dag på The Stream
          </p>
        </div>

        <div className="space-y-6">
          {streams.map((stream) => (
            <div 
              key={stream.id} 
              className={`bg-stream-dark rounded-xl p-6 border ${
                isToday(stream.date) 
                  ? 'border-primary-500 stream-glow' 
                  : 'border-white/10'
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Date */}
                <div className="text-center min-w-[100px]">
                  <div className={`text-2xl font-bold ${
                    isToday(stream.date) ? 'text-primary-400' : 'text-white'
                  }`}>
                    {format(new Date(stream.date), 'd', { locale: sv })}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {format(new Date(stream.date), 'MMM', { locale: sv })}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {format(new Date(stream.date), 'EEEE', { locale: sv })}
                  </div>
                  {isToday(stream.date) && (
                    <div className="mt-2">
                      <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                        IDAG
                      </span>
                    </div>
                  )}
                </div>

                {/* Streamer Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center">
                      {stream.streamer.profile_picture ? (
                        <img 
                          src={stream.streamer.profile_picture} 
                          alt={stream.streamer.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold">
                          {stream.streamer.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {stream.streamer.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {formatDate(stream.date)}
                      </p>
                    </div>
                  </div>

                  <h4 className="text-lg font-medium text-white mb-2">
                    {stream.title}
                  </h4>
                  {stream.description && (
                    <p className="text-gray-300 leading-relaxed">
                      {stream.description}
                    </p>
                  )}
                </div>

                {/* Action */}
                <div className="flex flex-col items-end space-y-2">
                  {isToday(stream.date) ? (
                    <a 
                      href="/"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Titta Live
                    </a>
                  ) : (
                    <div className="text-gray-400 text-sm text-right">
                      <div>Kommer snart</div>
                      <div className="text-xs">
                        {format(new Date(stream.date), 'HH:mm', { locale: sv })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-600/20 to-purple-600/20 rounded-xl p-8 border border-primary-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">
              Vill du vara nästa streamer?
            </h3>
            <p className="text-gray-300 mb-6">
              Ansök för att få chansen att streama live till hela världen en dag
            </p>
            <a 
              href="/apply" 
              className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Ansök Nu
            </a>
          </div>
        </div>
      </main>
    </div>
  )
} 