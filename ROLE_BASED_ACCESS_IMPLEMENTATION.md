# Role-Based Access Control Implementation

## Summary
Implemented role-based access control for the "Kurs Ekle" (Add Course) button on the Courses page. Only users with `teacher` or `admin` roles can see this button; `student` role users cannot.

## Files Created

### 1. `client/utils/roles.ts`
- Defines `UserRole` type: `"student" | "teacher" | "admin"`
- Exports permission helper functions:
  - `canSeeAddCourse(role)` - Returns true for teacher/admin
  - `isAdmin(role)` - Returns true for admin only
  - `isTeacher(role)` - Returns true for teacher only
  - `isStudent(role)` - Returns true for student only

### 2. `client/services/authService.ts`
- `getToken()` - Retrieves token from localStorage
- `setToken(token)` - Stores token in localStorage
- `removeToken()` - Removes token from localStorage
- `fetchMe()` - Calls `GET /api/user` with Authorization header to fetch user data

### 3. `client/context/AuthContext.tsx`
- Global authentication state management
- Automatically fetches user data on app load if token exists
- Provides:
  - `auth.status`: "loading" | "authenticated" | "unauthenticated"
  - `auth.user`: User object with id, name, email, role
  - `refetchUser()`: Manually refetch user data
  - `logout()`: Clear user data and token

### 4. `client/components/Courses/AddCourseButton.tsx`
- Conditional button component
- Uses `useAuth()` hook to get current user role
- Returns `null` if user doesn't have permission
- Includes `data-testid="add-course-btn"` for testing

## Files Modified

### 1. `client/store/slices/userSlice.ts`
**Added:**
- `User` interface with id, name, email, role
- `user: User | null` to state
- `isLoading: boolean` to state
- New actions: `setUser`, `setLoading`, `clearUser`

### 2. `client/pages/Index.tsx` (Courses Page)
**Added:**
- Import `AddCourseButton` component
- Placed button in header section next to page title
- Button appears in top-right corner of the page

### 3. `client/App.tsx`
**Added:**
- Import `AuthProvider`
- Wrapped entire app with `<AuthProvider>` (placed after Redux Provider and QueryClientProvider)

## How It Works

1. **On App Load:**
   - `AuthProvider` checks for token in localStorage
   - If token exists, calls `GET /api/user` with `Authorization: Bearer <token>`
   - Stores user data (including role) in Redux store

2. **On Courses Page:**
   - `AddCourseButton` component checks current user's role
   - If role is "teacher" or "admin", button renders
   - If role is "student" or user is not authenticated, button returns null

3. **On Page Refresh (F5):**
   - Token persists in localStorage
   - `AuthProvider` automatically refetches user data
   - Button visibility is maintained based on role

## API Requirements

The backend must provide:
- **Endpoint:** `GET /api/user`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** 
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "student" | "teacher" | "admin"
}
```

## Testing Checklist

### ✅ Student Role
- [ ] Login as student user
- [ ] Navigate to `/courses`
- [ ] Verify "Kurs Ekle" button is NOT visible
- [ ] Check DOM: `getByTestId('add-course-btn')` should fail

### ✅ Teacher Role
- [ ] Login as teacher user
- [ ] Navigate to `/courses`
- [ ] Verify "Kurs Ekle" button IS visible
- [ ] Button should be in top-right corner of page header

### ✅ Admin Role
- [ ] Login as admin user
- [ ] Navigate to `/courses`
- [ ] Verify "Kurs Ekle" button IS visible

### ✅ Refresh Behavior
- [ ] Login as teacher/admin
- [ ] Navigate to `/courses`
- [ ] Press F5 to refresh
- [ ] Verify button is still visible after reload

### ✅ No Token
- [ ] Clear localStorage
- [ ] Navigate to `/courses`
- [ ] Verify "Kurs Ekle" button is NOT visible

## Security Notes

⚠️ **Important:** This implementation only controls UI visibility. The backend MUST also implement role-based authorization on the course creation endpoint to prevent unauthorized API calls.

## Code Quality

- ✅ No TypeScript errors
- ✅ No lint errors
- ✅ Role strings centralized in `utils/roles.ts` (no magic strings)
- ✅ Proper type safety with `UserRole` type
- ✅ Clean separation of concerns
- ✅ Reusable permission helpers

## Usage Example

To add more role-based features:

```tsx
import { useAuth } from "@/context/AuthContext";
import { canSeeAddCourse, isAdmin } from "@/utils/roles";

function MyComponent() {
  const { auth } = useAuth();
  const role = auth.status === "authenticated" ? auth.user?.role : null;

  if (isAdmin(role)) {
    return <AdminPanel />;
  }

  if (canSeeAddCourse(role)) {
    return <TeacherFeatures />;
  }

  return <StudentView />;
}
```
