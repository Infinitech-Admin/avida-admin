import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "https://avida-admin.vercel.app/",
      "https://infinitech-api27.site",
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
