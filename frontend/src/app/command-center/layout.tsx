import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Substation Command Center | GridFlex AI',
  description: 'Live 33/11kV substation monitoring bus, real-time duck curve mitigation, active REC-704 dispatch directives, and energy flow diagram.',
  openGraph: {
    title: 'Substation Command Center | GridFlex AI',
    description: 'Real-time telemetry and energy flow visualization across solar, wind, BESS, and commercial/industrial loads.',
    url: 'https://frontend-xi-khaki-78.vercel.app/command-center',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'GridFlex AI Command Center' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Substation Command Center | GridFlex AI',
    description: 'Substation energy flow and automated AI dispatch directives.',
    images: ['/og-image.png']
  }
};

export default function CommandCenterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
