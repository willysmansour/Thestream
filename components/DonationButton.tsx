'use client'

import { useState } from 'react'

interface DonationButtonProps {
  streamId: string
  streamerName: string
}

export function DonationButton({ streamId, streamerName }: DonationButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleDonation = async () => {
    setIsLoading(true)

    // Simulera donation
    setTimeout(() => {
      setIsLoading(false)
      setShowSuccess(true)
      
      // Dölj success-meddelandet efter 3 sekunder
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }, 1500)
  }

  if (showSuccess) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Tack för donationen!</h3>
        <p className="text-gray-400 text-sm">
          Din donation på 100 kr har skickats till {streamerName}
        </p>
      </div>
    )
  }

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-white mb-2">Stöd {streamerName}</h3>
      <p className="text-gray-400 text-sm mb-4">
        Visa ditt stöd genom en donation
      </p>
      
      <button
        onClick={handleDonation}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Bearbetar...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Donera 100 kr</span>
          </div>
        )}
      </button>
      
      <p className="text-gray-500 text-xs mt-2">
        Demo-läge - ingen riktig betalning
      </p>
    </div>
  )
} 