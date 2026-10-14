import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@google/model-viewer"],
  images: {
    // Manufacturer CDNs are slow from this network; the optimizer aborts at 7s.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.icecat.biz",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "thumb.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "media3.bsh-group.com",
      },
      {
        protocol: "https",
        hostname: "media.miele.com",
      },
      {
        protocol: "https",
        hostname: "cdn.idealo.com",
      },
      {
        protocol: "https",
        hostname: "e-catalog.co.uk",
      },
      {
        protocol: "https",
        hostname: "i01.appmifile.com",
      },
      {
        protocol: "https",
        hostname: "i02.appmifile.com",
      },
      {
        protocol: "https",
        hostname: "i05.appmifile.com",
      },
      {
        protocol: "https",
        hostname: "d1ncau8tqf99kp.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "www.hausdorf.ru",
      },
      {
        protocol: "https",
        hostname: "st.bork.kz",
      },
    ],
  },
};

export default nextConfig;
