# 🎨 RecruitEdge Tailwind Color Cheatsheet

> Quick copy-paste reference for consistent styling across RecruitEdge

---

## Primary Button
```tsx
bg-teal-600 text-white hover:bg-teal-700
```

## Secondary Button (Outline)
```tsx
border-2 border-teal-600 text-teal-600 hover:bg-teal-50
```

## Page Background Gradient
```tsx
bg-gradient-to-br from-green-50 to-teal-100
```

## Brand Logo/Title
```tsx
text-teal-600 font-bold
```

## Navigation Link (Inactive)
```tsx
text-gray-700 hover:text-teal-600
```

## Navigation Link (Active)
```tsx
bg-teal-50 text-teal-700 font-medium
```

## Feature Card Icon Container
```tsx
<div className="w-24 h-24 bg-teal-100 rounded-2xl flex items-center justify-center">
  <Icon className="w-12 h-12 text-teal-600" />
</div>
```

## Tag/Badge
```tsx
px-4 py-2 bg-teal-100 text-teal-800 rounded-full
```

## Input Focus
```tsx
focus:ring-2 focus:ring-teal-500 focus:border-teal-500
```

## Card
```tsx
bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition
```

## Heading Text
```tsx
text-gray-900  /* Primary */
text-gray-700  /* Secondary */
text-gray-600  /* Body text */
text-gray-500  /* Muted */
```

## Icon (Standalone)
```tsx
text-teal-600  /* Primary/Active */
text-gray-600  /* Inactive */
```

## Loading Spinner
```tsx
<Loader2 className="animate-spin text-teal-600" />
```

## Error Message
```tsx
bg-red-50 border border-red-200 text-red-800
```

## Success Message
```tsx
bg-green-50 border border-green-200 text-green-800
```

---

## 🚫 Don't Use
- ❌ `blue-*` (old scheme)
- ❌ `purple-*` (old scheme)
- ❌ `indigo-*` (old scheme)

## ✅ Always Use
- ✅ `teal-*` for brand colors
- ✅ `green-*` for gradients & success
- ✅ `gray-*` for neutral elements
- ✅ `red-*` for errors only

---

**Copy this file to your workspace for quick reference!**
