import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LogBox } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';

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
