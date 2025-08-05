'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function ApplyPage() {
  const { supabase, user } = useSupabase()
  const [formData, setFormData] = useState({
    title: '',
    pitch: '',
    linkToContent: '',
    preferredDate: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setMessage('Du måste logga in för att ansöka')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          title: formData.title,
          pitch: formData.pitch,
          link_to_content: formData.linkToContent,
          date_requested: formData.preferredDate || null
        })

      if (error) {
        throw error
      }

      setMessage('Din ansökan har skickats! Vi återkommer snart.')
      setFormData({
        title: '',
        pitch: '',
        linkToContent: '',
        preferredDate: ''
      })
    } catch (error) {
      console.error('Error submitting application:', error)
      setMessage('Ett fel uppstod. Försök igen.')
    } finally {
      setIsSubmitting(false)
    }
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
              <a href="/schedule" className="text-gray-300 hover:text-white transition-colors">
                Schema
              </a>
              <a href="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
                Logga in
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Ansök som Streamer</h1>
          <p className="text-gray-400 text-lg">
            Få chansen att streama live till hela världen en dag
          </p>
        </div>

        <div className="bg-stream-dark rounded-xl p-8">
          {!user ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Logga in för att ansöka</h2>
              <p className="text-gray-400 mb-8">
                Du måste skapa ett konto för att kunna ansöka som streamer
              </p>
              <a href="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg transition-colors">
                Logga in
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-white font-medium mb-2">
                  Titel för din stream *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full bg-stream-dark/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  placeholder="T.ex. 'Min resa som digital konstnär'"
                />
              </div>

              <div>
                <label htmlFor="pitch" className="block text-white font-medium mb-2">
                  Berätta om dig och din stream *
                </label>
                <textarea
                  id="pitch"
                  value={formData.pitch}
                  onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
                  required
                  rows={6}
                  className="w-full bg-stream-dark/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 resize-none"
                  placeholder="Beskriv vad du vill streama, varför du skulle vara perfekt för The Stream, och vad som gör dig unik..."
                />
              </div>

              <div>
                <label htmlFor="linkToContent" className="block text-white font-medium mb-2">
                  Länk till ditt innehåll
                </label>
                <input
                  type="url"
                  id="linkToContent"
                  value={formData.linkToContent}
                  onChange={(e) => setFormData({ ...formData, linkToContent: e.target.value })}
                  className="w-full bg-stream-dark/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  placeholder="T.ex. din YouTube-kanal, Instagram, portfolio..."
                />
                <p className="text-gray-400 text-sm mt-1">
                  Länk till ditt befintliga innehåll så vi kan se vad du gör
                </p>
              </div>

              <div>
                <label htmlFor="preferredDate" className="block text-white font-medium mb-2">
                  Önskad datum (valfritt)
                </label>
                <input
                  type="date"
                  id="preferredDate"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full bg-stream-dark/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                />
                <p className="text-gray-400 text-sm mt-1">
                  Vi försöker anpassa oss efter dina önskemål, men kan inte garantera specifika datum
                </p>
              </div>

              {message && (
                <div className={`p-4 rounded-lg ${
                  message.includes('fel') 
                    ? 'bg-red-500/20 border border-red-500/30 text-red-400' 
                    : 'bg-green-500/20 border border-green-500/30 text-green-400'
                }`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner />
                    <span>Skickar ansökan...</span>
                  </div>
                ) : (
                  'Skicka Ansökan'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-r from-primary-600/20 to-purple-600/20 rounded-xl p-8 border border-primary-500/30">
          <h3 className="text-2xl font-bold text-white mb-4">Vad händer efter ansökan?</h3>
          <div className="space-y-4 text-gray-300">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <p>Vi granskar din ansökan och ditt innehåll noggrant</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <p>Vi återkommer inom 1-2 veckor med beslut</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <p>Vid godkännande får du ett datum och instruktioner</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">4</span>
              </div>
              <p>Du streamar live till hela världen på din tilldelade dag!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 