import React from 'react';
import { render } from '@testing-library/react-native';
import RewardsScreen from '../RewardsScreen';
import { GlobalContext } from '../GlobalContext';
import { ThemeContext, lightTheme } from '../ThemeContext';

describe('RewardsScreen', () => {
  const history = Array(8).fill({ sessionId: 'x', activityId: 'trivia', turn: 'A', response: {}, mediaUrls: [], timestamp: Date.now() });
  const globalValue = {
    couple: { partnerA: { name: 'A', avatarUri: null }, partnerB: { name: 'B', avatarUri: null }, coupleId: 'cpl_test' },
    setCouple: jest.fn(),
    session: null,
    setSession: jest.fn(),
    history,
  };
  const themeValue = { theme: lightTheme, toggleTheme: jest.fn() };

  it('displays total sessions, points, and badges', () => {
    const { getByText, queryByText } = render(
      <GlobalContext.Provider value={globalValue as any}>
        <ThemeContext.Provider value={themeValue as any}>
          <RewardsScreen />
        </ThemeContext.Provider>
      </GlobalContext.Provider>
    );

    expect(getByText('Total Sessions:')).toBeTruthy();
    expect(getByText('8')).toBeTruthy();
    expect(getByText('Total Points:')).toBeTruthy();
    expect(getByText('80')).toBeTruthy();
    // Badges
    expect(getByText('🎉 First Activity Completed')).toBeTruthy();
    expect(getByText('🏆 7-Day Streak')).toBeTruthy();
    expect(queryByText('🥇 30 Sessions Milestone')).toBeNull();
  });
});
