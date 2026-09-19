import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BESS Fleet & Constraint Inspector | GridFlex AI',
  description: '40 MWh virtual community battery storage dispatch with 24-hour physically feasible schedule, 10%-90% SoC window, and continuous C-rate monitoring.',
  openGraph: {
    title: 'BESS Fleet & Constraint Inspector | GridFlex AI',
    description: '32 MWh usable energy corridor with sub-120ms inverter response and physical state-of-charge tracking.',
    url: 'https://frontend-xi-khaki-78.vercel.app/storage',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'GridFlex AI BESS Fleet' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BESS Fleet & Constraint Inspector | GridFlex AI',
    description: 'Physically feasible battery schedule and real-time state of health monitoring.',
    images: ['/og-image.png']
  }
};

export default function StorageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
