/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This will allow all domains - use with caution
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // Alternatively, if you want to be more specific, list known domains:
    // domains: [
    //   'picsum.photos',
    //   'www.comstar.com.pk',
    //   // Add other known domains here
    // ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Skips ESLint checks during builds
  },
};

export default nextConfig;
