import { Metadata } from 'next';
import React, { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Digital Twin & What-If Simulator | GridFlex AI',
  description: 'Stress-test solar, wind, demand and battery availability. Real-day replays from Grid-India, N-1 contingency drill, and probabilistic risk fans.',
  openGraph: {
    title: 'Digital Twin & What-If Simulator | GridFlex AI',
    description: 'Physics-constrained what-if scenario engine calibrated against real 64.8 MW Mahadevapura substation benchmark data.',
    url: 'https://frontend-xi-khaki-78.vercel.app/digital-twin',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'GridFlex AI Digital Twin' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Twin & What-If Simulator | GridFlex AI',
    description: 'Interactive grid stress-testing with P10/P50/P90 error bands and N-1 asset trip contingency drills.',
    images: ['/og-image.png']
  }
};

export default function DigitalTwinLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading Digital Twin & Simulator...</div>}>
      {children}
    </Suspense>
  );
}
