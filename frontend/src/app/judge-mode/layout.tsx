import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Judge Mode 60-Second Storyboard | GridFlex AI',
  description: 'Guided 6-step interactive walk-through for hackathon judges: Problem duck curve, ML forecast, optimization solver, BESS dispatch, P2P trading, and resilience index.',
  openGraph: {
    title: 'Judge Mode 60-Second Storyboard | GridFlex AI',
    description: 'Rapid evaluation tour highlighting all core algorithmic innovations of GridFlex AI.',
    url: 'https://frontend-xi-khaki-78.vercel.app/judge-mode',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'GridFlex AI Judge Mode' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Judge Mode 60-Second Storyboard | GridFlex AI',
    description: 'Fast evaluation walk-through of GridFlex AI.',
    images: ['/og-image.png']
  }
};

export default function JudgeModeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
