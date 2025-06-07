import React from 'react';
import { AuthProvider } from './AuthContext';
import { GlobalProvider } from './GlobalContext';
import AppNavigator from './AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <GlobalProvider>
        <AppNavigator />
      </GlobalProvider>
    </AuthProvider>
  );
}
