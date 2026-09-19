import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Composite Resilience Index | GridFlex AI',
  description: 'Software-only computed grid resilience score derived from 4 transparent mathematical pillars: Renewable Availability, Substation Headroom, Storage Readiness, and Demand Response.',
  openGraph: {
    title: 'Composite Resilience Index (80.7/100) | GridFlex AI',
    description: 'Mathematically audited grid resilience engine with prescriptive actions and real-time blackout immunity margins.',
    url: 'https://frontend-xi-khaki-78.vercel.app/resilience',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'GridFlex AI Resilience Matrix' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Composite Resilience Index (80.7/100) | GridFlex AI',
    description: 'Audited grid resilience formula informed by IEEE 1547 and ISO 50001 frameworks.',
    images: ['/og-image.png']
  }
};

export default function ResilienceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
