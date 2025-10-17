import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { lightTheme, darkTheme } from '../constants/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
   const systemScheme = useColorScheme();
   const [isDark, setIsDark] = useState(systemScheme === 'dark');

   useEffect(() => {
      const loadTheme = async () => {
         const stored = await SecureStore.getItemAsync('colorScheme');
         if (stored === 'dark' || stored === 'light') {
            setIsDark(stored === 'dark');
         } else {
            setIsDark(systemScheme === 'dark');
         }
      };
      loadTheme();
   }, [systemScheme]);

   const theme = isDark ? darkTheme : lightTheme;

   const toggleTheme = async () => {
      const newScheme = !isDark ? 'dark' : 'light';
      setIsDark(!isDark);
      await SecureStore.setItemAsync('colorScheme', newScheme);
   };

   return (
      <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
         {children}
      </ThemeContext.Provider>
   );
};

export const useTheme = () => useContext(ThemeContext);
