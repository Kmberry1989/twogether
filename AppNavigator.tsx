import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from './OnboardingScreen';
import HomeScreen from './HomeScreen';
import ActivityScreen from './ActivityScreen';
import PictionaryScreen from './PictionaryScreen';
import MusicLayerScreen from './MusicLayerScreen';
import JourneyScreen from './JourneyScreen';
import SettingsScreen from './SettingsScreen';
import RewardsScreen from './RewardsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Activity" component={ActivityScreen} />
        <Stack.Screen name="Pictionary" component={PictionaryScreen} />
        <Stack.Screen name="MusicLayer" component={MusicLayerScreen} />
        <Stack.Screen name="Journey" component={JourneyScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Rewards" component={RewardsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
