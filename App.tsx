import React from 'react';
import { AuthProvider } from './AuthContext';
import { GlobalProvider } from './GlobalContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from './OnboardingScreen';
import HomeScreen from './HomeScreen';
import ActivityScreen from './ActivityScreen';
import JourneyScreen from './JourneyScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <GlobalProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Onboarding">
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Activity" component={ActivityScreen} />
            <Stack.Screen name="Journey" component={JourneyScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GlobalProvider>
    </AuthProvider>
  );
}
