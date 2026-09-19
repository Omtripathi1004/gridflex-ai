import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explainable AI & TreeSHAP Attributions | GridFlex AI',
  description: 'Audited TreeSHAP mathematical feature contributions for solar generation forecast and evening cliff deficit with verified additivity theorem proof.',
  openGraph: {
    title: 'Explainable AI & TreeSHAP Proof | GridFlex AI',
    description: 'Mathematically verified TreeSHAP feature attributions: Baseline + sum of contributions equals prediction with zero gap.',
    url: 'https://frontend-xi-khaki-78.vercel.app/explainable-ai',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'GridFlex AI Explainable AI' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explainable AI & TreeSHAP Proof | GridFlex AI',
    description: 'Audited feature attributions for grid forecast models.',
    images: ['/og-image.png']
  }
};

export default function ExplainableAILayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
