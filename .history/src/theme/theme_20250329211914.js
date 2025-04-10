import { DefaultTheme, DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF4B7B',
    secondary: '#FF8BA7',
    background: '#FFF6F6',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    disabled: '#C7C7CC',
    placeholder: '#8E8E93',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#FF3B30',
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#FF4B7B',
    secondary: '#FF8BA7',
    background: '#1A1A1A',
    surface: '#2C2C2C',
    text: '#FFFFFF',
    error: '#FF453A',
    success: '#32D74B',
    warning: '#FF9F0A',
    disabled: '#3A3A3C',
    placeholder: '#8E8E93',
    backdrop: 'rgba(0, 0, 0, 0.8)',
    notification: '#FF453A',
  },
}; 