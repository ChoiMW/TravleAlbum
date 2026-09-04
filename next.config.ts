import type { NextConfig } from "next";

const isGithubPages = process.env.DEPLOY_TARGET === 'gh-pages';
const basePath = isGithubPages ? '/TravleAlbum' : '';

const nextConfig: NextConfig = {
  output: isGithubPages ? 'export' : undefined,
  basePath: basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
