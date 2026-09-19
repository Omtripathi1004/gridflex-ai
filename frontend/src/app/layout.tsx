import type { Metadata } from 'next';
import '../styles/globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'GridFlex AI — Smart Energy Management & Local Grid Resilience Platform',
  description: 'Production-grade smart energy management platform connecting renewable intermittency with local flexibility, ML forecasting, virtual BESS storage, P2P coordination, and explainable AI.',
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
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              {children}
            </main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
