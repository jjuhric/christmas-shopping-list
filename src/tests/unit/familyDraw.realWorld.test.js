import { describe, it, expect } from 'vitest';
import { performDraw } from '../../utils/drawUtils';

/**
 * Models the Uhrick family's actual structure to validate that performDraw()
 * scales to a real multi-generational household with lopsided group sizes.
 *
 * Household = the exclusion unit (familyId): everyone in the same household is
 * blocked from drawing each other, EXCEPT a grandchild (relation Grandson/
 * Granddaughter) is exempt specifically with the grandparent who added them
 * (addedByUserId) - they remain blocked from everyone else in the household,
 * including their own parent if that parent is also a member.
 *
 * This means grandkids no longer need their own separate household group -
 * they can live in the same group as their grandparent and parent, and the
 * exemption handles the one pairing that needs to be allowed.
 *
 * Structure used below:
 *  - Grandparents:  Mom + Dad                                              (2)
 *  - My household:  me + spouse + 6 kids + 4 grandkids (3 kids with 1 each,
 *                    oldest kid with 2), all one group                     (12)
 *  - Sister household: spouse + 6 kids                                     (8)
 *  - Brother household: spouse + 2 kids                                    (4)
 *
 * Total: 26 people across 4 households, largest household = 12 (~46% of pool).
 */
function buildRealFamily() {
  const users = [];

  // Grandparents
  users.push({ id: 'mom', familyId: 'grandparents' });
  users.push({ id: 'dad', familyId: 'grandparents' });

  // Me + spouse
  users.push({ id: 'me', familyId: 'my-household' });
  users.push({ id: 'spouse', familyId: 'my-household' });

  // My 6 kids, all labeled Son/Daughter (label only, no exclusion effect)
  for (let i = 1; i <= 6; i++) {
    users.push({ id: `kid${i}`, familyId: 'my-household', relation: 'Son/Step-Son', addedByUserId: 'me' });
  }

  // 3 kids have 1 grandchild each, exempt only with me (their grandparent)
  for (let i = 1; i <= 3; i++) {
    users.push({ id: `grandkid${i}`, familyId: 'my-household', relation: 'Grandson', addedByUserId: 'me' });
  }
  // Oldest kid (kid1) has 2 grandchildren instead of 1
  users.push({ id: 'grandkid4', familyId: 'my-household', relation: 'Granddaughter', addedByUserId: 'me' });

  // Sister + spouse + 6 kids
  for (let i = 0; i < 8; i++) users.push({ id: `sisterfam${i}`, familyId: 'sister-household' });

  // Brother + spouse + 2 kids
  for (let i = 0; i < 4; i++) users.push({ id: `brotherfam${i}`, familyId: 'brother-household' });

  return users;
}

describe('performDraw against the real Uhrick family structure', () => {
  it('produces 26 people across 4 households with the largest household at 12', () => {
    const users = buildRealFamily();
    expect(users).toHaveLength(26);
    const householdSizes = users.reduce((acc, u) => {
      acc[u.familyId] = (acc[u.familyId] || 0) + 1;
      return acc;
    }, {});
    expect(Object.keys(householdSizes)).toHaveLength(4);
    expect(householdSizes['my-household']).toBe(12);
  });

  it('lets grandkids draw/be drawn by their grandparent, but not by their own parent or anyone else in the household', () => {
    const users = buildRealFamily();
    const result = performDraw(users);

    expect(result.success).toBe(true);
    const byId = Object.fromEntries(users.map(u => [u.id, u]));

    for (const [buyerId, recipientId] of Object.entries(result.assignments)) {
      const buyer = byId[buyerId];
      const recipient = byId[recipientId];
      expect(buyerId).not.toBe(recipientId);

      if (buyer.familyId === recipient.familyId) {
        // The only same-household pairing allowed is a grandchild <-> the
        // specific grandparent who added them.
        const buyerIsExemptGrandchild = buyer.addedByUserId === recipient.id && ['Grandson', 'Granddaughter'].includes(buyer.relation);
        const recipientIsExemptGrandchild = recipient.addedByUserId === buyer.id && ['Grandson', 'Granddaughter'].includes(recipient.relation);
        expect(buyerIsExemptGrandchild || recipientIsExemptGrandchild).toBe(true);
      }
    }
  });

  it('reliably succeeds across many independent draws despite the larger 12-person household', () => {
    const users = buildRealFamily();
    const attempts = 100;
    let successes = 0;

    for (let i = 0; i < attempts; i++) {
      const result = performDraw(users);
      if (result.success) successes++;
    }

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
