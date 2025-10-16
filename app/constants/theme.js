// Dark Theme (existing)
const darkColors = {
   primary: '#00d4ff',
   primaryDark: '#00a8cc',
   primaryLight: '#33ddff',
   bgPrimary: '#1a1a2e',
   bgSecondary: '#16213e',
   bgTertiary: '#0f3460',
   surface: 'rgba(255, 255, 255, 0.08)',
   surfaceBorder: 'rgba(255, 255, 255, 0.1)',
   textPrimary: '#ffffff',
   textSecondary: '#a0a0b0',
   textMuted: '#6a6a7a',
   textDark: '#1a1a2e',
   success: '#00ff88',
   warning: '#ffaa00',
   error: '#ff4466',
   info: '#00d4ff',
};

// Light Theme
const lightColors = {
   primary: '#0088cc',
   primaryDark: '#006699',
   primaryLight: '#33a3dd',
   bgPrimary: '#f5f5f7',
   bgSecondary: '#ffffff',
   bgTertiary: '#e8e8ea',
   surface: 'rgba(0, 0, 0, 0.04)',
   surfaceBorder: 'rgba(0, 0, 0, 0.1)',
   textPrimary: '#1a1a2e',
   textSecondary: '#4a4a5a',
   textMuted: '#8a8a9a',
   textDark: '#ffffff',
   success: '#00cc66',
   warning: '#ff9500',
   error: '#ff3b30',
   info: '#0088cc',
};

const sharedStyles = {
   gradients: {
      primary: ['#1a1a2e', '#16213e', '#1e4c85ff'],
      primaryReverse: ['#0f3460', '#16213e', '#1a1a2e'],
      accent: ['#00d4ff', '#00a8cc', '#0088aa'],
   },
   spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
   },
   borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      round: 999,
   },
   typography: {
      xs: 11,
      sm: 13,
      md: 15,
      lg: 18,
      xl: 22,
      xxl: 28,
      xxxl: 48,
      regular: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
      extraBold: '800',
      tight: -0.5,
      normal: 0,
      wide: 0.5,
      wider: 1,
      widest: 2,
   },
};

const createTheme = (colors, isDark) => ({
   colors,
   ...sharedStyles,
   gradients: isDark
      ? sharedStyles.gradients
      : {
           primary: ['#f5f5f7', '#e8e8ea', '#d0d0d5'],
           primaryReverse: ['#ffffff', '#f5f5f7', '#e8e8ea'],
           accent: ['#0088cc', '#006699', '#005577'],
        },
   shadows: {
      sm: {
         shadowColor: isDark ? '#000' : '#000',
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: isDark ? 0.1 : 0.08,
         shadowRadius: 4,
         elevation: 2,
      },
      md: {
         shadowColor: isDark ? '#000' : '#000',
         shadowOffset: { width: 0, height: 4 },
         shadowOpacity: isDark ? 0.15 : 0.12,
         shadowRadius: 8,
         elevation: 4,
      },
      lg: {
         shadowColor: colors.primary,
         shadowOffset: { width: 0, height: 8 },
         shadowOpacity: isDark ? 0.4 : 0.2,
         shadowRadius: 12,
         elevation: 8,
      },
      glow: {
         shadowColor: colors.primary,
         shadowOffset: { width: 0, height: 0 },
         shadowOpacity: isDark ? 0.3 : 0.15,
         shadowRadius: 10,
         elevation: 5,
      },
   },
   components: {
      primaryButton: {
         backgroundColor: colors.primary,
         borderRadius: sharedStyles.borderRadius.lg,
         padding: sharedStyles.spacing.lg,
      },
      secondaryButton: {
         backgroundColor: colors.surface,
         borderRadius: sharedStyles.borderRadius.lg,
         padding: sharedStyles.spacing.lg,
         borderWidth: 1,
         borderColor: colors.surfaceBorder,
      },
      card: {
         backgroundColor: colors.surface,
         borderRadius: sharedStyles.borderRadius.lg,
         padding: sharedStyles.spacing.lg,
         borderWidth: 1,
         borderColor: colors.surfaceBorder,
      },
      input: {
         backgroundColor: colors.surface,
         borderRadius: sharedStyles.borderRadius.md,
         padding: sharedStyles.spacing.md,
         borderWidth: 1,
         borderColor: colors.surfaceBorder,
         color: colors.textPrimary,
         fontSize: sharedStyles.typography.md,
      },
      container: {
         flex: 1,
         backgroundColor: colors.bgPrimary,
         padding: sharedStyles.spacing.lg,
      },
      heading1: {
         fontSize: sharedStyles.typography.xxxl,
         fontWeight: sharedStyles.typography.extraBold,
         color: colors.primary,
         letterSpacing: sharedStyles.typography.widest,
      },
      heading2: {
         fontSize: sharedStyles.typography.xxl,
         fontWeight: sharedStyles.typography.bold,
         color: colors.textPrimary,
         letterSpacing: sharedStyles.typography.wide,
      },
      heading3: {
         fontSize: sharedStyles.typography.xl,
         fontWeight: sharedStyles.typography.semiBold,
         color: colors.textPrimary,
      },
      body: {
         fontSize: sharedStyles.typography.md,
         fontWeight: sharedStyles.typography.regular,
         color: colors.textPrimary,
      },
      subtitle: {
         fontSize: sharedStyles.typography.md,
         color: colors.textSecondary,
         letterSpacing: sharedStyles.typography.wide,
      },
      caption: {
         fontSize: sharedStyles.typography.sm,
         color: colors.textMuted,
      },
   },
   withOpacity: (color, opacity) => {
      return `${color}${Math.round(opacity * 255)
         .toString(16)
         .padStart(2, '0')}`;
   },
});

export const darkTheme = createTheme(darkColors, true);
export const lightTheme = createTheme(lightColors, false);

export default darkTheme;
