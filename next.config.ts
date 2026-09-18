import type {NextConfig} from 'next';

// Eine Quelle fuer den Basispfad — Anwendungscode verlinkt Dateien aus
// `public/` ueber `assetPath()` aus derselben Datei (siehe lib/base-path.ts).
import {basePath} from './lib/base-path';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined
};

export default nextConfig;
