'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

const NO_NAV_PATHS = ['/login'];

export function NavbarWrapper() {
  const pathname = usePathname();
  const hideNav = NO_NAV_PATHS.some(p => pathname === p || pathname.startsWith(p));
  if (hideNav) return null;
  return <Navbar />;
}
