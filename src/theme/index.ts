export const colors = {
  primary: {
    main: '#007AFF',
    light: '#60B7FF',
    dark: '#0056B3',
    contrast: '#FFFFFF',
    gradient: ['#007AFF', '#0056B3'],
  },
  secondary: {
    main: '#FF2D55',
    light: '#FF6B8E',
    dark: '#C70039',
    contrast: '#FFFFFF',
    gradient: ['#FF2D55', '#C70039'],
  },
  accent: {
    main: '#5856D6',
    light: '#8E8CD8',
    dark: '#3C3A9E',
    contrast: '#FFFFFF',
    gradient: ['#5856D6', '#3C3A9E'],
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  background: {
    default: '#F2F2F7',
    paper: '#FFFFFF',
    dark: '#1C1C1E',
    gradient: ['#F2F2F7', '#E5E5EA'],
    input: '#F3F4F6',
  },
  text: {
    primary: '#000000',
    secondary: '#8E8E93',
    disabled: '#9CA3AF',
    hint: '#6B7280',
    inverse: '#FFFFFF',
  },
  status: {
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
      contrast: '#FFFFFF',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
      contrast: '#FFFFFF',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
      contrast: '#FFFFFF',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
      contrast: '#FFFFFF',
    },
  },
  overlay: {
    light: 'rgba(255, 255, 255, 0.8)',
    dark: 'rgba(0, 0, 0, 0.5)',
    gradient: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.7)'],
  },
};

export const typography = {
  fontFamily: {
    primary: 'System',
    secondary: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  letterSpacing: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
    widest: 1.6,
  },
};

export const spacing = {
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
  40: 160,
  48: 192,
  56: 224,
  64: 256,
};

export const borderRadius = {
  none: 0,
  sm: 2,
  base: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  inner: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
};

export const layout = {
  maxWidth: 768,
  minWidth: 320,
  containerPadding: spacing[4],
  touchTargetSize: 48,
  headerHeight: 64,
  bottomTabHeight: 80,
  cardPadding: spacing[4],
  sectionSpacing: spacing[6],
};

export const animation = {
  duration: {
    fastest: 150,
    fast: 250,
    normal: 350,
    slow: 500,
    slowest: 700,
  },
  easing: {
    easeInOut: 'ease-in-out',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  scale: {
    pressed: 0.98,
    hover: 1.02,
  },
};

export const zIndex = {
  base: 0,
  above: 1,
  below: -1,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
  animation,
  zIndex,
}; 
 