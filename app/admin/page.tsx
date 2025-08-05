'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface Application {
  id: string
  title: string
  pitch: string
  link_to_content?: string
  status: 'pending' | 'accepted' | 'denied'
  date_requested?: string
  created_at: string
  user: {
    name: string
    email: string
  }
}

export default function AdminPage() {
  const { supabase, user } = useSupabase()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      checkAdminStatus()
    }
  }, [user])

  const checkAdminStatus = async () => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user?.id)
        .single()

      if (error || userData?.role !== 'admin') {
        window.location.href = '/'
        return
      }

      fetchApplications()
    } catch (error) {
      console.error('Error checking admin status:', error)
      window.location.href = '/'
    }
  }

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          user:users(name, email)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching applications:', error)
        return
      }

      setApplications(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApplicationAction = async (applicationId: string, action: 'accept' | 'deny') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: action === 'accept' ? 'accepted' : 'denied' })
        .eq('id', applicationId)

      if (error) {
        throw error
      }

      setMessage(`Ansökan ${action === 'accept' ? 'godkänd' : 'avvisad'}!`)
      fetchApplications()
    } catch (error) {
      console.error('Error updating application:', error)
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
              <span className="text-gray-400">Admin Panel</span>
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400">
            Hantera ansökningar och streams
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

        {/* Applications */}
        <div className="bg-stream-dark rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Ansökningar</h2>
          
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Inga ansökningar att visa</p>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map((application) => (
                <div 
                  key={application.id} 
                  className={`border rounded-lg p-6 ${
                    application.status === 'pending' 
                      ? 'border-yellow-500/30 bg-yellow-500/10' 
                      : application.status === 'accepted'
                      ? 'border-green-500/30 bg-green-500/10'
                      : 'border-red-500/30 bg-red-500/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {application.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Ansökt av: {application.user.name} ({application.user.email})
                      </p>
                      <p className="text-gray-400 text-sm">
                        Datum: {new Date(application.created_at).toLocaleDateString('sv-SE')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        application.status === 'pending' 
                          ? 'bg-yellow-500/20 text-yellow-400' 
                          : application.status === 'accepted'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {application.status === 'pending' ? 'Väntar' : 
                         application.status === 'accepted' ? 'Godkänd' : 'Avvisad'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Beskrivning:</h4>
                    <p className="text-gray-300 leading-relaxed">{application.pitch}</p>
                  </div>

                  {application.link_to_content && (
                    <div className="mb-4">
                      <h4 className="text-white font-medium mb-2">Länk till innehåll:</h4>
                      <a 
                        href={application.link_to_content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 hover:text-primary-300 break-all"
                      >
                        {application.link_to_content}
                      </a>
                    </div>
                  )}

                  {application.status === 'pending' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApplicationAction(application.id, 'accept')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Godkänn
                      </button>
                      <button
                        onClick={() => handleApplicationAction(application.id, 'deny')}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Avvisa
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 