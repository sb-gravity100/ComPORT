import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import { PaperProvider } from 'react-native-paper';

export default function App() {
   return (
      <PaperProvider>
         <StackNavigator />
      </PaperProvider>
   );
}
