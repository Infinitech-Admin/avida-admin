import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["https://www.alveoland.com.ph/", "https://infinitech-api6.site"],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
