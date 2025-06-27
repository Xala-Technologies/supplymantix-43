
# Global Theming Standards

This document defines the comprehensive theming system for consistent visual design across the entire application.

---

## 🎨 COLOR SYSTEM

### Primary Palette
- **Primary**: `#2563eb` (Blue 600) - Main brand color
- **Primary Hover**: `#1d4ed8` (Blue 700) - Hover states
- **Primary Light**: `#dbeafe` (Blue 100) - Backgrounds
- **Primary Dark**: `#1e40af` (Blue 800) - Text on light

### Semantic Colors
- **Success**: `#16a34a` (Green 600)
- **Warning**: `#d97706` (Amber 600)
- **Error**: `#dc2626` (Red 600)
- **Info**: `#0ea5e9` (Sky 500)

### Neutral Palette
- **Gray 50**: `#f8fafc` - Lightest background
- **Gray 100**: `#f1f5f9` - Card backgrounds
- **Gray 200**: `#e2e8f0` - Borders
- **Gray 300**: `#cbd5e1` - Disabled states
- **Gray 400**: `#94a3b8` - Placeholders
- **Gray 500**: `#64748b` - Secondary text
- **Gray 600**: `#475569` - Primary text
- **Gray 700**: `#334155` - Headings
- **Gray 800**: `#1e293b` - Dark text
- **Gray 900**: `#0f172a` - Darkest text

---

## 📝 TYPOGRAPHY SYSTEM

### Font Hierarchy
```css
/* Headings */
h1: 2rem (32px) - font-bold - line-height: 1.25
h2: 1.5rem (24px) - font-semibold - line-height: 1.3
h3: 1.25rem (20px) - font-medium - line-height: 1.4
h4: 1.125rem (18px) - font-medium - line-height: 1.4

/* Body Text */
body: 0.875rem (14px) - font-normal - line-height: 1.6
small: 0.75rem (12px) - font-normal - line-height: 1.5
```

### Font Weights
- **Light**: 300 - Rarely used
- **Normal**: 400 - Body text
- **Medium**: 500 - Emphasis
- **Semibold**: 600 - Subheadings
- **Bold**: 700 - Headings

### Text Colors
- **Primary Text**: `text-gray-900` - Main content
- **Secondary Text**: `text-gray-600` - Supporting text
- **Muted Text**: `text-gray-500` - Placeholders, labels
- **Accent Text**: `text-primary` - Links, highlights

---

## 📏 SPACING SYSTEM

### Base Unit: 4px
- **0**: 0px
- **1**: 4px
- **2**: 8px
- **3**: 12px
- **4**: 16px
- **5**: 20px
- **6**: 24px
- **8**: 32px
- **10**: 40px
- **12**: 48px
- **16**: 64px
- **20**: 80px
- **24**: 96px

### Component Spacing
- **Card Padding**: `p-6` (24px)
- **Button Padding**: `px-4 py-2` (16px, 8px)
- **Form Field Spacing**: `space-y-4` (16px)
- **Section Spacing**: `space-y-8` (32px)
- **Page Margins**: `p-6` on mobile, `p-8` on desktop

---

## 🎯 COMPONENT THEMING

### Buttons
```css
/* Primary */
.btn-primary {
  background: primary;
  color: white;
  border: 1px solid primary;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
}

/* Secondary */
.btn-secondary {
  background: white;
  color: gray-700;
  border: 1px solid gray-300;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
}

/* Ghost */
.btn-ghost {
  background: transparent;
  color: gray-700;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
}
```

### Cards
```css
.card {
  background: white;
  border: 1px solid gray-200;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.card-header {
  border-bottom: 1px solid gray-100;
  margin-bottom: 16px;
  padding-bottom: 16px;
}
```

### Forms
```css
.form-field {
  margin-bottom: 16px;
}

.form-label {
  color: gray-700;
  font-weight: 500;
  margin-bottom: 4px;
  display: block;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid gray-300;
  border-radius: 6px;
  background: white;
  font-size: 14px;
}

.form-input:focus {
  border-color: primary;
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints
```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Responsive Spacing
- Mobile: Reduce padding/margins by 25%
- Tablet: Standard spacing
- Desktop: Increase spacing for larger screens

---

## 🎭 DARK MODE SUPPORT

### Color Adjustments
```css
.dark {
  --background: #0f172a;
  --foreground: #f8fafc;
  --card: #1e293b;
  --card-foreground: #f8fafc;
  --border: #334155;
  --input: #334155;
}
```

### Implementation
- Use CSS custom properties
- Maintain contrast ratios
- Test all components in both modes

---

## 🌈 STATUS INDICATORS

### Work Order Status
- **Draft**: `bg-gray-100 text-gray-800`
- **Open**: `bg-blue-100 text-blue-800`
- **In Progress**: `bg-yellow-100 text-yellow-800`
- **On Hold**: `bg-orange-100 text-orange-800`
- **Completed**: `bg-green-100 text-green-800`
- **Cancelled**: `bg-red-100 text-red-800`

### Priority Levels
- **Low**: `bg-gray-100 text-gray-800`
- **Medium**: `bg-blue-100 text-blue-800`
- **High**: `bg-orange-100 text-orange-800`
- **Urgent**: `bg-red-100 text-red-800`

---

## 📐 LAYOUT PATTERNS

### Page Structure
```jsx
<StandardPageLayout>
  <StandardPageHeader title="Page Title" />
  <StandardPageFilters>
    {/* Filters */}
  </StandardPageFilters>
  <StandardPageContent>
    {/* Main content */}
  </StandardPageContent>
</StandardPageLayout>
```

### Grid Systems
- **2-column**: `grid-cols-1 md:grid-cols-2`
- **3-column**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **4-column**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`

---

## ✅ ACCESSIBILITY COMPLIANCE

### Color Contrast
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

### Focus States
- Visible focus indicators
- Consistent focus styling
- Keyboard navigation support

### Screen Reader Support
- Semantic HTML elements
- ARIA labels and roles
- Proper heading hierarchy
