import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
        {
            protocol: "https",
            hostname: "cloud.appwrite.io"
        },
        {
            protocol: "https",
            hostname: "github.com"
        },
        {
            protocol: "https",
            hostname: "*"
        },
    ]
  }
};

export default nextConfig;
