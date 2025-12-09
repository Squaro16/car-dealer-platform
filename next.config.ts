import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Car dealership specific domains
      {
        protocol: "https",
        hostname: "cdn.imagin.studio",
      },
      {
        protocol: "https",
        hostname: "*.carfax.com",
      },
      {
        protocol: "https",
        hostname: "*.autotrader.com",
      },
      {
        protocol: "https",
        hostname: "*.cars.com",
      },
      {
        protocol: "https",
        hostname: "*.cargurus.com",
      },
      {
        protocol: "https",
        hostname: "*.edmunds.com",
      },
      {
        protocol: "https",
        hostname: "*.kbb.com",
      },
      {
        protocol: "https",
        hostname: "*.nada.com",
      },
      // Generic patterns for dealership websites
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "*.imgix.net",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
      },
      // Brand logo domains
      {
        protocol: "https",
        hostname: "pngimg.com",
      },
      // Additional common image hosting domains for car dealerships
      {
        protocol: "https",
        hostname: "*.pexels.com",
      },
      {
        protocol: "https",
        hostname: "*.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "*.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "*.gettyimages.com",
      },
    ],
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      'recharts',
      'react-hook-form',
      'zod'
    ],
  },
};

export default nextConfig;
