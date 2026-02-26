import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { InstallPrompt, OfflineIndicator } from '@/components/pwa/InstallPrompt';
import './global.css';

const poppins = Poppins({
  weight: ['400', '600', '700', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://emergenciacoletas.vercel.app'),
  title: {
    template: '%s | Emergência Coletas',
    default: 'Emergência Coletas - Ajuda para Vítimas de Enchentes',
  },
  description: 'Sistema colaborativo para localizar pontos de doação e abrigos durante emergências em Minas Gerais. Mapa em tempo real com locais de coleta de donativos e abrigos.',
  keywords: [
    'enchente',
    'doações',
    'abrigos',
    'emergência',
    'brasil',
    'minas gerais',
    'juiz de fora',
    'ubá',
    'matias barbosa',
    'ajuda humanitária',
    'pontos de coleta',
    'defesa civil',
  ],
  authors: [{ name: 'Emergência Coletas' }],
  creator: 'Emergência Coletas',
  publisher: 'Emergência Coletas',
  applicationName: 'Emergência Coletas',
  category: 'Social',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Emergência Coletas',
    title: 'Emergência Coletas - Ajuda para Vítimas de Enchentes',
    description: 'Sistema colaborativo para localizar pontos de doação e abrigos durante emergências em Minas Gerais',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emergência Coletas',
    description: 'Sistema colaborativo para localizar pontos de doação e abrigos durante emergências',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#c0392b',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body className="antialiased">
        {children}
        <InstallPrompt />
        <OfflineIndicator />
        {process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED === 'true' && (
          <Analytics />
        )}
      </body>
    </html>
  );
}
