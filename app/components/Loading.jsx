// components/LoadingScreen.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

export default function LoadingScreen() {
   const { theme } = useTheme();
   const { colors, gradients } = theme;

   return (
      <LinearGradient colors={gradients.primary} style={styles.container}>
         <ActivityIndicator size="large" color={colors.primary} />
      </LinearGradient>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
});
