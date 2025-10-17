import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LogBox, StyleSheet, Text } from 'react-native';
import LoadingScreen from './components/Loading';
import Font from 'expo-font';
import { sharedStyles } from './constants/theme';

LogBox.ignoreAllLogs(true);

export default function App() {
   const [preloaded, setPreloaded] = useState(false);

   useEffect(() => {
      const preload = async () => {};
      preload().then(() => {
         setPreloaded(() => true);
      });
   }, []);

   return (
      <ThemeProvider>
         <PaperProvider>
            <AuthProvider>
               <StackNavigator />
            </AuthProvider>
         </PaperProvider>
      </ThemeProvider>
   );
}
