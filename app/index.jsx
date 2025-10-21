import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LogBox } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { ToastProvider } from './context/ToastContext';
import Constants from 'expo-constants';

LogBox.ignoreAllLogs(true);

let API_URL = process.env.EXPO_PUBLIC_API_URL;

if (process.env.NODE_ENV !== 'production') {
   API_URL = Constants.expoGoConfig?.debuggerHost
      ?.split(':')
      .shift()
      ?.concat(':6600/api');
}

fetch(
   Constants.expoGoConfig?.debuggerHost?.split(':').shift()?.concat(':6600')
).then((res) => {
   res.json().then((data) => {
      console.log('API STATUS:', data.status);
   });
});

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
               <ToastProvider>
                  <StackNavigator />
               </ToastProvider>
            </AuthProvider>
         </PaperProvider>
      </ThemeProvider>
   );
}
