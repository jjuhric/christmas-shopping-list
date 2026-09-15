import { GRANDCHILD_RELATIONS } from './relations';

export function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Kids ("Child"/managed profiles, no login of their own) and "Extra" people
// (added just to track a personal buy-for-list item, like a teacher or
// grandparent outside the exchange) are never real draw participants - they
// exist purely for tracking wishlists/shopping. Adults are only eligible once
// they've actually signed in at least once, since some invited adults may
// never end up participating. An explicit excludeFromDraw flag remains as a
// manual override for any adult who should sit out a particular year.
export function getDrawEligibleUsers(users) {
  return users.filter(u => !u.isManaged && !u.isExtra && !u.excludeFromDraw && u.hasSignedIn);
}

// A grandchild (relation Grandson/Granddaughter) is exempt from the default
// same-family block, but ONLY with the specific grandparent who added them -
// they remain blocked from everyone else in that family group, including
// their own parent if that parent is also a member of the same group.
export function isGrandchildExemptPair(a, b) {
  const aIsGrandchildOfB = GRANDCHILD_RELATIONS.includes(a.relation) && a.addedByUserId === b.id;
  const bIsGrandchildOfA = GRANDCHILD_RELATIONS.includes(b.relation) && b.addedByUserId === a.id;
  return aIsGrandchildOfB || bIsGrandchildOfA;
}

function isAllowedPair(buyer, recipient) {
  if (buyer.id === recipient.id) return false;
  const sameFamily = buyer.familyId && recipient.familyId && buyer.familyId.toLowerCase() === recipient.familyId.toLowerCase();
  if (!sameFamily) return true;
  return isGrandchildExemptPair(buyer, recipient);
}

// Finds a valid buyer -> recipient assignment (everyone buys for exactly one
// other person, everyone receives from exactly one other person) respecting
// isAllowedPair, using bipartite matching (Kuhn's algorithm) rather than
// randomly guessing full permutations and checking validity. A large,
// tightly-blocked household (e.g. one family group with 10+ members) makes a
// valid arrangement rare enough that blind random guessing can fail to find
// one even when a valid arrangement exists - this always finds one if it
// exists, and correctly reports failure only when it truly doesn't.
// Candidate order is shuffled so re-running produces a different result.
function findAssignment(users) {
  const n = users.length;
  const candidates = users.map((buyer, buyerIndex) =>
    shuffle(users.map((_, j) => j).filter(j => j !== buyerIndex && isAllowedPair(buyer, users[j])))
  );
  const recipientOwner = new Array(n).fill(-1); // recipient index -> buyer index

  function tryAssign(buyerIndex, visited) {
    for (const recipientIndex of candidates[buyerIndex]) {
      if (visited.has(recipientIndex)) continue;
      visited.add(recipientIndex);
      if (recipientOwner[recipientIndex] === -1 || tryAssign(recipientOwner[recipientIndex], visited)) {
        recipientOwner[recipientIndex] = buyerIndex;
        return true;
      }
    }
    return false;
  }

  const buyerOrder = shuffle(users.map((_, i) => i));
  for (const buyerIndex of buyerOrder) {
    if (!tryAssign(buyerIndex, new Set())) {
      return null;
    }
  }

  const assignments = {};
  for (let recipientIndex = 0; recipientIndex < n; recipientIndex++) {
    const buyerIndex = recipientOwner[recipientIndex];
    assignments[users[buyerIndex].id] = users[recipientIndex].id;
  }
  return assignments;
}

export function performDraw(users) {
  if (users.length < 3) {
    return { success: false, message: 'Need at least 3 users across families to conduct the draw.' };
  }

  const assignments = findAssignment(users);

  if (!assignments) {
    return { success: false, message: 'Could not find a valid combination where no family member buys for their own family. Please make sure there are enough different families with balanced members.' };
  }

  return { success: true, assignments };
}
