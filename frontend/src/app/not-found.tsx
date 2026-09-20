import React from 'react';
import Link from 'next/link';
import { Zap, ArrowLeft, Sliders, ShieldCheck, Award } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 20px',
      color: '#f8fafc'
    }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: 'rgba(0, 240, 255, 0.12)',
        border: '1px solid var(--cyan-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
      }}>
        <Zap size={32} color="var(--cyan-primary)" />
      </div>

      <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 10px', color: 'var(--cyan-primary)' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '0 0 16px', color: '#f8fafc' }}>
        Substation Feeder Route Not Found
      </h2>
      <p style={{ maxWidth: 500, fontSize: '0.94rem', color: '#94a3b8', margin: '0 0 28px', lineHeight: 1.6 }}>
        The requested grid node does not exist or has been relocated in the active network topology.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ArrowLeft size={16} /> Return to Overview
        </Link>
        <Link href="/judge-mode" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8, borderColor: 'var(--gold-accent)', color: 'var(--gold-accent)' }}>
          <Award size={16} /> Judge Mode Tour
        </Link>
        <Link href="/digital-twin" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sliders size={16} /> Digital Twin
        </Link>
      </div>
    </div>
  );
}
