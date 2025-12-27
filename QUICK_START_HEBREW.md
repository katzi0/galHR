# Quick Start - Hebrew Language Support

## 🚀 Getting Started

### Start the Application

```bash
npm run dev
```

Visit:
- English: `http://localhost:3000/en`
- Hebrew: `http://localhost:3000/he`

### Switch Languages

Click the language icon (🌐) in the navbar and select:
- **English** or **עברית**

## 📖 For Users

### Accessing Different Languages

| Language | URL Example |
|----------|-------------|
| English (Default) | `http://localhost:3000/en/dashboard` |
| Hebrew | `http://localhost:3000/he/dashboard` |
| Auto-redirect | `http://localhost:3000` → `/en` |

### Features

✅ Full Hebrew translation  
✅ Right-to-Left (RTL) layout  
✅ Language switcher in navbar  
✅ All pages and forms translated  
✅ Seamless language switching  

## 💻 For Developers

### Adding Translations

**1. Add to English (`messages/en.json`):**
```json
{
  "myFeature": {
    "title": "My Feature"
  }
}
```

**2. Add to Hebrew (`messages/he.json`):**
```json
{
  "myFeature": {
    "title": "התכונה שלי"
  }
}
```

### Using Translations in Components

```typescript
"use client"
import { useTranslations } from 'next-intl'

export function MyComponent() {
  const t = useTranslations()
  return <h1>{t('myFeature.title')}</h1>
}
```

### Creating Locale-Aware Links

```typescript
import { Link } from '@/navigation'

// Automatically includes current locale
<Link href="/dashboard">Dashboard</Link>
```

### Programmatic Navigation

```typescript
import { useRouter } from '@/navigation'

const router = useRouter()
router.push('/dashboard') // Uses current locale
```

## 🎨 RTL Styling

### Automatic RTL

Hebrew pages automatically get `dir="rtl"` attribute.

### Custom RTL Utilities

```tsx
<div className="rtl">RTL content</div>
<div className="ltr">LTR content</div>
```

### Logical Properties

Use these for RTL compatibility:

| Instead of | Use |
|------------|-----|
| `ml-4` | `ms-4` (margin-start) |
| `mr-4` | `me-4` (margin-end) |
| `pl-4` | `ps-4` (padding-start) |
| `pr-4` | `pe-4` (padding-end) |

## 📁 Key Files

| File | Purpose |
|------|---------|
| `messages/en.json` | English translations |
| `messages/he.json` | Hebrew translations |
| `i18n/config.ts` | Locale configuration |
| `middleware.ts` | Locale routing |
| `navigation.ts` | Internationalized navigation |

## 🔧 Common Tasks

### Add a New Translation Key

1. Add to both `messages/en.json` and `messages/he.json`
2. Use in component: `t('your.new.key')`
3. Test in both languages

### Create a New Page

1. Create in `app/[locale]/your-page/page.tsx`
2. Use `useTranslations()` hook
3. Add translations to message files
4. Test in both languages

### Update Navigation

1. Add translation keys to `messages/*.json`
2. Update `components/layout/sidebar.tsx` or `navbar.tsx`
3. Use `t('nav.yourNewItem')`

## ✅ Testing Checklist

- [ ] Page loads in English (`/en/...`)
- [ ] Page loads in Hebrew (`/he/...`)
- [ ] RTL layout works correctly
- [ ] Language switcher works
- [ ] All text is translated
- [ ] Forms work in both languages
- [ ] Navigation works correctly

## 📚 Documentation

- **Full Guide:** `HEBREW_RTL_GUIDE.md`
- **Implementation Details:** `HEBREW_RTL_IMPLEMENTATION.md`
- **Completion Status:** `IMPLEMENTATION_COMPLETE.md`

## 🐛 Troubleshooting

### Language not switching
- Check URL includes locale: `/en/...` or `/he/...`
- Clear browser cache
- Verify middleware is configured

### RTL layout issues
- Check `dir` attribute on `<html>` element
- Use logical properties (ms-, me-, ps-, pe-)
- Avoid hardcoded left/right CSS

### Missing translations
- Verify key exists in both `en.json` and `he.json`
- Check translation key path is correct
- Look for typos in keys

## 🎯 Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📞 Need Help?

1. Check `HEBREW_RTL_GUIDE.md` for detailed instructions
2. Review translation files for available keys
3. Consult next-intl docs: https://next-intl-docs.vercel.app/

---

**Status:** ✅ Ready to use  
**Build:** ✅ Successful  
**Languages:** English (en) + Hebrew (he)

