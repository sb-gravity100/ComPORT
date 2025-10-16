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
import theme from '../constants/theme';

const {
   colors,
   gradients,
   spacing,
   borderRadius,
   typography,
   shadows,
   components,
} = theme;

export default function HomeScreen() {
   const navigation = useNavigation();

   return (
      <>
         <StatusBar barStyle="light-content" />
         <LinearGradient colors={gradients.primary} style={styles.container}>
            <View style={styles.header}>
               <Text style={styles.title}>ComPORT</Text>
               <Text style={styles.subtitle}>Build your perfect PC bundle</Text>
            </View>

            <View style={styles.buttonContainer}>
               <TouchableOpacity
                  style={styles.primaryButton}
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
                        <Text style={styles.primaryButtonText}>
                           Start Building
                        </Text>
                        <Text style={styles.buttonSubtext}>
                           Create your custom PC
                        </Text>
                     </View>
                  </View>
               </TouchableOpacity>

               <View style={styles.secondaryButtons}>
                  <TouchableOpacity
                     style={styles.secondaryButton}
                     onPress={() => navigation.navigate('Catalog')}
                     activeOpacity={0.8}
                  >
                     <Text style={styles.buttonIcon}>📦</Text>
                     <Text style={styles.secondaryButtonText}>
                        Browse Parts
                     </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                     style={styles.secondaryButton}
                     onPress={() => navigation.navigate('Profile')}
                     activeOpacity={0.8}
                  >
                     <Text style={styles.buttonIcon}>👤</Text>
                     <Text style={styles.secondaryButtonText}>My Profile</Text>
                  </TouchableOpacity>
               </View>
            </View>

            <View style={styles.footer}>
               <Text style={styles.footerText}>
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
      paddingTop: spacing.xxl + spacing.md,
      paddingHorizontal: spacing.lg,
   },
   header: {
      alignItems: 'center',
      marginBottom: spacing.xxl + spacing.md,
   },
   title: {
      ...components.heading1,
      marginBottom: spacing.sm,
   },
   subtitle: {
      ...components.subtitle,
   },
   buttonContainer: {
      flex: 1,
      justifyContent: 'center',
   },
   primaryButton: {
      ...components.primaryButton,
      marginBottom: spacing.lg,
   },
   buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   buttonIcon: {
      fontSize: spacing.xl,
   },
   primaryButtonText: {
      color: colors.textDark,
      fontSize: typography.xl,
      fontWeight: typography.bold,
      marginBottom: spacing.xs,
   },
   buttonSubtext: {
      color: colors.bgSecondary,
      fontSize: typography.sm,
      opacity: 0.8,
   },
   secondaryButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.md,
   },
   secondaryButton: {
      ...components.secondaryButton,
      flex: 1,
      alignItems: 'center',
   },
   secondaryButtonText: {
      color: colors.textPrimary,
      fontSize: typography.md,
      fontWeight: typography.semiBold,
      marginTop: spacing.sm,
      textAlign: 'center',
   },
   footer: {
      alignItems: 'center',
      paddingBottom: spacing.xl + spacing.sm,
   },
   footerText: {
      ...components.caption,
      letterSpacing: typography.wider,
   },
});
