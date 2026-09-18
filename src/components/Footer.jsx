import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 2,
        marginTop: '3rem',
        padding: '1.5rem 1rem 2rem',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.6rem',
        textAlign: 'center'
      }}
    >
      <nav style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/about" data-testid="footer-about-link" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
          About
        </Link>
        <Link to="/instructions" data-testid="footer-instructions-link" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
          Instructions
        </Link>
        <Link to="/faq" data-testid="footer-faq-link" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
          FAQ
        </Link>
      </nav>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', opacity: 0.8 }}>
        🎄 Christmas Shopping List &copy; {year} &middot; Made for the family by Jeff Uhrick
      </p>
    </footer>
  );
}
