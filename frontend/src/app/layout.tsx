import type { Metadata } from 'next';
import '../styles/globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import { AuthProvider } from '../context/AuthContext';
import { AuthGuard } from '../components/AuthGuard';
import { NavbarWrapper } from '../components/NavbarWrapper';
import { Footer } from '../components/Footer';
import { GlobalChatWidget } from '../components/GlobalChatWidget';

export const metadata: Metadata = {
  metadataBase: new URL('https://frontend-xi-khaki-78.vercel.app'),
  title: 'GridFlex AI — Smart Energy Management & Local Grid Resilience Platform',
  description: 'Smart energy management platform with ML forecasting, virtual BESS dispatch, P2P trading, digital twin simulation, explainable AI, and 15-language i18n.',
  keywords: 'smart grid, energy management, DISCOM, ML forecasting, BESS, battery storage, P2P energy, renewable, solar, LightGBM, XGBoost, digital twin, explainable AI, India',
  authors: [{ name: 'Om Tripathi', url: 'https://github.com/Omtripathi1004' }],
  robots: 'index, follow',
  openGraph: {
    title: 'GridFlex AI — Smart Energy Management Platform',
    description: 'Bridges the Duck Curve gap with ML forecasting, BESS dispatch, P2P energy trading, digital twin simulation, and explainable AI for DISCOM operators.',
    url: 'https://frontend-xi-khaki-78.vercel.app',
    siteName: 'GridFlex AI',
    type: 'website',
    images: [
      {
        url: 'https://frontend-xi-khaki-78.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GridFlex AI Smart Energy Management Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GridFlex AI — Smart Energy Management',
    description: 'ML-driven grid resilience: solar/wind forecasting, BESS dispatch, P2P energy, digital twin & explainable AI.',
    images: ['https://frontend-xi-khaki-78.vercel.app/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <AuthProvider>
            <AuthGuard>
              <div className="app-container">
                <NavbarWrapper />
                <main className="main-content">
                  {children}
                </main>
                <Footer />
                <GlobalChatWidget />
              </div>
            </AuthGuard>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
