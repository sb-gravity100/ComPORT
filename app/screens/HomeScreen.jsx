import React from 'react';
import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen() {
   const navigation = useNavigation();
   const { theme, isDark, toggleTheme } = useTheme();
   const { colors, gradients, spacing, typography, components } = theme;

   return (
      <>
         <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
         <LinearGradient colors={gradients.primary} style={styles.container}>
            <TouchableOpacity
               style={[
                  styles.themeToggle,
                  { backgroundColor: colors.surface, top: 10, right: 10 },
               ]}
               onPress={toggleTheme}
            >
               <MaterialIcons
                  name={isDark ? 'light-mode' : 'dark-mode'}
                  size={24}
                  color={colors.primary}
               />
            </TouchableOpacity>

            <View style={styles.header}>
               <Text style={[styles.title, { color: colors.primary }]}>
                  ComPORT
               </Text>
               <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Build your perfect PC bundle
               </Text>
            </View>

            <View style={styles.buttonContainer}>
               <TouchableOpacity
                  style={[
                     styles.primaryButton,
                     { backgroundColor: colors.primary },
                  ]}
                  onPress={() => navigation.navigate('Builder')}
                  activeOpacity={0.8}
               >
                  <View style={styles.buttonContent}>
                     <Text
                        style={{
                           ...styles.buttonIcon,
                           marginRight: spacing.md,
                        }}
                     >
                        🔧
                     </Text>
                     <View>
                        <Text
                           style={[
                              styles.primaryButtonText,
                              { color: colors.textDark },
                           ]}
                        >
                           Start Building
                        </Text>
                        <Text
                           style={[
                              styles.buttonSubtext,
                              {
                                 color: isDark
                                    ? colors.bgSecondary
                                    : colors.textLight,
                              },
                           ]}
                        >
                           Create your custom PC
                        </Text>
                     </View>
                  </View>
               </TouchableOpacity>

               <View style={styles.secondaryButtons}>
                  <TouchableOpacity
                     style={[
                        styles.secondaryButton,
                        {
                           backgroundColor: colors.surface,
                           borderColor: colors.surfaceBorder,
                        },
                     ]}
                     onPress={() => navigation.navigate('Catalog')}
                     activeOpacity={0.8}
                  >
                     <Text style={styles.buttonIcon}>📦</Text>
                     <Text
                        style={[
                           styles.secondaryButtonText,
                           { color: colors.textPrimary },
                        ]}
                     >
                        Browse Parts
                     </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                     style={[
                        styles.secondaryButton,
                        {
                           backgroundColor: colors.surface,
                           borderColor: colors.surfaceBorder,
                        },
                     ]}
                     onPress={() => navigation.navigate('Profile')}
                     activeOpacity={0.8}
                  >
                     <Text style={styles.buttonIcon}>👤</Text>
                     <Text
                        style={[
                           styles.secondaryButtonText,
                           { color: colors.textPrimary },
                        ]}
                     >
                        My Profile
                     </Text>
                  </TouchableOpacity>
               </View>
            </View>

            <View style={styles.footer}>
               <Text style={[styles.footerText, { color: colors.textMuted }]}>
                  Compatible • Optimized • Accessible
               </Text>
            </View>
         </LinearGradient>
      </>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingTop: 80,
      paddingHorizontal: 24,
   },
   themeToggle: {
      position: 'absolute',
      top: 48,
      right: 24,
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
   },
   header: {
      alignItems: 'center',
      marginBottom: 64,
   },
   title: {
      fontSize: 48,
      fontWeight: '800',
      letterSpacing: 2,
      marginBottom: 8,
   },
   subtitle: {
      fontSize: 15,
      letterSpacing: 0.5,
   },
   buttonContainer: {
      flex: 1,
      justifyContent: 'center',
   },
   primaryButton: {
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
   },
   buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   buttonIcon: {
      fontSize: 32,
   },
   primaryButtonText: {
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 4,
   },
   buttonSubtext: {
      fontSize: 13,
      opacity: 0.8,
   },
   secondaryButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 16,
   },
   secondaryButton: {
      borderRadius: 16,
      padding: 24,
      borderWidth: 1,
      flex: 1,
      alignItems: 'center',
   },
   secondaryButtonText: {
      fontSize: 15,
      fontWeight: '600',
      marginTop: 8,
      textAlign: 'center',
   },
   footer: {
      alignItems: 'center',
      paddingBottom: 40,
   },
   footerText: {
      fontSize: 13,
      letterSpacing: 1,
   },
});
