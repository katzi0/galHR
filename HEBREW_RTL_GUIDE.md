# Hebrew Language & RTL Support Guide

This HR Management System now includes full Hebrew language support with Right-to-Left (RTL) layout capabilities.

## Features

### ✅ Implemented Features

1. **Bilingual Support**
   - English (en) - Default language
   - Hebrew (עברית) - Full RTL support

2. **Automatic RTL Layout**
   - Text direction automatically switches based on selected language
   - Hebrew pages display with `dir="rtl"` attribute
   - All UI components adapt to RTL layout

3. **Language Switcher**
   - Accessible from the navbar
   - Seamless switching between languages
   - Preserves current page location when switching

4. **Translated Components**
   - Authentication forms (Login, Register)
   - Navigation menus (Navbar, Sidebar)
   - Dashboard pages (User & Admin)
   - Entry forms (Hours, Expenses, Vacation, Travel)
   - Admin components (Stats Cards, Tables)
   - All UI labels and messages

## File Structure

```
/Users/shai/galHR/
├── messages/
│   ├── en.json          # English translations
│   └── he.json          # Hebrew translations
├── i18n.ts              # i18n configuration
├── middleware.ts        # Locale routing middleware
├── navigation.ts        # Internationalized navigation helpers
├── app/
│   ├── [locale]/        # Locale-based routing
│   │   ├── layout.tsx   # Root layout with locale support
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   └── admin/
│   └── page.tsx         # Root redirect to default locale
└── components/
    └── layout/
        └── language-switcher.tsx  # Language selection component
```

## Usage

### Accessing the Application

1. **English Version**: `http://localhost:3000/en`
2. **Hebrew Version**: `http://localhost:3000/he`
3. **Auto-redirect**: `http://localhost:3000` → redirects to `/en`

### Switching Languages

Users can switch languages at any time using the language switcher in the navbar:
- Click the globe/language icon
- Select "English" or "עברית"
- The page will reload with the selected language

### URL Structure

All routes now include the locale prefix:
- `/en/login` - English login page
- `/he/login` - Hebrew login page
- `/en/dashboard` - English dashboard
- `/he/dashboard` - Hebrew dashboard

## For Developers

### Adding New Translations

1. **Add to English translations** (`messages/en.json`):
```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "Feature description"
  }
}
```

2. **Add to Hebrew translations** (`messages/he.json`):
```json
{
  "myFeature": {
    "title": "התכונה שלי",
    "description": "תיאור התכונה"
  }
}
```

### Using Translations in Components

```typescript
"use client"

import { useTranslations } from 'next-intl'

export function MyComponent() {
  const t = useTranslations()
  
  return (
    <div>
      <h1>{t('myFeature.title')}</h1>
      <p>{t('myFeature.description')}</p>
    </div>
  )
}
```

### Creating Locale-Aware Links

Use the internationalized navigation helpers:

```typescript
import { Link } from '@/navigation'

// This will automatically include the current locale
<Link href="/dashboard">Dashboard</Link>
```

### Programmatic Navigation

```typescript
import { useRouter } from '@/navigation'

function MyComponent() {
  const router = useRouter()
  
  const handleClick = () => {
    router.push('/dashboard') // Automatically uses current locale
  }
  
  return <button onClick={handleClick}>Go to Dashboard</button>
}
```

## RTL Styling

### Automatic RTL Support

The layout automatically applies `dir="rtl"` for Hebrew:

```tsx
<html lang={locale} dir={locale === 'he' ? 'rtl' : 'ltr'}>
```

### Tailwind RTL Utilities

Custom RTL utilities are available in `tailwind.config.ts`:

```tsx
// Apply RTL direction
<div className="rtl">Content</div>

// Apply LTR direction
<div className="ltr">Content</div>
```

### Component-Specific RTL Handling

Most components automatically adapt to RTL, but for custom styling:

```tsx
// Use logical properties that work in both directions
className="ms-4"  // margin-start (left in LTR, right in RTL)
className="me-4"  // margin-end (right in LTR, left in RTL)
className="ps-4"  // padding-start
className="pe-4"  // padding-end
```

## Translation Coverage

### ✅ Fully Translated
- Authentication (Login, Register)
- Navigation (Navbar, Sidebar)
- Dashboard pages
- Entry forms (Hours, Expenses, Vacation, Travel)
- Admin dashboard
- Common UI elements (buttons, labels, messages)

### 📝 Partially Translated
- Error messages (some still in English)
- Validation messages
- Date formats (using default locale format)

### ⏳ To Be Translated
- Email templates
- API error responses
- System notifications

## Configuration Files

### i18n.ts
Defines available locales and loads translation messages:
```typescript
export const locales = ['en', 'he'] as const;
```

### middleware.ts
Handles locale detection and routing:
- Detects locale from URL
- Redirects to default locale if none specified
- Validates locale parameter

### navigation.ts
Provides locale-aware navigation utilities:
- `Link` - Internationalized Link component
- `useRouter` - Internationalized router hook
- `usePathname` - Get current pathname
- `redirect` - Programmatic redirect

## Best Practices

1. **Always use translation keys** - Never hardcode text in components
2. **Use logical properties** - For margins, padding (ms-, me-, ps-, pe-)
3. **Test in both languages** - Ensure UI works in both LTR and RTL
4. **Keep translations organized** - Group related translations together
5. **Use the navigation helpers** - Don't construct URLs manually

## Troubleshooting

### Language not switching
- Check that the locale is in the URL path
- Clear browser cache and cookies
- Verify middleware.ts is configured correctly

### RTL layout issues
- Ensure `dir` attribute is set on `<html>` element
- Use logical properties instead of left/right
- Check for hardcoded directional CSS

### Missing translations
- Check that the key exists in both en.json and he.json
- Verify the translation key path is correct
- Look for typos in translation keys

## Future Enhancements

- [ ] Add more languages (Arabic, French, etc.)
- [ ] Implement language detection from browser settings
- [ ] Add translation management UI for admins
- [ ] Localize date and number formats
- [ ] Add language-specific validation messages
- [ ] Implement lazy loading for translation files

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [RTL Styling Guide](https://rtlstyling.com/)
- [Hebrew Typography Best Practices](https://hebrew-academy.org.il/)

---

**Note**: The system defaults to English. Users can switch to Hebrew at any time using the language switcher in the navbar.

