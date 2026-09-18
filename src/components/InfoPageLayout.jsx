import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import santaScrollIcon from '../assets/santa-scroll.jpg';

export default function InfoPageLayout({ title, subtitle, children }) {
  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1.25rem 1rem', position: 'relative', zIndex: 2 }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', textDecoration: 'none', marginBottom: '1.25rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div
            className="icon-wrapper"
            style={{
              width: '56px',
              height: '56px',
              margin: 0,
              borderRadius: '14px',
              border: '2px solid rgba(251, 191, 36, 0.6)',
              boxShadow: '0 6px 20px rgba(220, 38, 38, 0.4)'
            }}
          >
            <img src={santaScrollIcon} alt="Santa reading wishlist scroll" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.7rem', fontWeight: 800 }}>{title}</h1>
            {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.15rem' }}>{subtitle}</p>}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
