import React from 'react';
import { AuthProvider } from './AuthContext';
import { GlobalProvider } from './GlobalContext';
import { ThemeProvider, useTheme } from './ThemeContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from './OnboardingScreen';
import MainTabNavigator from './MainTabNavigator';
import ActivityScreen from './ActivityScreen';
import PictionaryScreen from './PictionaryScreen';
import MusicLayerScreen from './MusicLayerScreen';
import CharadesScreen from './CharadesScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  const { theme } = useTheme();
  // Navigation theme matches our color palette
  const navTheme = {
    dark: theme.colors.background !== '#FFFFFF',
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="Activity" component={ActivityScreen} />
        <Stack.Screen name="Pictionary" component={PictionaryScreen} />
        <Stack.Screen name="MusicLayer" component={MusicLayerScreen} />
        <Stack.Screen name="Charades" component={CharadesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GlobalProvider>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </GlobalProvider>
    </AuthProvider>
  );
}
