import { Link } from 'react-router-dom';
import InfoPageLayout from './InfoPageLayout';

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '0.75rem', color: '#fbbf24' }}>
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text-muted)', lineHeight: 1.65, fontSize: '0.95rem' }}>
        {children}
      </div>
    </div>
  );
}

export default function AdultInstructionsPage() {
  return (
    <InfoPageLayout title="Grown-Up Instructions" subtitle="How the app works, page by page">
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Looking for the kid-friendly version instead? <Link to="/instructions/kids" style={{ color: '#fbbf24', fontWeight: 600 }}>Go to Kid Instructions</Link>.
      </p>

      <Section title="1. Login Page">
        <p>
          Sign in with <strong style={{ color: 'var(--text-main)' }}>Google</strong> if you were invited with a
          Gmail address, or use <strong style={{ color: 'var(--text-main)' }}>email &amp; password</strong> for any
          other email. First time here? Click <em>"Activate Account"</em> and set a password - the app checks
          that your email was actually invited before letting you in. Forgot your password? Use the
          <em> "Forgot Password?"</em> link to get a reset email.
        </p>
      </Section>

      <Section title="2. First-Time Setup Wizard">
        <p>
          The first time you sign in, you'll be walked through a short setup:
        </p>
        <p><strong style={{ color: 'var(--text-main)' }}>Step 1 - Your Profile &amp; Family:</strong> Enter your name and your household's group name. Everyone in the same group is excluded from drawing each other, so use a name specific to your household (e.g. your own family unit), not the whole extended family.</p>
        <p><strong style={{ color: 'var(--text-main)' }}>Step 2 - Wishlist:</strong> Add a couple of gift ideas so whoever draws your name has somewhere to start.</p>
        <p><strong style={{ color: 'var(--text-main)' }}>Step 3 - Invite Members (Admins only):</strong> Add the rest of your household - adults get an email invite, kids can be added as a "Child" profile with no email needed.</p>
        <p><strong style={{ color: 'var(--text-main)' }}>Step 4 - Finish:</strong> Confirms setup is complete and takes you to your Dashboard.</p>
      </Section>

      <Section title="3. Dashboard">
        <p>This is your home screen after signing in:</p>
        <p><strong style={{ color: 'var(--text-main)' }}>"Buy For" List:</strong> Everyone you need to shop for - your Secret Santa recipient (once the draw has run) plus anyone else you've added. Check people off as you buy for them, and click a name to view their wishlist.</p>
        <p><strong style={{ color: 'var(--text-main)' }}>Add Extra Person:</strong> Add anyone outside the main draw you're also buying for, like a grandparent, teacher, or friend.</p>
        <p><strong style={{ color: 'var(--text-main)' }}>Your Wishlist:</strong> Add or remove your own gift ideas at any time.</p>
        <p><strong style={{ color: 'var(--text-main)' }}>Managing Profiles:</strong> If you have Child profiles in your household, switch between them here to add wishlist items or check off gifts on their behalf.</p>
        <p><strong style={{ color: 'var(--text-main)' }}>Admin Panel:</strong> Visible only to Family Admins and the Master Admin - links to the Admin Panel below.</p>
      </Section>

      <Section title="4. Admin Panel">
        <p>Available to Family Admins (their own family) and the Master Admin (everyone):</p>
        <p><strong style={{ color: 'var(--text-main)' }}>Add New Member:</strong> Add an adult (with email) or a Child profile (no email). Child profiles are just for tracking a wishlist/shopping list - they're never part of the draw. Adults are only included in the draw once they've actually signed in at least once, so someone who "may or may not participate" this year simply won't be drawn unless they show up.</p>
        <p><strong style={{ color: 'var(--text-main)' }}>Relation to You:</strong> An optional label for how someone relates to you (Son, Daughter, Mom, Grandson, etc.). Grandson/Granddaughter is the one that changes behavior - it exempts that grandchild specifically from being blocked by you (their grandparent), even though you share a family group. They're still blocked from their own parent and everyone else in the group.</p>
        <p><strong style={{ color: 'var(--text-main)' }}>Family Group Name:</strong> Each household that shouldn't draw each other needs its own group name - see the note on that field for guidance with larger extended families.</p>
        <p><strong style={{ color: 'var(--text-main)' }}>Run Christmas Shopping List Draw (Master Admin only):</strong> Randomly assigns everyone a recipient from outside their own household. Can be re-run if needed, but that reassigns everyone.</p>
        <p><strong style={{ color: 'var(--text-main)' }}>Editing &amp; Removing Members:</strong> Use the edit/trash icons in the member table. Family Admins can manage their own household's non-admin members; the Master Admin can manage anyone except themselves.</p>
        <p><strong style={{ color: 'var(--text-main)' }}>EmailJS Setup &amp; Bug Reports (Master Admin only):</strong> Configure automated invite emails, and review bug reports submitted by the family.</p>
      </Section>

      <Section title="5. Reporting a Problem">
        <p>
          A floating bug report button is available on every page. Use it to describe what went wrong - it's
          sent straight to the Master Admin along with a screenshot and some technical details to help track
          down the issue.
        </p>
      </Section>
    </InfoPageLayout>
  );
}
