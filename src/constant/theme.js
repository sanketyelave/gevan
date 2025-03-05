// src/constants/theme.js

export const COLORS = {
    white: '#FFFFFF',
    black: '#1F1E17',
    primary: '#4BAF47',
    secondary: '#EEC044',
    accent: '#C5CE38',
    gray: {
        light: '#F8F7F0',
        medium: '#E4E2D7',
        dark: '#878680',
        darker: '#A5A49A',
    }
};

export const BREAKPOINTS = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
};

export const FONTS = {
    primary: 'Inter, sans-serif',
};

export const API_ERRORS = {
    EMAIL_EXISTS: 'An account with this email already exists',
    INVALID_CREDENTIALS: 'Invalid email or password',
    WEAK_PASSWORD: 'Password should be at least 8 characters',
    NETWORK_ERROR: 'Network error. Please check your connection',
    UNKNOWN_ERROR: 'Something went wrong. Please try again',
};