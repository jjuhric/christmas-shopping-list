import { Link } from 'react-router-dom';
import InfoPageLayout from './InfoPageLayout';

export default function AboutPage() {
  return (
    <InfoPageLayout title="About This App" subtitle="The story behind the Christmas Shopping List">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', lineHeight: 1.7, color: 'var(--text-main)' }}>
        <p>
          Christmas Shopping List exists to solve one very specific problem: when a big, multi-generational
          family gets together to shop for each other, it's easy to accidentally draw your own spouse, your
          own kids, or someone else in your immediate household - or to end up buying for someone twice while
          another family member gets forgotten.
        </p>
        <p>
          This app runs the drawing for you. Everyone is grouped into their own household, names are drawn at
          random, and no one is ever assigned to buy for someone in their own household. Every person gets a
          wishlist so whoever draws their name knows what to get them, and a "Buy For" list keeps track of who
          you still need to shop for - your Secret Santa recipient plus anyone else you add, like grandparents,
          teachers, or extended family who aren't part of the main draw.
        </p>
        <p>
          It's built around one real family, but works for any family shaped like one: parents, married kids,
          grandkids, and even great-grandkids, all under one roof for the holidays.
        </p>
        <p>
          Not sure how something works? The <Link to="/instructions" style={{ color: '#fbbf24', fontWeight: 600 }}>Instructions page</Link> walks
          through every screen in the app step by step.
        </p>

        <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Written by <strong style={{ color: 'var(--text-main)' }}>Jeff Uhrick</strong> &middot; September 15, 2026
        </div>
      </div>
    </InfoPageLayout>
  );
}
