import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007bff',
    primaryContainer: '#e3f2fd',
    secondary: '#6c757d',
    secondaryContainer: '#f8f9fa',
    tertiary: '#28a745',
    tertiaryContainer: '#d4edda',
    surface: '#ffffff',
    surfaceVariant: '#f5f5f5',
    background: '#fafafa',
    error: '#dc3545',
    errorContainer: '#f8d7da',
    onPrimary: '#ffffff',
    onPrimaryContainer: '#0056b3',
    onSecondary: '#ffffff',
    onSecondaryContainer: '#495057',
    onTertiary: '#ffffff',
    onTertiaryContainer: '#155724',
    onSurface: '#212529',
    onSurfaceVariant: '#6c757d',
    onBackground: '#212529',
    onError: '#ffffff',
    onErrorContainer: '#721c24',
    outline: '#dee2e6',
    outlineVariant: '#e9ecef',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#343a40',
    inverseOnSurface: '#f8f9fa',
    inversePrimary: '#66b3ff',
    elevation: {
      level0: 'transparent',
      level1: '#ffffff',
      level2: '#f8f9fa',
      level3: '#e9ecef',
      level4: '#dee2e6',
      level5: '#adb5bd',
    },
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
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 50,
  },
  typography: {
    displayLarge: {
      fontSize: 57,
      fontWeight: '400' as const,
      lineHeight: 64,
      letterSpacing: -0.25,
    },
    displayMedium: {
      fontSize: 45,
      fontWeight: '400' as const,
      lineHeight: 52,
      letterSpacing: 0,
    },
    displaySmall: {
      fontSize: 36,
      fontWeight: '400' as const,
      lineHeight: 44,
      letterSpacing: 0,
    },
    headlineLarge: {
      fontSize: 32,
      fontWeight: '400' as const,
      lineHeight: 40,
      letterSpacing: 0,
    },
    headlineMedium: {
      fontSize: 28,
      fontWeight: '400' as const,
      lineHeight: 36,
      letterSpacing: 0,
    },
    headlineSmall: {
      fontSize: 24,
      fontWeight: '400' as const,
      lineHeight: 32,
      letterSpacing: 0,
    },
    titleLarge: {
      fontSize: 22,
      fontWeight: '400' as const,
      lineHeight: 28,
      letterSpacing: 0,
    },
    titleMedium: {
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 24,
      letterSpacing: 0.15,
    },
    titleSmall: {
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    bodyLarge: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
      letterSpacing: 0.5,
    },
    bodyMedium: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
      letterSpacing: 0.25,
    },
    bodySmall: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
      letterSpacing: 0.4,
    },
    labelLarge: {
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    labelMedium: {
      fontSize: 12,
      fontWeight: '500' as const,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
    labelSmall: {
      fontSize: 11,
      fontWeight: '500' as const,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
  },
};

export type Theme = typeof theme;