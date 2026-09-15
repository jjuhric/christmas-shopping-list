import { describe, it, expect } from 'vitest';
import { performDraw } from '../../utils/drawUtils';

/**
 * Models the Uhrick family's actual structure to validate that performDraw()
 * scales to a real multi-generational household with lopsided group sizes.
 *
 * Household = the exclusion unit (familyId). The app only excludes same-familyId
 * pairings, so each *nuclear* household must get its own familyId, not one
 * familyId for the whole extended family (which would make a valid draw impossible).
 *
 * Structure used below:
 *  - Grandparents:      Mom + Dad                                  (2)
 *  - Me + spouse:        + 2 kids with no children of their own     (4)
 *  - My 3 grandkid sub-households (adult child + their own kid(s)):
 *      - 3 households of (adult child + 1 grandchild)               (2 each = 6)
 *      - 1 household of (oldest adult child + 2 grandchildren)       (3)
 *  - Sister + spouse + 6 kids                                       (8)
 *  - Brother + spouse + 2 kids                                      (4)
 *
 * Total: 27 people across 8 households, largest household = 8 (~30% of pool).
 */
function buildRealFamily() {
  const users = [];
  let uid = 0;
  const add = (familyId) => {
    uid++;
    users.push({ id: `u${uid}`, familyId });
  };

  // Grandparents
  add('grandparents');
  add('grandparents');

  // Me + spouse + 2 kids without children of their own
  ['me-household', 'me-household', 'me-household', 'me-household'].forEach(add);

  // 3 grandkid sub-households of size 2 (adult child + 1 grandchild)
  for (let i = 0; i < 3; i++) {
    const fam = `my-kid-${i}-household`;
    add(fam);
    add(fam);
  }

  // Oldest adult child's household of 3 (adult child + 2 grandchildren)
  add('my-oldest-kid-household');
  add('my-oldest-kid-household');
  add('my-oldest-kid-household');

  // Sister + spouse + 6 kids
  for (let i = 0; i < 8; i++) add('sister-household');

  // Brother + spouse + 2 kids
  for (let i = 0; i < 4; i++) add('brother-household');

  return users;
}

describe('performDraw against the real Uhrick family structure', () => {
  it('produces 27 people across 8 households with the largest household at 8', () => {
    const users = buildRealFamily();
    expect(users).toHaveLength(27);
    const householdSizes = users.reduce((acc, u) => {
      acc[u.familyId] = (acc[u.familyId] || 0) + 1;
      return acc;
    }, {});
    expect(Object.keys(householdSizes)).toHaveLength(8);
    expect(Math.max(...Object.values(householdSizes))).toBe(8);
  });

  it('succeeds and never assigns someone inside their own household', () => {
    const users = buildRealFamily();
    const result = performDraw(users);

    expect(result.success).toBe(true);
    expect(Object.keys(result.assignments)).toHaveLength(users.length);

    const byId = Object.fromEntries(users.map(u => [u.id, u]));
    for (const [buyerId, recipientId] of Object.entries(result.assignments)) {
      expect(buyerId).not.toBe(recipientId);
      expect(byId[buyerId].familyId).not.toBe(byId[recipientId].familyId);
    }

    // Every recipient should be assigned exactly once (it's a full permutation)
    const recipients = Object.values(result.assignments);
    expect(new Set(recipients).size).toBe(users.length);
  });

  it('reliably succeeds across many independent draws (no flaky low-probability failures)', () => {
    const users = buildRealFamily();
    const attempts = 100;
    let successes = 0;

    for (let i = 0; i < attempts; i++) {
      const result = performDraw(users);
      if (result.success) successes++;
    }

    // At this household size/imbalance, the algorithm should essentially never fail.
    expect(successes).toBe(attempts);
  });

  it('fails gracefully when one household is a majority of the whole family', () => {
    const users = [];
    let uid = 0;
    // One household of 15 (a majority of 27) - mathematically no valid derangement exists
    for (let i = 0; i < 15; i++) users.push({ id: `big${uid++}`, familyId: 'huge-household' });
    for (let i = 0; i < 12; i++) users.push({ id: `small${uid++}`, familyId: `other-${i % 4}` });

    const result = performDraw(users);
    expect(result.success).toBe(false);
    expect(result.message).toContain('valid combination');
  });
});
