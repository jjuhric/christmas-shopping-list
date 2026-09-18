import { test, expect } from '@playwright/test';

// Signs a brand-new invited (non-admin) member into their own browser
// context via the Google emulator popup, then completes their two-step
// setup wizard. Returns the page, now sitting on the Dashboard - which is
// what actually sets `hasSignedIn: true` for them, the flag the draw's
// eligibility check requires.
async function signInAndCompleteSetup(browser, { email, name, familyName }) {
  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();
  await userPage.goto('/');

  const popupPromise = userContext.waitForEvent('page');
  await userPage.getByRole('button', { name: /Sign In With Google/i }).click();
  const popup = await popupPromise;

  await popup.waitForLoadState('networkidle');
  await popup.waitForTimeout(1000);
  try {
    await popup.getByRole('button', { name: /Add new account/i }).first().click({ force: true, timeout: 5000 });
  } catch (e) {
    console.log('Add new account button not found or timed out, assuming form is visible');
  }

  const emailInput = popup.locator('#email-input');
  await emailInput.waitFor({ state: 'attached', timeout: 10000 });
  await popup.waitForTimeout(1000); // Wait for tab animation
  await emailInput.click({ force: true });
  await popup.waitForTimeout(500);
  await emailInput.fill(email, { force: true });

  const nameInput = popup.locator('#display-name-input');
  if (await nameInput.count() > 0) {
    await nameInput.click({ force: true });
    await popup.waitForTimeout(500);
    await nameInput.fill(name, { force: true });
  }

  try {
    const signInSubmit = popup.getByRole('button', { name: /Sign in with Google\.com/i }).first();
    await signInSubmit.click({ force: true, timeout: 5000 });
  } catch (e) {
    await emailInput.press('Enter');
  }

  try {
    if (!popup.isClosed()) {
      const userBtn = popup.locator(`text=/${email}/i`).first();
      await userBtn.waitFor({ state: 'visible', timeout: 5000 });
      await userBtn.click();
    }
  } catch (e) {
    console.log('Popup closed or user button not found');
  }

  while (!popup.isClosed()) {
    await userPage.waitForTimeout(500);
  }

  // Complete Setup Wizard (non-admin: Step 1 -> Step 2 -> done)
  await expect(userPage.locator('h2', { hasText: 'Welcome to Christmas Shopping List!' })).toBeVisible({ timeout: 10000 });
  await userPage.getByPlaceholder('e.g. Jane Uhrick').fill(name);
  await userPage.getByPlaceholder('e.g. Uhrick').fill(familyName);
  await userPage.getByRole('button', { name: 'Continue to Wishlist' }).click();

  await expect(userPage.locator('h3', { hasText: 'Step 2: Add Gift Ideas to Your Wishlist' })).toBeVisible();
  await userPage.getByRole('button', { name: 'Complete Setup' }).click();

  await expect(userPage.getByText(/"Buy For" List/i)).toBeVisible({ timeout: 10000 });

  return userPage;
}

