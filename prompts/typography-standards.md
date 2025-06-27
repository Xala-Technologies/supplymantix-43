
# Typography Standards

This document establishes comprehensive typography guidelines for consistent text styling throughout the application.

---

## 🎯 CORE PRINCIPLES

### 1. Hierarchy & Readability
- Clear visual hierarchy with distinct heading levels
- Optimal line height for readability (1.4-1.6 for body text)
- Consistent vertical rhythm between elements
- Appropriate contrast ratios for accessibility

### 2. Consistency
- Limited font size variations (6-8 sizes maximum)
- Consistent font weights across similar elements
- Standardized spacing between typography elements
- Uniform treatment of text states (hover, disabled, etc.)

### 3. Performance
- Efficient font loading strategies
- Minimal font variations to reduce bundle size
- Web-safe fallbacks for all custom fonts
- Optimized font display for better user experience

---

## 📝 FONT SYSTEM

### Primary Font Family
**Inter** - Modern, readable sans-serif
- Excellent Norwegian character support (æ, ø, å)
- Optimized for screens
- Multiple weights available
- Good performance characteristics

```css
font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
```

### Fallback Strategy
```css
/* Primary with fallbacks */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Monospace for code */
font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
```

---

## 📏 SIZE SCALE

### Heading Hierarchy
```css
/* H1 - Page Titles */
h1 {
  font-size: 2rem;      /* 32px */
  line-height: 1.25;    /* 40px */
  font-weight: 700;     /* Bold */
  letter-spacing: -0.025em;
  margin-bottom: 1rem;
}

/* H2 - Section Titles */
h2 {
  font-size: 1.5rem;    /* 24px */
  line-height: 1.33;    /* 32px */
  font-weight: 600;     /* Semibold */
  letter-spacing: -0.025em;
  margin-bottom: 0.75rem;
}

/* H3 - Subsection Titles */
h3 {
  font-size: 1.25rem;   /* 20px */
  line-height: 1.4;     /* 28px */
  font-weight: 600;     /* Semibold */
  margin-bottom: 0.5rem;
}

/* H4 - Card/Component Titles */
h4 {
  font-size: 1.125rem;  /* 18px */
  line-height: 1.44;    /* 26px */
  font-weight: 500;     /* Medium */
  margin-bottom: 0.5rem;
}
```

### Body Text Sizes
```css
/* Large Body - Important content */
.text-lg {
  font-size: 1.125rem;  /* 18px */
  line-height: 1.56;    /* 28px */
  font-weight: 400;
}

/* Base Body - Default text */
.text-base {
  font-size: 1rem;      /* 16px */
  line-height: 1.5;     /* 24px */
  font-weight: 400;
}

/* Small Body - Secondary content */
.text-sm {
  font-size: 0.875rem;  /* 14px */
  line-height: 1.57;    /* 22px */
  font-weight: 400;
}

/* Extra Small - Captions, labels */
.text-xs {
  font-size: 0.75rem;   /* 12px */
  line-height: 1.5;     /* 18px */
  font-weight: 400;
}
```

---

## ⚖️ WEIGHT SYSTEM

### Font Weight Usage
```css
/* Light - 300 (Rarely used) */
.font-light {
  font-weight: 300;
  /* Use for: Large display text only */
}

/* Normal - 400 (Default) */
.font-normal {
  font-weight: 400;
  /* Use for: Body text, descriptions */
}

/* Medium - 500 (Emphasis) */
.font-medium {
  font-weight: 500;
  /* Use for: Labels, important body text */
}

/* Semibold - 600 (Headings) */
.font-semibold {
  font-weight: 600;
  /* Use for: Subheadings, card titles */
}

/* Bold - 700 (Strong emphasis) */
.font-bold {
  font-weight: 700;
  /* Use for: Main headings, strong emphasis */
}
```

---

## 🎨 COLOR SYSTEM

### Text Color Hierarchy
```css
/* Primary Text - Main content */
.text-primary {
  color: #1e293b;      /* Gray 800 */
  /* Use for: Headings, important content */
}

/* Secondary Text - Supporting content */
.text-secondary {
  color: #475569;      /* Gray 600 */
  /* Use for: Body text, descriptions */
}

/* Muted Text - Less important content */
.text-muted {
  color: #64748b;      /* Gray 500 */
  /* Use for: Captions, timestamps, metadata */
}

/* Subtle Text - Background information */
.text-subtle {
  color: #94a3b8;      /* Gray 400 */
  /* Use for: Placeholders, disabled text */
}
```

