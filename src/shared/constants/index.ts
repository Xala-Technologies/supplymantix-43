
// Shared application constants
export const APP_CONFIG = {
  NAME: 'SupplyMantix',
  VERSION: '1.0.0',
  API_TIMEOUT: 30000,
} as const;

export const UI_CONFIG = {
  SIDEBAR_WIDTH: 280,
  SIDEBAR_WIDTH_COLLAPSED: 64,
  HEADER_HEIGHT: 64,
  ANIMATION_DURATION: 200,
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export const COLORS = {
  PRIMARY: 'rgb(37 99 235)',
  PRIMARY_FOREGROUND: 'rgb(255 255 255)',
  SECONDARY: 'rgb(248 250 252)',
  MUTED: 'rgb(71 85 105)',
  DESTRUCTIVE: 'rgb(220 38 38)',
  SUCCESS: 'rgb(34 197 94)',
  WARNING: 'rgb(245 158 11)',
} as const;

export const Z_INDEX = {
  DROPDOWN: 50,
  STICKY: 100,
  OVERLAY: 200,
  MODAL: 300,
  TOAST: 400,
} as const;
