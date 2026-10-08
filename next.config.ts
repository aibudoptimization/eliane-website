import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/guide/restaurant',
        destination: '/guide/restaurant.html',
      },
      {
        source: '/guide/etre-a-son-meilleur',
        destination: '/guide/etre-a-son-meilleur.html',
      },
      {
        source: '/guide/les-7y',
        destination: '/guide/les-7y.html',
      },
    ]
  },
  async redirects() {
    // Both pages belonged to the funnel that booked the call on the site. Booking now happens
    // through the link the lead receives by email, so anything still pointing here lands home.
    return [
      {source: '/merci', destination: '/', permanent: true},
      {source: '/appel-decouverte', destination: '/', permanent: true},
    ]
  },
}

export default nextConfig
