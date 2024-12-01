import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import MainStackNavigator from './navigation/MainStackNavigator';

export default function App() {
  return (
    <PaperProvider>
      <MainStackNavigator />
    </PaperProvider>
  );
}