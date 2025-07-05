
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "sm": "640px",
        "md": "768px",  
        "lg": "1024px",
        "xl": "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        /* Design System Typography Scale */
        'xs': ['var(--text-xs)', { lineHeight: 'var(--leading-normal)' }],
        'sm': ['var(--text-sm)', { lineHeight: 'var(--leading-normal)' }],
        'base': ['var(--text-base)', { lineHeight: 'var(--leading-normal)' }],
        'lg': ['var(--text-lg)', { lineHeight: 'var(--leading-relaxed)' }],
        'xl': ['var(--text-xl)', { lineHeight: 'var(--leading-tight)' }],
        '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-tight)' }],
        '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-tight)' }],
        '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-tight)' }],
      },
      fontWeight: {
        /* Design System Font Weights */
        light: 'var(--font-light)',
        normal: 'var(--font-normal)',
        medium: 'var(--font-medium)',
        semibold: 'var(--font-semibold)',
        bold: 'var(--font-bold)',
      },
      colors: {
        /* Design System Color Tokens */
        
        /* Base Colors */
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        surface: "rgb(var(--surface))",
        "surface-secondary": "rgb(var(--surface-secondary))",
        
        /* Brand Colors */
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
          50: "rgb(var(--primary-50))",
          100: "rgb(var(--primary-100))",
          500: "rgb(var(--primary-500))",
          600: "rgb(var(--primary-600))",
          900: "rgb(var(--primary-900))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
          50: "rgb(var(--secondary-50))",
          100: "rgb(var(--secondary-100))",
          500: "rgb(var(--secondary-500))",
          600: "rgb(var(--secondary-600))",
        },
        
        /* Semantic Colors */
        success: {
          DEFAULT: "rgb(var(--success))",
          foreground: "rgb(var(--success-foreground))",
          50: "rgb(var(--success-50))",
          100: "rgb(var(--success-100))",
          500: "rgb(var(--success-500))",
          600: "rgb(var(--success-600))",
        },
        warning: {
          DEFAULT: "rgb(var(--warning))",
          foreground: "rgb(var(--warning-foreground))",
          50: "rgb(var(--warning-50))",
          100: "rgb(var(--warning-100))",
          500: "rgb(var(--warning-500))",
          600: "rgb(var(--warning-600))",
        },
        error: {
          DEFAULT: "rgb(var(--error))",
          foreground: "rgb(var(--error-foreground))",
          50: "rgb(var(--error-50))",
          100: "rgb(var(--error-100))",
          500: "rgb(var(--error-500))",
          600: "rgb(var(--error-600))",
        },
        
        /* Gray Scale */
        gray: {
          25: "rgb(var(--gray-25))",
          50: "rgb(var(--gray-50))",
          100: "rgb(var(--gray-100))",
          200: "rgb(var(--gray-200))",
          300: "rgb(var(--gray-300))",
          400: "rgb(var(--gray-400))",
          500: "rgb(var(--gray-500))",
          600: "rgb(var(--gray-600))",
          700: "rgb(var(--gray-700))",
          800: "rgb(var(--gray-800))",
          900: "rgb(var(--gray-900))",
        },
        
        /* Text Colors */
        text: {
          primary: "rgb(var(--text-primary))",
          secondary: "rgb(var(--text-secondary))",
          tertiary: "rgb(var(--text-tertiary))",
          quaternary: "rgb(var(--text-quaternary))",
          inverse: "rgb(var(--text-inverse))",
        },
        
        /* Border Colors */
        border: {
          DEFAULT: "rgb(var(--border-primary))",
          primary: "rgb(var(--border-primary))",
          secondary: "rgb(var(--border-secondary))",
          accent: "rgb(var(--border-accent))",
          focus: "rgb(var(--border-focus))",
        },
        
        /* Component Tokens */
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))",
          border: "rgb(var(--card-border))",
        },
        input: {
          DEFAULT: "rgb(var(--input))",
          border: "rgb(var(--input-border))",
          "border-focus": "rgb(var(--input-border-focus))",
          foreground: "rgb(var(--input-foreground))",
          placeholder: "rgb(var(--input-placeholder))",
        },
        button: {
          primary: "rgb(var(--button-primary))",
          "primary-hover": "rgb(var(--button-primary-hover))",
          "primary-foreground": "rgb(var(--button-primary-foreground))",
          secondary: "rgb(var(--button-secondary))",
          "secondary-hover": "rgb(var(--button-secondary-hover))",
          "secondary-foreground": "rgb(var(--button-secondary-foreground))",
          "secondary-border": "rgb(var(--button-secondary-border))",
        },
        sidebar: {
          DEFAULT: "rgb(var(--sidebar-background))",
          foreground: "rgb(var(--sidebar-foreground))",
          border: "rgb(var(--sidebar-border))",
          "item-hover": "rgb(var(--sidebar-item-hover))",
          "item-active": "rgb(var(--sidebar-item-active))",
          "item-active-foreground": "rgb(var(--sidebar-item-active-foreground))",
          brand: "rgb(var(--sidebar-brand))",
        },
        
        /* Legacy/Compatibility */
        ring: "rgb(var(--border-focus))",
        muted: {
          DEFAULT: "rgb(var(--gray-100))",
          foreground: "rgb(var(--text-secondary))",
        },
        accent: {
          DEFAULT: "rgb(var(--primary-50))",
          foreground: "rgb(var(--primary-600))",
        },
        destructive: {
          DEFAULT: "rgb(var(--error))",
          foreground: "rgb(var(--error-foreground))",
        },
        popover: {
          DEFAULT: "rgb(var(--surface))",
          foreground: "rgb(var(--foreground))",
        },
      },
      borderRadius: {
        /* Design System Border Radius */
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-base)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        /* Design System Shadow Scale */
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        card: 'var(--shadow-card)',
        dropdown: 'var(--shadow-dropdown)',
      },
      spacing: {
        /* Design System Spacing Scale */
        0: 'var(--space-0)',
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        10: 'var(--space-10)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        20: 'var(--space-20)',
        24: 'var(--space-24)',
        32: 'var(--space-32)',
        /* Preserve some common values */
        18: "4.5rem",
        88: "22rem",
        112: "28rem",
      },
      zIndex: {
        /* Design System Z-Index Scale */
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        fixed: 'var(--z-fixed)',
        'modal-backdrop': 'var(--z-modal-backdrop)',
        modal: 'var(--z-modal)',
        popover: 'var(--z-popover)',
        tooltip: 'var(--z-tooltip)',
        toast: 'var(--z-toast)',
      },
      screens: {
        'xs': '475px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "scale-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.95)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
