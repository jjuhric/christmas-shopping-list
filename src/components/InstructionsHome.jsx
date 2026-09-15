import { Link } from 'react-router-dom';
import InfoPageLayout from './InfoPageLayout';

export default function InstructionsHome() {
  return (
    <InfoPageLayout title="Instructions" subtitle="Choose the guide that fits you best">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <Link
          to="/instructions/adults"
          data-testid="instructions-adults-link"
          style={{
            textDecoration: 'none',
            color: 'var(--text-main)',
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            padding: '1.75rem 1.25rem',
            textAlign: 'center',
            transition: 'transform 0.2s ease'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎅</div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>Grown-Up Instructions</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>A full walkthrough of every page, setup, and the Admin Panel.</p>
        </Link>

        <Link
          to="/instructions/kids"
          data-testid="instructions-kids-link"
          style={{
            textDecoration: 'none',
            color: 'var(--text-main)',
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            padding: '1.75rem 1.25rem',
            textAlign: 'center',
            transition: 'transform 0.2s ease'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧒</div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>Kid Instructions</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>A simple, friendly guide for younger family members.</p>
        </Link>
      </div>
    </InfoPageLayout>
  );
}
