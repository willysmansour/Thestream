'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function LoginPage() {
  const { supabase, user } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error signing in with Google:', error)
      setMessage('Ett fel uppstod vid inloggning. Försök igen.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error signing in:', error)
      setMessage('Fel e-post eller lösenord. Försök igen.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      })

      if (error) {
        throw error
      }

      setMessage('Kontrollera din e-post för att bekräfta ditt konto!')
    } catch (error) {
      console.error('Error signing up:', error)
      setMessage('Ett fel uppstod vid registrering. Försök igen.')
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    return (
      <div className="min-h-screen bg-stream-darker flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Du är inloggad!</h2>
          <p className="text-gray-400 mb-8">Välkommen tillbaka, {user.user_metadata?.name || user.email}</p>
          <a href="/" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors">
            Gå till startsidan
          </a>
        </div>
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Logga in</h1>
          <p className="text-gray-400">
            Skapa ett konto för att delta i chatten och ansöka som streamer
          </p>
        </div>

        <div className="bg-stream-dark rounded-xl p-8">
          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.includes('fel') 
                ? 'bg-red-500/20 border border-red-500/30 text-red-400' 
                : 'bg-green-500/20 border border-green-500/30 text-green-400'
            }`}>
              {message}
            </div>
          )}

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors mb-6 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Fortsätt med Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-stream-dark text-gray-400">eller</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
            <div>
              <label htmlFor="email" className="block text-white font-medium mb-2">
                E-post
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full bg-stream-dark/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                placeholder="din@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white font-medium mb-2">
                Lösenord
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full bg-stream-dark/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                placeholder="Ditt lösenord"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner />
                  <span>Loggar in...</span>
                </div>
              ) : (
                'Logga in'
              )}
            </button>
          </form>

          {/* Sign Up Form */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Skapa nytt konto</h3>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="signup-name" className="block text-white font-medium mb-2">
                  Namn
                </label>
                <input
                  type="text"
                  id="signup-name"
                  name="name"
                  required
                  className="w-full bg-stream-dark/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  placeholder="Ditt namn"
                />
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-white font-medium mb-2">
                  E-post
                </label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  required
                  className="w-full bg-stream-dark/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  placeholder="din@email.com"
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-white font-medium mb-2">
                  Lösenord
                </label>
                <input
                  type="password"
                  id="signup-password"
                  name="password"
                  required
                  minLength={6}
                  className="w-full bg-stream-dark/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  placeholder="Minst 6 tecken"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-transparent border border-primary-600 text-primary-400 hover:bg-primary-600 hover:text-white disabled:opacity-50 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner />
                    <span>Skapar konto...</span>
                  </div>
                ) : (
                  'Skapa konto'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
} 