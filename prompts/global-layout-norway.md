
# Prompt: Global Layout Redesign (Mobile-First, Norway-Ready, WCAG Compliant)

This application will be used in **Norway** and must follow **global design and accessibility standards**. The current layout lacks visual consistency, clarity, and polish across different pages and screen sizes. I want you to **perform a complete visual and layout overhaul** across the entire application, while **preserving all existing business logic and functionality**.

---

## ✅ OBJECTIVE

Create a **professional, mobile-first, responsive layout system** that is:
- Visually appealing
- Globally accessible
- WCAG 2.1 AA compliant
- Designed with Norwegian and European UX expectations in mind

---

## 📐 DESIGN SYSTEM REQUIREMENTS

### 1. Layout System
- Adopt a **mobile-first approach** with fluid breakpoints for tablet and desktop
- Standardize spacing: base spacing unit (e.g., 4px or 8px scale)
- Use shared layout wrappers: `PageLayout`, `PageHeader`, `SectionCard`, `SidebarContainer`
- Remove inconsistent paddings/margins between cards, filters, buttons, and content
- Align headers, CTAs, filters, and table columns across all modules
- Sidebar and navbar should maintain consistent behavior across screen sizes

### 2. Typography
- Limit to **3 font sizes** (Heading, Subheading, Body) and clearly define each level
- Use consistent **font weight, line height, and letter spacing**
- Prefer web-safe or Google Fonts that support Norwegian characters (æ, ø, å)
- Ensure proper vertical rhythm between titles, labels, and content

### 3. Visual Hierarchy
- Highlight key actions (e.g. "+ New Order", "Execute") with consistent placement and color
- Group related content using card shadows or subtle borders
- Use whitespace to create scannable UI — do not crowd elements
- Differentiate visual states: empty, hover, selected, disabled

---

## 🌐 GLOBAL + UNIVERSAL DESIGN

### Accessibility
- Fully WCAG 2.1 AA compliant (color contrast, focus states, alt text)
- Support for keyboard navigation across all components
- Use semantic HTML structure (e.g., `header`, `main`, `nav`, `section`, `aside`)
- Screen-reader-friendly labels and ARIA roles where appropriate

### Internationalization
- All UI should be **flexible for Norwegian and multilingual expansion**
- Components should not break with long words or text overflow (e.g., in Norwegian or Sámi)
- RTL-ready structure is a plus, but not required immediately

---

## 📱 RESPONSIVE BEHAVIOR (MOBILE-FIRST)

| Breakpoint       | Target Devices     | Guidelines                                                              |
|------------------|--------------------|-------------------------------------------------------------------------|
| Mobile (≤640px)  | iPhones, Android   | Stacked layout, one column, large tap areas, collapsible filters/sidebar |
| Tablet (641–1024px) | iPads             | Two-column max, increased card width, sidebar collapsible               |
| Desktop (≥1025px)| Full desktop       | Full layout with sidebars, filters inline, full tables, etc.            |

Ensure proper spacing and visual balance at each breakpoint. Nothing should break or feel cramped on mobile.

---

## 🧼 WHAT TO FIX

- Inconsistent headers and top margins on different pages
- Uneven alignment between buttons, filters, and content
- Too many font sizes and lack of visual rhythm
- Poor contrast or color hierarchy in buttons, labels, and tags
- Layouts that break on smaller screens
- Visually heavy or uneven cards

---

## 🚫 HARD CONSTRAINTS

- ❌ **Do not change any logic or functionality**
- ❌ **Do not remove or rename existing components unless abstracting them cleanly**
- ❌ **Do not change the color palette** — use it better instead
- ❌ **Do not introduce new libraries unless necessary for layout cleanup**

---

## ✅ GOAL

At the end of this transformation, the application should feel:
- **Unified**: same structure and spacing everywhere
- **Professional**: clean, well-organized, with modern UI
- **Accessible**: usable by all users regardless of device or ability
- **Ready for Norway**: mobile-first, multilingual-compatible, and compliant with European digital design expectations
