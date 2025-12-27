# Demo Mode Documentation

## Overview

The HR Management System includes a **Demo Mode** feature that allows you to showcase the application with realistic mock data without needing a database connection. This is perfect for demonstrations, testing the UI, or exploring the application's features.

## Features

### What Demo Mode Includes

- **Rich Mock Data**: Pre-populated with 8 users (1 admin, 5 employees, 2 volunteers)
- **20+ Sample Entries**: Including work hours, expenses, vacation requests, and travel reports
- **Realistic Statistics**: Calculated stats showing pending entries, approved hours, expenses, etc.
- **All Entry States**: Examples of pending, approved, and rejected entries
- **Full UI Functionality**: All components work seamlessly with mock data

### What Works in Demo Mode

✅ **Admin Dashboard**
- View system statistics
- Browse all users with their entry counts
- Review and "approve/reject" entries (simulated)
- Filter entries by status (pending, approved, rejected)

✅ **User Dashboard**
- View personal entries
- Browse by entry type (hours, expenses, vacation, travel)
- See entry status and details

✅ **Authentication**
- Login with any credentials (bypassed in demo mode)
- Automatic redirect to admin dashboard

✅ **Data Operations**
- All read operations show mock data
- Write operations are simulated (show success messages but don't persist)

## How to Use Demo Mode

### Enabling Demo Mode

1. **Toggle in Navbar**: Click the switch next to "Demo Mode" in the top navigation bar
2. **Visual Indicators**: 
   - A "Demo" badge appears next to the app title
   - The switch shows the current state
3. **Page Reload**: The page automatically reloads to apply the changes

### Accessing the Application in Demo Mode

1. **Enable Demo Mode** (if not already enabled)
2. **Go to Login Page**: Navigate to `/login`
3. **Enter Any Credentials**: In demo mode, any email/password combination will work
4. **Explore**: You'll be logged in as an admin user with access to all features

### Demo Mode Credentials

When demo mode is enabled, you can use **any** email and password combination. The system will automatically log you in as:

- **Name**: Admin User
- **Role**: ADMIN
- **Access**: Full admin dashboard with all features

## Mock Data Details

### Users (8 Total)

- **1 Admin**: Admin User (Management department)
- **5 Employees**: 
  - John Doe (Engineering) - 24 entries
  - Jane Smith (Marketing) - 18 entries
  - Bob Johnson (Sales) - 32 entries
  - Alice Williams (Engineering) - 15 entries
  - Diana Prince (HR) - 12 entries
- **2 Volunteers**:
  - Charlie Brown - 8 entries
  - Eva Martinez - 5 entries

### Entries (20+ Total)

**Pending Entries (5)**
- Work hours submissions
- Expense reports
- Vacation requests
- Travel reports

**Approved Entries (13+)**
- Various work hours (totaling ~60 hours this month)
- Multiple expense reports (totaling ~$400 this month)
- Travel reports with distance tracking

**Rejected Entries (2)**
- Personal equipment purchase (rejected expense)
- Last-minute vacation request

### Statistics

The mock stats are dynamically calculated from the mock data:
- **Total Users**: 8 (1 admin, 5 employees, 2 volunteers)
- **Pending Entries**: 5
- **Approved This Month**: 13+
- **Total Hours This Month**: ~60 hours
- **Total Expenses This Month**: ~$400

## Technical Implementation

### Architecture

Demo mode is implemented using:

1. **Mock Data Provider** (`lib/mock-data.ts`)
   - Centralized mock data definitions
   - Helper functions to filter and retrieve data
   - Realistic data generation with proper dates and relationships

2. **Mode Detection** (`isMockMode()`)
   - Checks localStorage for demo mode state
   - Available throughout the application

3. **Component Integration**
   - Each data-fetching component checks for demo mode
   - Falls back to API calls when demo mode is disabled
   - Simulates loading states for realistic UX

### Files Modified

- `lib/mock-data.ts` - Mock data provider (new)
- `components/ui/switch.tsx` - Switch component (new)
- `components/layout/navbar.tsx` - Demo mode toggle
- `components/admin/stats-cards.tsx` - Stats with mock data support
- `components/admin/entry-table.tsx` - Entry management with mock data
- `components/admin/user-table.tsx` - User management with mock data
- `components/entries/entry-list.tsx` - Entry list with mock data
- `components/auth/login-form.tsx` - Login with demo mode bypass

### Code Pattern

Each component follows this pattern:

```typescript
const fetchData = useCallback(async () => {
  setIsLoading(true)
  try {
    // Check if mock mode is enabled
    if (isMockMode()) {
      // Use mock data
      await new Promise(resolve => setTimeout(resolve, 300)) // Simulate loading
      setData(getMockData())
      setIsLoading(false)
      return
    }

    // Normal API call
    const response = await fetch('/api/endpoint', {
      headers: { Authorization: `Bearer ${token}` }
    })
    // ... rest of API logic
  } catch (error) {
    // ... error handling
  } finally {
    setIsLoading(false)
  }
}, [])
```

## Benefits

### For Demonstrations
- **No Setup Required**: Show the app immediately without database setup
- **Consistent Data**: Same data every time for reliable demos
- **Full Features**: Demonstrate all features without real data concerns

### For Development
- **Rapid Testing**: Test UI without backend dependencies
- **Edge Cases**: Easily add edge case scenarios to mock data
- **Offline Development**: Work on the frontend without database access

### For Exploration
- **Safe Environment**: Explore features without affecting real data
- **Learning Tool**: Understand the app's capabilities with sample data
- **Quick Onboarding**: New users can try the system immediately

## Limitations

- **No Persistence**: Changes made in demo mode are not saved
- **Simulated Operations**: Write operations show success but don't actually modify data
- **Fixed Dataset**: The same mock data is shown each time
- **No Real Authentication**: Security features are bypassed in demo mode

## Disabling Demo Mode

To use the application with a real database:

1. **Toggle Off**: Click the Demo Mode switch in the navbar
2. **Page Reload**: The page will reload
3. **Real Login**: Use actual credentials from your database
4. **Live Data**: All operations will use the real API and database

## Best Practices

### When to Use Demo Mode

✅ **Good Use Cases**
- Product demonstrations
- UI/UX testing
- Screenshots and documentation
- Training and onboarding
- Frontend development

❌ **Avoid Using For**
- Production environments
- Real user data entry
- Security testing
- Performance testing
- Data integrity validation

### Customizing Mock Data

To customize the mock data for your needs:

1. Edit `lib/mock-data.ts`
2. Modify the `mockUsers` and `mockEntries` arrays
3. Add or remove entries as needed
4. Update the stats calculations if needed

## Future Enhancements

Potential improvements for demo mode:

- **Persistent Mock State**: Save changes to localStorage during demo session
- **Multiple Personas**: Switch between different user roles in demo mode
- **Scenario Presets**: Load different data scenarios (busy month, quiet month, etc.)
- **Data Generator**: Automatically generate random realistic data
- **Demo Tour**: Guided tour of features in demo mode

## Support

For questions or issues with demo mode:
1. Check this documentation
2. Review the mock data in `lib/mock-data.ts`
3. Open an issue on GitHub
4. Contact the development team

---

**Note**: Demo mode is intended for demonstration and development purposes only. Always use real authentication and database connections in production environments.

