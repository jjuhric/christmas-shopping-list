import { describe, it, expect } from 'vitest';
import { shuffle, performDraw, getDrawEligibleUsers, isGrandchildExemptPair } from '../../utils/drawUtils';

describe('Draw Algorithm (drawUtils.js)', () => {

  describe('shuffle', () => {
    it('produces a permutation of the same elements', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffle([...original]);
      expect(shuffled).toHaveLength(original.length);
      expect(shuffled.sort()).toEqual(original.sort());
    });

    it('is non-deterministic (arrays differ occasionally)', () => {
      const original = Array.from({ length: 50 }, (_, i) => i);
      const shuffled1 = shuffle([...original]);
      const shuffled2 = shuffle([...original]);
      // Small chance they are identical, but with 50 elements practically impossible
      expect(shuffled1).not.toEqual(shuffled2);
    });
  });

  describe('performDraw', () => {
    it('fails when there are fewer than 3 users', () => {
      const users = [
        { id: '1', familyId: 'A' },
        { id: '2', familyId: 'B' }
      ];
      const result = performDraw(users);
      expect(result.success).toBe(false);
      expect(result.message).toContain('at least 3 users');
    });

    it('succeeds with valid users across different families', () => {
      const users = [
        { id: '1', familyId: 'A' },
        { id: '2', familyId: 'A' },
        { id: '3', familyId: 'B' },
        { id: '4', familyId: 'B' },
        { id: '5', familyId: 'C' },
      ];
      const result = performDraw(users);
      
      expect(result.success).toBe(true);
      expect(Object.keys(result.assignments)).toHaveLength(5);
      
      // Verify rules: no self-assignment, no same-family assignment
      const usersById = users.reduce((acc, u) => { acc[u.id] = u; return acc; }, {});
      
      for (const [buyerId, recipientId] of Object.entries(result.assignments)) {
        expect(buyerId).not.toBe(recipientId);
        
        const buyer = usersById[buyerId];
        const recipient = usersById[recipientId];
        
        expect(buyer.familyId).not.toBe(recipient.familyId);
      }
    });

    it('fails gracefully when all users share the same family (impossible valid draw)', () => {
      const users = [
        { id: '1', familyId: 'A' },
        { id: '2', familyId: 'A' },
        { id: '3', familyId: 'A' },
        { id: '4', familyId: 'A' }
      ];
      const result = performDraw(users);
      expect(result.success).toBe(false);
      expect(result.message).toContain('valid combination');
    });

    it('succeeds for many families', () => {
      const users = Array.from({ length: 20 }, (_, i) => ({
        id: `user-${i}`,
        familyId: `fam-${i % 4}`
      }));
      const result = performDraw(users);
      expect(result.success).toBe(true);
    });

    it('still blocks a grandchild from their own parent even when both share a household with the grandparent', () => {
      const users = [
        { id: 'grandparent', familyId: 'A' },
        { id: 'parent', familyId: 'A', relation: 'Son/Step-Son', addedByUserId: 'grandparent' },
        { id: 'grandkid', familyId: 'A', relation: 'Grandson', addedByUserId: 'grandparent' },
        { id: 'outsider1', familyId: 'B' },
        { id: 'outsider2', familyId: 'B' },
      ];
      const result = performDraw(users);

      expect(result.success).toBe(true);
      const byId = Object.fromEntries(users.map(u => [u.id, u]));
      for (const [buyerId, recipientId] of Object.entries(result.assignments)) {
        const buyer = byId[buyerId];
        const recipient = byId[recipientId];
        if (buyer.id === 'grandkid' && recipient.id === 'parent') {
          throw new Error('grandkid should never be assigned their own parent');
        }
        if (buyer.id === 'parent' && recipient.id === 'grandkid') {
          throw new Error('parent should never be assigned their own child');
        }
      }
    });
  });

  describe('isGrandchildExemptPair', () => {
    it('exempts a grandchild specifically with the grandparent who added them', () => {
      const grandparent = { id: 'g1' };
      const grandkid = { id: 'k1', relation: 'Granddaughter', addedByUserId: 'g1' };
      expect(isGrandchildExemptPair(grandkid, grandparent)).toBe(true);
      expect(isGrandchildExemptPair(grandparent, grandkid)).toBe(true);
    });

    it('does not exempt the grandchild from anyone else, even in the same family', () => {
      const grandkid = { id: 'k1', relation: 'Grandson', addedByUserId: 'g1' };
      const someoneElse = { id: 'someone-else' };
      expect(isGrandchildExemptPair(grandkid, someoneElse)).toBe(false);
    });

    it('does not exempt a Son/Daughter relation (labels only, no exclusion effect)', () => {
      const parent = { id: 'p1' };
      const child = { id: 'c1', relation: 'Son/Step-Son', addedByUserId: 'p1' };
      expect(isGrandchildExemptPair(child, parent)).toBe(false);
    });
  });

  describe('getDrawEligibleUsers', () => {
    it('removes users flagged excludeFromDraw (e.g. an adult sitting out this year)', () => {
      const users = [
        { id: '1', familyId: 'A', hasSignedIn: true },
        { id: '2', familyId: 'A', hasSignedIn: true, excludeFromDraw: true },
        { id: '3', familyId: 'B', hasSignedIn: true, excludeFromDraw: false },
      ];
      const eligible = getDrawEligibleUsers(users);
      expect(eligible.map(u => u.id)).toEqual(['1', '3']);
    });

    it('always removes Child (managed) profiles regardless of any other flag', () => {
      const users = [
        { id: 'adult', familyId: 'A', hasSignedIn: true },
        { id: 'kid', familyId: 'A', isManaged: true, hasSignedIn: true },
      ];
      expect(getDrawEligibleUsers(users).map(u => u.id)).toEqual(['adult']);
    });

    it('removes "Extra" people added just for someone\'s personal buy-for list', () => {
      const users = [
        { id: 'adult', familyId: 'A', hasSignedIn: true },
        { id: 'grandma', familyId: 'A', isExtra: true, hasSignedIn: true },
      ];
      expect(getDrawEligibleUsers(users).map(u => u.id)).toEqual(['adult']);
    });

    it('removes adults who have never actually signed in', () => {
      const users = [
        { id: 'active', familyId: 'A', hasSignedIn: true },
        { id: 'invited-not-yet-signed-in', familyId: 'A', hasSignedIn: false },
      ];
      expect(getDrawEligibleUsers(users).map(u => u.id)).toEqual(['active']);
    });
  });

});
