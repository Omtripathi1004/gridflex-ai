'use client';

import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';

const NO_NAV_PATHS = ['/login'];

export function NavbarWrapper() {
  const location = useLocation();
  const pathname = location.pathname;
  const hideNav = NO_NAV_PATHS.some(p => pathname === p || pathname.startsWith(p));
  if (hideNav) return null;
  return <Navbar />;
}
