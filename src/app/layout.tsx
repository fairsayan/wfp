import type { Metadata } from 'next';
import '@/styles/globals.css';
import 'leaflet/dist/leaflet.css';

export const metadata: Metadata = {
  title: 'Food Security Monitor in Africa',
  description: 'created by Domenico Pontari',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
