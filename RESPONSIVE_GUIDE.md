# Quick Responsive Design Guide

## 🎯 Responsive Breakpoints Reference

```
Mobile    Tablet    Desktop   Large Desktop
< 640px   640-768   768-1024  > 1024px
   |         |         |          |
   sm:       md:       lg:        xl:
```

## 📱 Component Behavior by Screen Size

### Navigation

| Component | Mobile (< 1024px) | Desktop (≥ 1024px) |
|-----------|-------------------|-------------------|
| Sidebar | Hidden (slide-in menu) | Always visible |
| Menu Button | Visible | Hidden |
| User Name | In dropdown only | Visible in navbar |

### Tables

| Feature | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Scroll | Horizontal | Horizontal | None needed |
| Columns | Essential only | More columns | All columns |
| Actions | Icons only | Icons + text | Icons + text |

### Grids

#### Stats Cards
```
Mobile:    [Card 1]
           [Card 2]
           [Card 3]
           [Card 4]

Tablet:    [Card 1] [Card 2]
           [Card 3] [Card 4]

Desktop:   [Card 1] [Card 2] [Card 3] [Card 4]
```

#### Feature Cards (Landing Page)
```
Mobile:    [Feature 1]
           [Feature 2]
           [Feature 3]

Tablet:    [Feature 1] [Feature 2]
           [Feature 3] [Feature 4]

Desktop:   [Feature 1] [Feature 2] [Feature 3]
           [Feature 4] [Feature 5] [Feature 6]
```

#### Dashboard Actions
```
Mobile:    [Hours]
           [Expenses]
           [Vacation]
           [Travel]

Tablet:    [Hours]    [Expenses]
           [Vacation] [Travel]

Desktop:   [Hours] [Expenses] [Vacation] [Travel]
```

### Forms

| Element | Mobile | Desktop |
|---------|--------|---------|
| Spacing | `space-y-4` | `space-y-6` |
| Buttons | Full width | Auto width |
| Inputs | Full width | Full width |

### Typography

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Page Title | `text-2xl` | `text-3xl` | `text-3xl` |
| Hero Title | `text-3xl` | `text-5xl` | `text-6xl` |
| Description | `text-sm` | `text-base` | `text-base` |

## 🎨 Common Responsive Patterns Used

### 1. Responsive Grid
```tsx
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {/* Items */}
</div>
```

### 2. Responsive Text
```tsx
<h1 className="text-2xl font-bold sm:text-3xl">Title</h1>
<p className="text-sm sm:text-base text-muted-foreground">Description</p>
```

### 3. Responsive Spacing
```tsx
<div className="space-y-4 sm:space-y-6">
  {/* Content */}
</div>
```

### 4. Hide/Show Elements
```tsx
{/* Hide on mobile, show on desktop */}
<div className="hidden lg:block">Desktop only</div>

{/* Show on mobile, hide on desktop */}
<div className="lg:hidden">Mobile only</div>

{/* Hide on mobile, show on tablet+ */}
<div className="hidden sm:block">Tablet and up</div>
```

### 5. Responsive Flex Direction
```tsx
<div className="flex flex-col sm:flex-row gap-4">
  {/* Stacks on mobile, horizontal on tablet+ */}
</div>
```

### 6. Responsive Padding
```tsx
<main className="p-4 sm:p-6 lg:p-8">
  {/* Content */}
</main>
```

### 7. Responsive Table Columns
```tsx
<TableHead className="hidden md:table-cell">Department</TableHead>
<TableCell className="hidden md:table-cell">{user.department}</TableCell>
```

### 8. Horizontal Scroll Container
```tsx
<div className="overflow-x-auto -mx-4 sm:mx-0">
  <div className="inline-block min-w-full align-middle">
    <Table>{/* ... */}</Table>
  </div>
</div>
```

## 🔧 Testing Commands

### Test in Browser DevTools
1. Open Chrome/Firefox DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select device or enter custom dimensions
4. Test these widths:
   - 375px (iPhone SE)
   - 414px (iPhone 12 Pro)
   - 768px (iPad)
   - 1024px (iPad Pro)
   - 1440px (Desktop)

### Run Development Server
```bash
npm run dev
```
Then open: http://localhost:3000

## 📊 Responsive Checklist

- ✅ Mobile menu works (hamburger icon)
- ✅ Tables scroll horizontally on mobile
- ✅ Forms are easy to fill on mobile
- ✅ Buttons are touch-friendly (44x44px min)
- ✅ Text is readable (not too small)
- ✅ Images scale properly
- ✅ No horizontal scroll on any page
- ✅ Cards stack nicely on mobile
- ✅ Navigation is accessible
- ✅ Spacing is appropriate for screen size

## 🎯 Key Files Modified

### Layout Components
- `components/layout/sidebar.tsx` - Mobile slide-in menu
- `components/layout/navbar.tsx` - Responsive header with menu button
- `components/layout/dashboard-layout.tsx` - Mobile menu state management

### Admin Components
- `components/admin/stats-cards.tsx` - Responsive grid
- `components/admin/entry-table.tsx` - Mobile-optimized table
- `components/admin/user-table.tsx` - Responsive columns

### Entry Components
- `components/entries/entry-list.tsx` - Mobile tabs and table
- `components/entries/*-form.tsx` - Responsive form spacing

### Pages
- `app/page.tsx` - Responsive landing page
- `app/dashboard/page.tsx` - Responsive dashboard
- `app/admin/page.tsx` - Responsive admin dashboard
- All entry pages - Responsive layouts

## 💡 Pro Tips

1. **Always test on real devices** when possible
2. **Use Chrome DevTools** for quick responsive testing
3. **Check landscape orientation** on mobile
4. **Test with different font sizes** (accessibility)
5. **Verify touch targets** are at least 44x44px
6. **Check horizontal scroll** - should never happen
7. **Test forms** - ensure keyboard doesn't hide inputs

## 🚀 Performance

All responsive features use:
- **Pure CSS** (Tailwind utilities)
- **No JavaScript** for layout (except menu state)
- **Hardware-accelerated** transforms
- **Minimal bundle impact**

---

**The entire HR Management System is now fully responsive!** 📱💻🖥️

