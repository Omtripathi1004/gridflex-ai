import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flexibility Engine & Peak Shaving | GridFlex AI',
  description: 'Mixed-Integer Linear Programming (MILP) flexibility solver delivering 9.8 MW peak shaving, ₹1,42,500 DSM tariff penalty avoidance, and 6.8 tCO2 mitigation.',
  openGraph: {
    title: 'Flexibility Engine & Peak Shaving | GridFlex AI',
    description: 'MILP optimal dispatch reducing evening deficit to 0 hours and avoiding utility deviation penalties.',
    url: 'https://frontend-xi-khaki-78.vercel.app/flexibility',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'GridFlex AI Flexibility Engine' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flexibility Engine & Peak Shaving | GridFlex AI',
    description: 'Demand response optimization and battery dispatch eliminating grid shortages.',
    images: ['/og-image.png']
  }
};

export default function FlexibilityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
