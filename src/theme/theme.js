
// Main theme configuration with Material Design inspired colors

export const theme = {
  colors: {
    // Primary colors
    primary: {
      main: '#0077CC',      // Primary blue
      light: '#4DA3FF',
      dark: '#005CA3',
      contrastText: '#FFFFFF',
    },
    // Secondary colors
    secondary: {
      main: '#00ACC1',      // Teal accent
      light: '#5DDEF4',
      dark: '#007C91',
      contrastText: '#FFFFFF',
    },
    // Backgrounds
    background: {
      default: '#FFFFFF',   // Main background
      paper: '#F8F9FA',     // Card/paper background
      alt: '#E6F3FA',       // Alternative light blue background
    },
    // Text colors
    text: {
      primary: '#212121',   // Main text
      secondary: '#6C757D', // Secondary text
      disabled: '#9E9E9E',  // Disabled text
      hint: '#757575',      // Hint text
    },
    // Utility colors
    util: {
      success: '#4CAF50',
      warning: '#FFC107',
      error: '#F44336',
      info: '#2196F3',
    },
    // Border colors
    border: {
      light: '#E9ECEF',
      main: '#DEE2E6',
      dark: '#CED4DA',
    },
    // Status colors for recording
    status: {
      recording: '#F44336', // Red for recording indicator
      active: '#4CAF50',    // Green for active state
      inactive: '#9E9E9E',  // Gray for inactive state
    },
  },
  // Spacing (used for margins, paddings)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  // Border radius 
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    pill: '9999px',
  },
  // Shadows
  shadows: {
    small: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    medium: '0 4px 6px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.24)',
    large: '0 10px 20px rgba(0,0,0,0.12), 0 6px 6px rgba(0,0,0,0.24)',
  },
  // Typography
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: {
      fontSize: '32px',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.4, 
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    button: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: 1.4,
      textTransform: 'uppercase',
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.4,
    },
  },
};
