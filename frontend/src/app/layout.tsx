import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'RealReview — Verified Apartment Reviews',
  description: 'Honest apartment reviews from verified tenants. No fakes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" />
      </head>
      <body className="bg-white text-navy-950 min-h-screen">
        <nav className="bg-navy-950 text-white px-4 py-3 flex items-center justify-between fixed top-0 w-full z-[1000]">
          <a href="/" className="text-xl font-bold">
            <span className="text-gold-500">Real</span>Review
          </a>
          <div className="flex gap-3 text-sm">
            <a href="/submit" className="hover:text-gold-400">Submit</a>
            <a href="/verify" className="hover:text-gold-400">Verify</a>
            <a href="/auth" className="hover:text-gold-400">Login</a>
            <a href="/profile" className="hover:text-gold-400">Profile</a>
          </div>
        </nav>
        <main className="pt-12">{children}</main>
      </body>
    </html>
  );
}
