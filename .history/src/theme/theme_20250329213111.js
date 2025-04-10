import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF4B7B',
    secondary: '#FF8BA7',
    tertiary: '#FFB4C6',
    background: '#FFF6F6',
    surface: '#FFFFFF',
    surfaceVariant: '#F4F4F4',
    error: '#FF3B30',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#1A1A1A',
    onBackground: '#1A1A1A',
    onSurfaceVariant: '#1A1A1A',
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#F5F5F5',
      level3: '#EEEEEE',
      level4: '#E0E0E0',
      level5: '#D6D6D6',
    },
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FF4B7B',
    secondary: '#FF8BA7',
    tertiary: '#FFB4C6',
    background: '#1A1A1A',
    surface: '#2C2C2C',
    surfaceVariant: '#3A3A3A',
    error: '#FF453A',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#FFFFFF',
    onBackground: '#FFFFFF',
    onSurfaceVariant: '#FFFFFF',
    elevation: {
      level0: 'transparent',
      level1: '#2C2C2C',
      level2: '#3A3A3A',
      level3: '#484848',
      level4: '#565656',
      level5: '#646464',
    },
  },
}; 