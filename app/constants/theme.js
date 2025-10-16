// theme.js - Universal styling file for ComPORT

export const colors = {
   // Primary Colors
   primary: '#00d4ff',
   primaryDark: '#00a8cc',
   primaryLight: '#33ddff',

   // Background Colors
   bgPrimary: '#1a1a2e',
   bgSecondary: '#16213e',
   bgTertiary: '#0f3460',

   // Surface Colors
   surface: 'rgba(255, 255, 255, 0.08)',
   surfaceBorder: 'rgba(255, 255, 255, 0.1)',

   // Text Colors
   textPrimary: '#ffffff',
   textSecondary: '#a0a0b0',
   textMuted: '#6a6a7a',
   textDark: '#1a1a2e',

   // Status Colors
   success: '#00ff88',
   warning: '#ffaa00',
   error: '#ff4466',
   info: '#00d4ff',
};

export const gradients = {
   primary: ['#1a1a2e', '#16213e', '#1e4c85ff'],
   primaryReverse: ['#0f3460', '#16213e', '#1a1a2e'],
   accent: ['#00d4ff', '#00a8cc', '#0088aa'],
};

export const spacing = {
   xs: 4,
   sm: 8,
   md: 16,
   lg: 24,
   xl: 32,
   xxl: 48,
};

export const borderRadius = {
   sm: 8,
   md: 12,
   lg: 16,
   xl: 20,
   round: 999,
};

export const typography = {
   // Font Sizes
   xs: 11,
   sm: 13,
   md: 15,
   lg: 18,
   xl: 22,
   xxl: 28,
   xxxl: 48,

   // Font Weights
   regular: '400',
   medium: '500',
   semiBold: '600',
   bold: '700',
   extraBold: '800',

   // Letter Spacing
   tight: -0.5,
   normal: 0,
   wide: 0.5,
   wider: 1,
   widest: 2,
};

export const shadows = {
   sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
   },
   md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
   },
   lg: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
   },
   glow: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
   },
};

export const components = {
   // Button Styles
   primaryButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      ...shadows.lg,
   },
   secondaryButton: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
   },

   // Card Styles
   card: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
   },

   // Input Styles
   input: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      color: colors.textPrimary,
      fontSize: typography.md,
   },

   // Container Styles
   container: {
      flex: 1,
      backgroundColor: colors.bgPrimary,
      padding: spacing.lg,
   },

   // Text Styles
   heading1: {
      fontSize: typography.xxxl,
      fontWeight: typography.extraBold,
      color: colors.primary,
      letterSpacing: typography.widest,
      ...shadows.glow,
   },
   heading2: {
      fontSize: typography.xxl,
      fontWeight: typography.bold,
      color: colors.textPrimary,
      letterSpacing: typography.wide,
   },
   heading3: {
      fontSize: typography.xl,
      fontWeight: typography.semiBold,
      color: colors.textPrimary,
   },
   body: {
      fontSize: typography.md,
      fontWeight: typography.regular,
      color: colors.textPrimary,
   },
   subtitle: {
      fontSize: typography.md,
      color: colors.textSecondary,
      letterSpacing: typography.wide,
   },
   caption: {
      fontSize: typography.sm,
      color: colors.textMuted,
   },
};

// Utility function to create consistent spacing
export const createSpacing = (...values) => {
   return values.map((v) => spacing[v] || v).join(' ');
};

// Utility function for opacity
export const withOpacity = (color, opacity) => {
   return `${color}${Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0')}`;
};

export default {
   colors,
   gradients,
   spacing,
   borderRadius,
   typography,
   shadows,
   components,
   createSpacing,
   withOpacity,
};
