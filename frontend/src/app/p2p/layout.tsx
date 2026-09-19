import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'P2P Energy Trading Market (INR) | GridFlex AI',
  description: 'Local peer-to-peer double-auction sandbox for prosumers and consumers. Prices benchmarked in INR (₹/kWh) to Vidyut PRAVAH and IEX DAM.',
  openGraph: {
    title: 'P2P Energy Trading Market (INR) | GridFlex AI',
    description: '770 kWh reconciled ledger with critical hospital priority dispatch and ₹6.80/kWh market clearing rate.',
    url: 'https://frontend-xi-khaki-78.vercel.app/p2p',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'GridFlex AI P2P Market' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'P2P Energy Trading Market (INR) | GridFlex AI',
    description: 'Local prosumer-consumer energy clearing with transparent Indian rupee tariffs.',
    images: ['/og-image.png']
  }
};

export default function P2PLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
