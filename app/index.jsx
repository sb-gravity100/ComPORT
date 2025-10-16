import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
   return (
      <ThemeProvider>
         <PaperProvider>
            <StackNavigator />
         </PaperProvider>
      </ThemeProvider>
   );
}
