'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface Stream {
  id: string
  date: string
  title: string
  description: string
  is_live: boolean
  views_count: number
}

export default function StreamerPage() {
  const { supabase, user } = useSupabase()
  const [streams, setStreams] = useState<Stream[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      fetchStreams()
    }
  }, [user])

  const fetchStreams = async () => {
    try {
      const { data, error } = await supabase
        .from('streams')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })

      if (error) {
        console.error('Error fetching streams:', error)
        return
      }

      setStreams(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const startStream = async (streamId: string) => {
    try {
      const { error } = await supabase
        .from('streams')
        .update({ is_live: true })
        .eq('id', streamId)

      if (error) {
        throw error
      }

      setMessage('Stream startad!')
      fetchStreams()
    } catch (error) {
      console.error('Error starting stream:', error)
      setMessage('Ett fel uppstod. Försök igen.')
    }
  }

  const stopStream = async (streamId: string) => {
    try {
      const { error } = await supabase
        .from('streams')
        .update({ is_live: false })
        .eq('id', streamId)

      if (error) {
        throw error
      }

      setMessage('Stream stoppad!')
      fetchStreams()
    } catch (error) {
      console.error('Error stopping stream:', error)
      setMessage('Ett fel uppstod. Försök igen.')
    }
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
              <span className="text-gray-400">Streamer Panel</span>
            </div>
            
            <nav className="flex items-center space-x-6">
              <a href="/" className="text-gray-300 hover:text-white transition-colors">
                Tillbaka till startsidan
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Streamer Panel</h1>
          <p className="text-gray-400">
            Hantera dina streams och gå live
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes('fel') 
              ? 'bg-red-500/20 border border-red-500/30 text-red-400' 
              : 'bg-green-500/20 border border-green-500/30 text-green-400'
          }`}>
            {message}
          </div>
        )}

        {/* Streams */}
        <div className="bg-stream-dark rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Dina Streams</h2>
          
          {streams.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Inga streams än</h3>
              <p className="text-gray-400 mb-6">
                Du har inga schemalagda streams. Kontakta admin för att få ett datum tilldelat.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {streams.map((stream) => (
                <div 
                  key={stream.id} 
                  className={`border rounded-lg p-6 ${
                    stream.is_live 
                      ? 'border-green-500/30 bg-green-500/10' 
                      : 'border-white/20 bg-stream-dark/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {stream.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Datum: {new Date(stream.date).toLocaleDateString('sv-SE')}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Visningar: {stream.views_count}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {stream.is_live && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-red-400 text-sm font-medium">LIVE</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {stream.description && (
                    <div className="mb-4">
                      <p className="text-gray-300 leading-relaxed">{stream.description}</p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    {stream.is_live ? (
                      <button
                        onClick={() => stopStream(stream.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Stoppa Stream
                      </button>
                    ) : (
                      <button
                        onClick={() => startStream(stream.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Starta Stream
                      </button>
                    )}
                    
                    <a 
                      href="/"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Se Stream
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-gradient-to-r from-primary-600/20 to-purple-600/20 rounded-xl p-6 border border-primary-500/30">
          <h3 className="text-lg font-semibold text-white mb-4">Instruktioner för streaming</h3>
          <div className="space-y-3 text-gray-300 text-sm">
            <p>• Klicka "Starta Stream" när du är redo att gå live</p>
            <p>• Din stream kommer att visas på startsidan</p>
            <p>• Tittare kan chatta och donera under streamen</p>
            <p>• Klicka "Stoppa Stream" när du är klar</p>
          </div>
        </div>
      </main>
    </div>
  )
} 