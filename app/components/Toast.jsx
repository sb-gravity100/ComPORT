import React, { useEffect, useRef } from 'react';
import {
   Animated,
   StyleSheet,
   Text,
   View,
   TouchableOpacity,
   Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ToastItem({
   id,
   message,
   type = 'info',
   duration = 3000,
   onDismiss,
}) {
   const { theme } = useTheme();
   const { colors } = theme;
   const opacity = useRef(new Animated.Value(0)).current;
   const translateY = useRef(new Animated.Value(-20)).current;
   const progress = useRef(new Animated.Value(0)).current;

   const radius = 10;
   const circumference = 2 * Math.PI * radius;

   useEffect(() => {
      // Show animation
      Animated.parallel([
         Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
         }),
         Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
         }),
      ]).start();

      // Countdown animation
      Animated.timing(progress, {
         toValue: 1,
         duration: duration,
         useNativeDriver: true,
      }).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
         hideToast();
      }, duration);

      return () => clearTimeout(timer);
   }, []);

   const hideToast = () => {
      Animated.parallel([
         Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
         }),
         Animated.timing(translateY, {
            toValue: -20,
            duration: 300,
            useNativeDriver: true,
         }),
      ]).start(() => {
         onDismiss(id);
      });
   };

   const getTypeConfig = () => {
      switch (type) {
         case 'success':
            return {
               icon: 'check-circle',
               color: colors.success,
               bg: colors.surface, // Solid background
               iconBg: theme.withOpacity(colors.success, 0.15), // Icon background
            };
         case 'error':
            return {
               icon: 'error',
               color: colors.error,
               bg: colors.surface,
               iconBg: theme.withOpacity(colors.error, 0.15),
            };
         case 'warning':
            return {
               icon: 'warning',
               color: colors.warning,
               bg: colors.surface,
               iconBg: theme.withOpacity(colors.warning, 0.15),
            };
         default:
            return {
               icon: 'info',
               color: colors.info,
               bg: colors.surface,
               iconBg: theme.withOpacity(colors.info, 0.15),
            };
      }
   };

   const config = getTypeConfig();

   const strokeDashoffset = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [circumference, 0],
   });
   // console.log(theme.colors);

   return (
      <Animated.View
         style={[
            styles.toastWrapper,
            {
               opacity,
               transform: [{ translateY }],
            },
         ]}
      >
         <TouchableOpacity
            activeOpacity={1}
            onPress={hideToast}
            style={[
               styles.toast,
               {
                  backgroundColor: config.bg,
                  borderLeftColor: config.color,
                  backgroundColor: theme.colors.bgSecondary,
               },
            ]}
         >
            <View
               style={[
                  styles.iconContainer,
                  { backgroundColor: config.iconBg },
               ]}
            >
               <MaterialIcons
                  name={config.icon}
                  size={20}
                  color={config.color}
               />
            </View>
            <Text
               style={[styles.message, { color: colors.textPrimary }]}
               numberOfLines={2}
               ellipsizeMode="tail"
            >
               {message}
            </Text>
            <View style={styles.countdownContainer}>
               <Svg width={24} height={24} style={styles.countdownSvg}>
                  {/* Background circle */}
                  <Circle
                     cx={12}
                     cy={12}
                     r={radius}
                     stroke={theme.withOpacity(colors.textMuted, 0.2)}
                     strokeWidth={2}
                     fill="none"
                  />
                  {/* Animated progress circle */}
                  <AnimatedCircle
                     cx={12}
                     cy={12}
                     r={radius}
                     stroke={config.color}
                     strokeWidth={2}
                     fill="none"
                     strokeDasharray={circumference}
                     strokeDashoffset={strokeDashoffset}
                     strokeLinecap="round"
                     rotation="-90"
                     origin="12, 12"
                  />
               </Svg>
            </View>
         </TouchableOpacity>
      </Animated.View>
   );
}

const styles = StyleSheet.create({
   toastWrapper: {
      width: '100%',
      marginBottom: 8,
      alignItems: 'center',
      justifyContent: 'center',
   },
   toast: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderLeftWidth: 4,
      gap: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      // shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 2,
      maxWidth: SCREEN_WIDTH,
      minWidth: 180,
      alignSelf: 'center',
      // backgroundColor: theme.colors.bgPrimary,
   },
   iconContainer: {
      width: 20,
      height: 20,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
   },
   message: {
      // flex: 1,
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 18,
   },
   countdownContainer: {
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
   },
   countdownSvg: {
      transform: [{ rotate: '0deg' }],
   },
});