### Semantic Text Colors
```css
/* Success Text */
.text-success {
  color: #16a34a;      /* Green 600 */
}

/* Warning Text */
.text-warning {
  color: #d97706;      /* Amber 600 */
}

/* Error Text */
.text-error {
  color: #dc2626;      /* Red 600 */
}

/* Info Text */
.text-info {
  color: #0ea5e9;      /* Sky 500 */
}

/* Link Text */
.text-link {
  color: #2563eb;      /* Blue 600 */
  text-decoration: underline;
  text-underline-offset: 2px;
}
```

---

## 📱 RESPONSIVE TYPOGRAPHY

### Mobile Adjustments
```css
/* Scale down headings on mobile */
@media (max-width: 640px) {
  h1 {
    font-size: 1.75rem;  /* 28px */
    line-height: 1.29;   /* 36px */
  }
  
  h2 {
    font-size: 1.375rem; /* 22px */
    line-height: 1.36;   /* 30px */
  }
  
  h3 {
    font-size: 1.125rem; /* 18px */
    line-height: 1.44;   /* 26px */
  }
}

/* Increase readability on mobile */
@media (max-width: 640px) {
  .text-base {
    font-size: 1rem;     /* 16px - don't go smaller */
    line-height: 1.5;    /* 24px */
  }
}
```

### Large Screen Enhancements
```css
/* Slightly larger text on desktop */
@media (min-width: 1024px) {
  .text-base {
    font-size: 1.125rem; /* 18px */
    line-height: 1.56;   /* 28px */
  }
}
```

---

## 🌐 INTERNATIONAL SUPPORT

### Norwegian Characters
Ensure proper rendering of:
- **æ, ø, å** (lowercase)
- **Æ, Ø, Å** (uppercase)
- Proper kerning and spacing

### Character Support Testing
```html
<!-- Test string for Norwegian -->
<p>Ærlighet, økonomi, og åpenhet</p>
<p>ÆRLIGHET, ØKONOMI, OG ÅPENHET</p>
```

---

## 📐 SPACING & RHYTHM

### Vertical Rhythm
```css
/* Consistent spacing between typography elements */
.typography-flow > * + * {
  margin-top: 1rem;
}

.typography-flow > h1 + * {
  margin-top: 1.5rem;
}

.typography-flow > h2 + * {
  margin-top: 1.25rem;
}

.typography-flow > h3 + * {
  margin-top: 1rem;
}
```

### Line Length
```css
/* Optimal reading width */
.prose {
  max-width: 65ch;      /* 65 characters wide */
}

.prose-narrow {
  max-width: 45ch;      /* For narrow columns */
}

.prose-wide {
  max-width: 85ch;      /* For wide layouts */
}
```

---

## 🎭 SPECIAL TYPOGRAPHY

### Code Typography
```css
.code-inline {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875em;
  background: #f1f5f9;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  color: #e11d48;
}

.code-block {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.714;
  background: #1e293b;
  color: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}
```

### Numeric Typography
```css
.numeric {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
  /* Ensures consistent width for numbers */
}

.currency {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: #059669;
}
```

---

## ✅ ACCESSIBILITY REQUIREMENTS

### Contrast Ratios
- **Normal text**: 4.5:1 minimum
- **Large text** (18px+): 3:1 minimum
- **UI text**: 4.5:1 minimum

### Font Size Minimums
- **Body text**: Never smaller than 16px on mobile
- **Secondary text**: Never smaller than 14px
- **Captions**: Never smaller than 12px

### Line Height Guidelines
- **Body text**: 1.4-1.6 line height
- **Headings**: 1.2-1.4 line height
- **UI text**: 1.3-1.5 line height

---

## 🚫 ANTI-PATTERNS TO AVOID

### Typography Mistakes
- Using too many font sizes (stick to 6-8 sizes)
- Inconsistent line heights
- Poor contrast ratios
- Text that's too small on mobile
- Mixing too many font weights
- Inconsistent spacing between elements

### Performance Issues
- Loading unnecessary font weights
- Not using font-display: swap
- Missing font fallbacks
- Large font files without subsetting

---

## 📋 IMPLEMENTATION CHECKLIST

### Setup Requirements
- [ ] Inter font properly loaded
- [ ] Fallback fonts configured
- [ ] Font display optimization
- [ ] CSS custom properties defined
- [ ] Responsive adjustments implemented

### Quality Assurance
- [ ] All text passes contrast requirements
- [ ] Norwegian characters render correctly
- [ ] Mobile typography is readable
- [ ] Consistent spacing throughout
- [ ] No typography-related layout shifts
