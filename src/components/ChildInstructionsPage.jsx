import { Link } from 'react-router-dom';
import InfoPageLayout from './InfoPageLayout';

function KidSection({ emoji, title, children }) {
  return (
    <div
      style={{
        marginBottom: '1.25rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--glass-border)',
        borderRadius: '16px',
        padding: '1.1rem 1.25rem',
        display: 'flex',
        gap: '0.9rem',
        alignItems: 'flex-start'
      }}
    >
      <div style={{ fontSize: '2rem', lineHeight: 1 }}>{emoji}</div>
      <div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', color: '#fbbf24' }}>{title}</h3>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-main)' }}>{children}</p>
      </div>
    </div>
  );
}

export default function ChildInstructionsPage() {
  return (
    <InfoPageLayout title="🎄 Kid Instructions" subtitle="How to use the Christmas app!">
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        Are you a grown-up? <Link to="/instructions/adults" style={{ color: '#fbbf24', fontWeight: 600 }}>Go to Grown-Up Instructions</Link> instead.
      </p>

      <KidSection emoji="🎅" title="What is this app?">
        This app helps your whole family play Secret Santa! Everyone picks a name, and that's who they
        get a present for. It's a secret until you open your present!
      </KidSection>

      <KidSection emoji="🔑" title="Signing In">
        Ask a grown-up to help you sign in the first time. If you're old enough to have your own login,
        you can sign in all by yourself!
      </KidSection>

      <KidSection emoji="📝" title="Your Wishlist">
        This is where you write down presents you'd love to get! Tap <strong>"Add Item"</strong> and type
        in what you want. You can even add a link so people know exactly which one to get.
      </KidSection>

      <KidSection emoji="🎁" title="Your Buy For List">
        If you're old enough to help pick out presents, this list shows who you're shopping for. Tap a
        name to see what they wished for!
      </KidSection>

      <KidSection emoji="✅" title="Checking Things Off">
        Once you (or a grown-up helping you) buy someone's present, tap the little box next to their
        name. It turns green with a checkmark - great job!
      </KidSection>

      <KidSection emoji="🙋" title="Need Help?">
        If something looks confusing or broken, ask a grown-up for help. They can also tap the little
        bug button on the screen to tell the app's Master Admin about it.
      </KidSection>
    </InfoPageLayout>
  );
}
