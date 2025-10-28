import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Base Stats - Blockchain Analytics",
  description: "Analytics and statistics for Base blockchain",
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://base-stats.vercel.app/og-image.png',
    'og:image': 'https://base-stats.vercel.app/og-image.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://base-stats.vercel.app/og-image.png" />
        <meta property="og:image" content="https://base-stats.vercel.app/og-image.png" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

