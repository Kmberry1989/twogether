/**
 * A simple E2E test:
 * - Launch the app
 * - Sign up
 * - Wait for Home to load a trivia activity
 * - Select the first option
 * - Submit and verify in Journey
 */

describe('First Activity Flow', () => {
  beforeAll(async () => {
    await detox.init();
  });

  afterAll(async () => {
    await detox.cleanup();
  });

  it('completes a trivia and sees it in journey', async () => {
    // Onboarding
    await element(by.id('email-input')).tap();
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).tap();
    await element(by.id('password-input')).typeText('password');
    await element(by.id('signup-button')).tap();

    // Home screen
    await waitFor(element(by.text("Today's Activity")))
      .toBeVisible()
      .withTimeout(5000);

    // Answer trivia
    await element(by.id('option-0')).tap();
    await element(by.id('submit-button')).tap();

    // Verify in Journey
    await element(by.id('tab-Journey')).tap();
    await expect(element(by.text(/Activity:/))).toBeVisible();
  });
});