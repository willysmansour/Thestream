interface Streamer {
  name: string
  profile_picture?: string
  bio?: string
  social_links?: {
    twitter?: string
    instagram?: string
    youtube?: string
    website?: string
  }
}

interface StreamerInfoProps {
  streamer: Streamer
}

export function StreamerInfo({ streamer }: StreamerInfoProps) {
  return (
    <div className="bg-stream-dark rounded-xl p-6">
      <div className="flex items-start space-x-4">
        {/* Profile Picture */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          {streamer.profile_picture ? (
            <img 
              src={streamer.profile_picture} 
              alt={streamer.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <span className="text-white text-xl font-bold">
              {streamer.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{streamer.name}</h3>
          {streamer.bio && (
            <p className="text-gray-300 mb-4 leading-relaxed">{streamer.bio}</p>
          )}

          {/* Social Links */}
          {streamer.social_links && Object.keys(streamer.social_links).length > 0 && (
            <div className="flex space-x-3">
              {streamer.social_links.twitter && (
                <a 
                  href={streamer.social_links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              )}

              {streamer.social_links.instagram && (
                <a 
                  href={streamer.social_links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49z"/>
                  </svg>
                </a>
              )}

              {streamer.social_links.youtube && (
                <a 
                  href={streamer.social_links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}

              {streamer.social_links.website && (
                <a 
                  href={streamer.social_links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0-9c-4.97 0-9 4.03-9 9s4.03 9 9 9" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 