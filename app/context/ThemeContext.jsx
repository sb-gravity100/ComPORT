import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../constants/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
   const systemScheme = useColorScheme();
   const [isDark, setIsDark] = useState(systemScheme === 'dark');

   useEffect(() => {
      setIsDark(systemScheme === 'dark');
   }, [systemScheme]);

   const theme = isDark ? darkTheme : lightTheme;

   const toggleTheme = () => setIsDark(!isDark);

   return (
      <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
         {children}
      </ThemeContext.Provider>
   );
};

export const useTheme = () => useContext(ThemeContext);
