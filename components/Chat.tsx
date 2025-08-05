'use client'

import { useEffect, useState, useRef } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'

interface ChatMessage {
  id: string
  content: string
  user_name: string
  created_at: string
}

interface ChatProps {
  streamId: string
}

// Demo-meddelanden för att visa hur chatten ser ut
const demoMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Hej alla! Så spännande att se Anna streama idag! 🎨',
    user_name: 'Maria',
    created_at: new Date(Date.now() - 300000).toISOString()
  },
  {
    id: '2',
    content: 'Vilka verktyg använder du för AI-konsten?',
    user_name: 'Erik',
    created_at: new Date(Date.now() - 240000).toISOString()
  },
  {
    id: '3',
    content: 'Otroligt snyggt! Kan du visa mer av processen?',
    user_name: 'Lisa',
    created_at: new Date(Date.now() - 180000).toISOString()
  },
  {
    id: '4',
    content: 'Jag älskar hur du blandar traditionell konst med AI!',
    user_name: 'Johan',
    created_at: new Date(Date.now() - 120000).toISOString()
  },
  {
    id: '5',
    content: 'Har du några tips för nybörjare?',
    user_name: 'Sofia',
    created_at: new Date(Date.now() - 60000).toISOString()
  }
]

export function Chat({ streamId }: ChatProps) {
  const { supabase, user } = useSupabase()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulera laddning av meddelanden
    setTimeout(() => {
      setMessages(demoMessages)
    }, 1000)
  }, [streamId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isLoading) return

    setIsLoading(true)

    // Simulera sändning av meddelande
    setTimeout(() => {
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        content: newMessage.trim(),
        user_name: user?.user_metadata?.name || 'Du',
        created_at: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, newMsg])
      setNewMessage('')
      setIsLoading(false)
    }, 500)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('sv-SE', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex flex-col h-96">
      {/* Chat header */}
      <div className="bg-stream-dark/80 backdrop-blur-sm border-b border-white/10 px-4 py-3">
        <h3 className="text-white font-semibold">Live Chat</h3>
        <p className="text-gray-400 text-sm">{messages.length} meddelanden</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p>Laddar chatten...</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="chat-message">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">
                    {message.user_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium text-sm">{message.user_name}</span>
                    <span className="text-gray-500 text-xs">{formatTime(message.created_at)}</span>
                  </div>
                  <p className="text-gray-300 text-sm mt-1 break-words">{message.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t border-white/10 p-4">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Skriv ett meddelande..."
            disabled={isLoading}
            className="flex-1 bg-stream-dark/50 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 disabled:opacity-50"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isLoading}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Skicka'
            )}
          </button>
        </form>
        
        <p className="text-gray-500 text-xs mt-2 text-center">
          Demo-läge - meddelanden sparas inte
        </p>
      </div>
    </div>
  )
} 