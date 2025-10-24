# RecruitEdge Color Scheme Guide

## 🎨 Brand Colors

RecruitEdge uses a **teal and green** color palette for a professional, trustworthy, and modern look.

### Primary Color: Teal
- Used for primary actions, buttons, links, and interactive elements
- Conveys professionalism and trust

### Secondary Color: Green  
- Used for backgrounds, gradients, and accents
- Complements teal and adds freshness

---

## 📋 Tailwind CSS Color Classes

### Buttons

**Primary Buttons (Call-to-Action):**
```tsx
className="bg-teal-600 text-white hover:bg-teal-700"
```

**Secondary/Outline Buttons:**
```tsx
className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50"
```

**Button with Icon:**
```tsx
<Button className="bg-teal-600 hover:bg-teal-700">
  <Icon className="w-4 h-4 mr-2" />
  Button Text
</Button>
```

**Disabled State:**
```tsx
className="bg-gray-300 text-gray-500 cursor-not-allowed"
```

---

### Backgrounds

**Page Background (Gradient):**
```tsx
className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100"
```

**Card/Section Background:**
```tsx
className="bg-white rounded-lg shadow-lg"
```

**Active/Selected State:**
```tsx
className="bg-teal-50 text-teal-700"
```

**Hover State:**
```tsx
className="hover:bg-gray-50"  // Neutral hover
className="hover:bg-teal-50"  // Teal hover for interactive items
```

---

### Text & Typography

**Brand/Logo Text:**
```tsx
className="text-teal-600 font-bold"
```

**Headings:**
```tsx
className="text-gray-900"  // Primary headings
```

**Body Text:**
```tsx
className="text-gray-600"  // Regular text
className="text-gray-700"  // Slightly darker
```

**Links & Interactive Text:**
```tsx
className="text-teal-600 hover:text-teal-700"
className="text-gray-700 hover:text-teal-600"  // Navigation
```

**Muted/Secondary Text:**
```tsx
className="text-gray-500"
```

---

### Icons

**Primary Icons (Active/Brand):**
```tsx
<Icon className="w-6 h-6 text-teal-600" />
```

**Navigation Icons:**
```tsx
<Icon className="w-5 h-5 text-gray-600" />  // Inactive
<Icon className="w-5 h-5 text-teal-600" />  // Active
```

**Large Feature Icons:**
```tsx
<Icon className="w-12 h-12 text-teal-600" />
```

**Icon in Button:**
```tsx
<Icon className="w-4 h-4 text-white" />  // Inside teal button
```

---

### Badges & Tags

**Primary Tags:**
```tsx
className="px-4 py-2 bg-teal-100 text-teal-800 rounded-full"
```

**Status Badges:**
```tsx
className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"  // Success
className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs"   // Neutral
className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs"     // Error
```

---

### Navigation

**Navigation Bar:**
```tsx
className="border-b bg-white/80 backdrop-blur-sm"
```

**Active Navigation Item:**
```tsx
className="bg-teal-50 text-teal-700 font-medium"
```

**Inactive Navigation Item:**
```tsx
className="text-gray-700 hover:bg-gray-50"
```

---

### Forms & Inputs

**Input Focus State:**
```tsx
className="focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
```

**Input Border:**
```tsx
className="border-gray-300 focus:border-teal-500"
```

**Required Field Label:**
```tsx
className="text-gray-700 font-medium"
```

---

### Cards & Containers

**Card with Hover:**
```tsx
className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition"
```

**Icon Container in Card:**
```tsx
className="w-24 h-24 bg-teal-100 rounded-2xl flex items-center justify-center"
```

---

### States & Feedback

**Loading State:**
```tsx
<Loader2 className="animate-spin text-teal-600" />
```

**Error State:**
```tsx
className="bg-red-50 border border-red-200 text-red-800"
```

**Success State:**
```tsx
className="bg-green-50 border border-green-200 text-green-800"
```

**Warning State:**
```tsx
className="bg-yellow-50 border border-yellow-200 text-yellow-800"
```

**Info State:**
```tsx
className="bg-blue-50 border border-blue-200 text-blue-800"
```

---

## 🎯 Quick Reference

### Color Palette

| Usage | Teal Shades | Green Shades | Gray Shades |
|-------|-------------|--------------|-------------|
| **Background** | `bg-teal-50`, `bg-teal-100` | `bg-green-50` | `bg-gray-50`, `bg-gray-100` |
| **Text** | `text-teal-600`, `text-teal-700`, `text-teal-800` | `text-green-600` | `text-gray-500`, `text-gray-600`, `text-gray-700`, `text-gray-900` |
| **Buttons** | `bg-teal-600`, `hover:bg-teal-700` | - | `bg-gray-300` (disabled) |
| **Borders** | `border-teal-600` | - | `border-gray-200`, `border-gray-300` |
| **Focus** | `ring-teal-500`, `border-teal-500` | - | - |

### Common Patterns

**Hero Section:**
```tsx
<div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
  <h1 className="text-5xl font-bold text-gray-900">
    Title
  </h1>
  <p className="text-xl text-gray-600">
    Subtitle
  </p>
  <button className="bg-teal-600 text-white px-8 py-4 rounded-lg hover:bg-teal-700">
    Call to Action
  </button>
</div>
```

**Feature Card:**
```tsx
<div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
  <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center mb-4">
    <Icon className="w-6 h-6 text-teal-600" />
  </div>
  <h3 className="text-2xl font-bold text-gray-900 mb-2">Title</h3>
  <p className="text-gray-600 mb-4">Description</p>
  <button className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700">
    Action
  </button>
</div>
```

**Navigation Link:**
```tsx
<a 
  href="#" 
  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-teal-50 hover:text-teal-700"
>
  <Icon className="w-5 h-5" />
  Link Text
</a>
```

---

## ⚠️ Important Rules

### ✅ DO:
- Use `teal-600` for primary buttons and CTAs
- Use `teal-50` and `teal-100` for light backgrounds
- Use `green-50` in gradients with teal
- Use gray shades for neutral text and borders
- Keep hover states darker than base (e.g., `teal-600` → `hover:teal-700`)

### ❌ DON'T:
- Use blue, purple, or indigo colors (old scheme)
- Mix teal with blue in the same component
- Use bright or neon colors
- Use teal for error states (use red instead)

---

## 📱 Responsive Considerations

All color classes work across all breakpoints. No color changes are needed for responsive design - only sizing and layout adjustments.

---

## 🔄 Consistency Checklist

Before committing code, verify:
- [ ] All primary buttons use `bg-teal-600 hover:bg-teal-700`
- [ ] All page backgrounds use `from-green-50 to-teal-100` gradient
- [ ] All icons in features/cards use `text-teal-600`
- [ ] All brand text (logo, titles) uses `text-teal-600`
- [ ] No blue/purple/indigo colors remain
- [ ] Active states use `bg-teal-50 text-teal-700`
- [ ] Links use `text-teal-600 hover:text-teal-700`

---

**Last Updated:** October 23, 2025  
**Version:** 1.0
