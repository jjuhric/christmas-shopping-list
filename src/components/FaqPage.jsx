import InfoPageLayout from './InfoPageLayout';

const FAQS = [
  {
    q: 'How do I get an account?',
    a: 'Your Family Admin or the Master Admin needs to add you first. Once they do, you\'ll get an invite email - or they can send you the app link directly. Click "Activate Account" on the login page to set a password, or sign in with Google if you were invited with a Gmail address.'
  },
  {
    q: 'Why can\'t I be assigned to buy for someone in my own family?',
    a: 'The draw is designed to keep gifts a surprise within your own household - your spouse, your kids, etc. Everyone is grouped by "Family Group," and the draw guarantees no one is assigned someone from their own group. The one exception is grandparent/grandchild pairs - see the next question.'
  },
  {
    q: 'My grandkids are in my family group. Can I draw them, or they draw me?',
    a: 'Yes. When you add a grandchild, set their "Relation to You" to Grandson or Granddaughter. That specifically exempts the two of you from the usual same-family block, so you can draw each other - while they\'re still blocked from drawing their own parent or anyone else in the group.'
  },
  {
    q: 'The Admin clicked "Run Draw" and it says a valid combination couldn\'t be found. What happened?',
    a: 'This usually means one family group is too large relative to everyone else - for example, if one household is more than half of all participants, there aren\'t enough people outside that household to assign everyone. Splitting a large extended family into smaller household groups (e.g. each couple and their own kids, rather than one big family name) fixes this.'
  },
  {
    q: 'Can young kids participate?',
    a: 'Child (managed) profiles are just for tracking a wishlist and shopping list for a parent\'s convenience - they\'re never part of the actual draw, as either a buyer or a recipient. Their gifts come directly from their own parents/grandparents rather than through the lottery.'
  },
  {
    q: 'I invited an adult family member, but the draw ran without them. Why?',
    a: 'Only people who have actually signed in at least once are included in the draw - so if someone was invited but hasn\'t logged in yet, they won\'t be in the pool. This is intentional: with 4 adult kids who "may or may not" participate each year, only the ones who show up get included. Once they sign in, they\'ll be eligible next time the draw runs.'
  },
  {
    q: 'I need to buy for someone who isn\'t part of my Secret Santa draw - like a grandparent, a teacher, or a friend.',
    a: 'Use "Add Extra Person" on your Dashboard. They\'ll show up on your "Buy For" list alongside your official Secret Santa recipient, so you can track everyone you\'re shopping for in one place.'
  },
  {
    q: 'Who can see my wishlist?',
    a: 'Anyone in your family group can view wishlists - it\'s how the person who draws your name knows what to get you. Add a name and, optionally, a link to the item.'
  },
  {
    q: 'I forgot my password. What do I do?',
    a: 'On the login page, click "Forgot Password?" and enter your email. You\'ll get a reset link. If you signed up with Google, use "Sign in with Google" instead - there\'s no separate password to reset.'
  },
  {
    q: 'I found a bug or something isn\'t working. Who do I tell?',
    a: 'Use the floating bug report button (visible on every page) to describe the issue. It goes straight to the Master Admin, along with a screenshot and some technical details to help track it down.'
  },
  {
    q: 'Can the draw be re-run if someone joins late or leaves?',
    a: 'Yes, an Admin can run the draw again from the Admin Panel. Keep in mind this reassigns everyone\'s recipient, so only re-run it if the family agrees - otherwise someone\'s "secret" recipient could change.'
  },
  {
    q: 'Is there a visual overview of how the whole app works?',
    a: (
      <>
        Yes - see the <a href="app-map.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#fbbf24', fontWeight: 600 }}>Flow Chart</a>,
        a one-page-per-topic PDF covering every role, sign-in path, and screen from login to the Secret Santa draw.
      </>
    )
  }
];

export default function FaqPage() {
  return (
    <InfoPageLayout title="Frequently Asked Questions" subtitle="Quick answers about how the app works">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {FAQS.map((item, idx) => (
          <details
            key={idx}
            style={{
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '0.9rem 1.1rem'
            }}
          >
            <summary style={{ cursor: 'pointer', fontWeight: 700, color: 'var(--text-main)', listStyle: 'revert' }}>
              {item.q}
            </summary>
            <p style={{ marginTop: '0.6rem', color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </InfoPageLayout>
  );
}