test.describe('Family Member Draw E2E Flow', () => {
  test.beforeEach(async ({ request }) => {
    try {
      await request.delete('http://localhost:8080/emulator/v1/projects/uhrick-christmas-list/databases/(default)/documents');
      await request.delete('http://localhost:9099/emulator/v1/projects/uhrick-christmas-list/accounts');
    } catch (e) {
      console.warn('Could not clear emulator data:', e);
    }
  });

  test('Master Admin invites users, performs the draw, and users see assignments', async ({ page, context }) => {
    // --- BROWSER CONTEXT 1: Master Admin ---
    const adminPage = await context.newPage();
    await adminPage.goto('/');

    const signInBtn = adminPage.getByRole('button', { name: /Sign In With Google/i });
    const pagePromise = context.waitForEvent('page');
    await signInBtn.click();
    const popup = await pagePromise;

    // Login as Admin
    await popup.waitForLoadState('networkidle');
    await popup.waitForTimeout(1000);
    try {
      await popup.getByRole('button', { name: /Add new account/i }).first().click({ force: true, timeout: 5000 });
    } catch (e) {
      console.log('Add new account button not found or timed out, assuming form is visible');
    }

    const emailInput = popup.locator('#email-input');
    await emailInput.waitFor({ state: 'attached', timeout: 10000 });
    await popup.waitForTimeout(1000); // Wait for tab animation
    await emailInput.click({ force: true });
    await popup.waitForTimeout(500);
    await emailInput.fill('admin@example.com', { force: true });

    const nameInput = popup.locator('#display-name-input');
    if (await nameInput.count() > 0) {
      await nameInput.click({ force: true });
      await popup.waitForTimeout(500);
      await nameInput.fill('Master Admin', { force: true });
    }

    try {
      const signInSubmit = popup.getByRole('button', { name: /Sign in with Google\.com/i }).first();
      await signInSubmit.click({ force: true, timeout: 5000 });
    } catch (e) {
      await emailInput.press('Enter');
    }

    try {
      if (!popup.isClosed()) {
        const userBtn = popup.locator('text=/admin@example.com/i').first();
        await userBtn.waitFor({ state: 'visible', timeout: 5000 });
        await userBtn.click();
      }
    } catch (e) {
      console.log('Popup closed or user button not found');
    }

    // Wait for the popup to close completely
    while (!popup.isClosed()) {
       await adminPage.waitForTimeout(500);
    }

    // Complete setup wizard for Admin (Step 1)
    await expect(adminPage.locator('h2', { hasText: 'Welcome to Christmas Shopping List!' })).toBeVisible({ timeout: 10000 });
    await adminPage.getByPlaceholder('e.g. Jane Uhrick').fill('Master Admin');
    await adminPage.getByPlaceholder('e.g. Uhrick').fill('FamilyOne');
    await adminPage.getByRole('button', { name: 'Continue to Wishlist' }).click();

    // Step 2: Wishlist
    await expect(adminPage.locator('h3', { hasText: 'Step 2: Add Gift Ideas to Your Wishlist' })).toBeVisible();
    await adminPage.getByRole('button', { name: 'Continue to Invite Members' }).click();

    // Step 3: Invite Family
    await expect(adminPage.locator('h3', { hasText: 'Step 3: Invite Family Members' })).toBeVisible();
    await adminPage.getByRole('button', { name: 'Ready to Finish' }).click();

    // Step 4: Finish
    await expect(adminPage.locator('h3', { hasText: "You're All Set!" })).toBeVisible();
    await adminPage.getByRole('button', { name: 'Enter Christmas Shopping List Dashboard' }).click();

    // Go to Admin Panel
    await adminPage.getByRole('link', { name: /Admin Panel/i }).click();

    // Invite User 2 (FamilyTwo)
    await adminPage.getByPlaceholder('Full Name').fill('User Two');
    await adminPage.getByPlaceholder('Google Email').fill('user2@example.com');
    await adminPage.getByPlaceholder('Family Name (e.g. Uhrick)').fill('FamilyTwo');
    await adminPage.getByRole('button', { name: 'Add & Send Invite' }).click();
    await expect(adminPage.getByText(/User created!/i)).toBeVisible();

    // Invite User 3 (FamilyThree - Different Family to allow a valid draw)
    await adminPage.getByPlaceholder('Full Name').fill('User Three');
    await adminPage.getByPlaceholder('Google Email').fill('user3@example.com');
    await adminPage.getByPlaceholder('Family Name (e.g. Uhrick)').fill('FamilyThree');
    await adminPage.getByRole('button', { name: 'Add & Send Invite' }).click();
    await expect(adminPage.getByText(/User created!/i)).toBeVisible();

    // Only members who have actually signed in at least once are eligible
    // for the draw - an invite alone isn't enough. Sign User Two and User
    // Three in and through their own setup wizard, each in their own
    // browser context, before the draw button can enable (needs 3+
    // eligible: Master Admin + User Two + User Three).
    const browser = adminPage.context().browser();
    await signInAndCompleteSetup(browser, { email: 'user2@example.com', name: 'User Two', familyName: 'FamilyTwo' });
    const userThreePage = await signInAndCompleteSetup(browser, { email: 'user3@example.com', name: 'User Three', familyName: 'FamilyThree' });

    // --- Perform the Draw ---
    // Admin.jsx fetches the member list once on mount rather than with a
    // live listener, so it still doesn't know User Two/Three have signed in.
    // Navigate away and back to force it to remount and refetch.
    await adminPage.goto('/#/');
    await adminPage.goto('/#/admin');
    await expect(adminPage.getByRole('heading', { name: /Admin Panel/i })).toBeVisible({ timeout: 10000 });
    const drawBtn = adminPage.getByRole('button', { name: /Run Christmas Shopping List Draw/i });
    await expect(drawBtn).toBeEnabled({ timeout: 10000 });
    adminPage.on('dialog', async dialog => {
      await dialog.accept();
    });
    await drawBtn.click();

    // Verify Draw Success
    await expect(adminPage.getByText(/Draw completed successfully/i)).toBeVisible({ timeout: 10000 });

    // --- User Three checks their assignment ---
    await userThreePage.reload();

    // Verify Assignment! Since User 3 is in FamilyThree, and Admin/User2 are in FamilyOne/FamilyTwo
    // User 3 must have drawn someone outside FamilyThree (Master Admin or User Two).
    await expect(userThreePage.getByText(/"Buy For" List/i)).toBeVisible({ timeout: 10000 });

    // We expect either Master Admin or User Two to be displayed as recipient
    await expect(userThreePage.getByText(/Master Admin|User Two/)).toBeVisible({ timeout: 5000 });
  });
});
