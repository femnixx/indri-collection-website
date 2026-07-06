import { Metadata } from 'next';
import './globals.css';

// 1. Tambahkan domain produksi Anda di sini agar OG Image bisa terdeteksi
const DOMAIN = 'https://indri-collection-website.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: 'Indri Collection | Konveksi Inklusif & Jasa Jahit Malang',
    template: '%s | Indri Collection',
  },
  description: 'Indri Collection adalah usaha konveksi pemberdayaan disabilitas di Malang, menghasilkan ragam pakaian dengan kualitas jahitan premium yang penuh ketelitian.',
  keywords: [
    'konveksi malang', 
    'pemberdayaan disabilitas', 
    'gamis malang', 
    'tunik', 
    'hijab', 
    'Indri Collection', 
    'jahitan', 
    'permak baju malang', 
    'jahit baju malang', 
    'weave for change'
  ],
  authors: [{ name: 'Indri Collection' }],
  creator: 'Indri Collection',
  openGraph: {
    title: 'Indri Collection | Konveksi Inklusif & Jasa Jahit Malang',
    description: 'Konveksi pemberdayaan disabilitas di Malang dengan kualitas jahitan premium.',
    url: DOMAIN,
    siteName: 'Indri Collection',
    images: [
      {
        url: '/about.webp', // Pastikan file ini ada di folder public/
        width: 1200,
        height: 630,
        alt: 'Indri Collection - Konveksi Inklusif Malang',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indri Collection | Konveksi Inklusif Malang',
    description: 'Konveksi pemberdayaan disabilitas di Malang dengan kualitas jahitan premium.',
    images: ['/about.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: '4Mpk9pVH-tT6SMvlwWbd0sVrOVJeJxX58kyJZ9SGTZ4',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="antialiased text-slate-900 bg-white">
        {children}
      </body>
    </html>
  );
}