# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for your Letterboxd clone application.

## Prerequisites

- A Google account
- Node.js and npm installed
- Your project already has Firebase installed

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter a project name
   - (Optional) Enable Google Analytics
   - Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`)
2. Register your app:
   - App nickname: `Letterboxd Clone` (or your preferred name)
   - **Do NOT** check "Also set up Firebase Hosting"
   - Click "Register app"

## Step 3: Get Your Firebase Configuration

1. After registering, you'll see your Firebase configuration object
2. Copy the configuration values (you'll need these for your `.env` file)

Example configuration:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

## Step 4: Enable Authentication Methods

1. In the Firebase Console, go to **Build** → **Authentication**
2. Click "Get started"
3. Go to the **Sign-in method** tab
4. Enable the following providers:

### Email/Password Authentication
1. Click on "Email/Password"
2. Toggle "Enable"
3. Click "Save"

### Google Sign-In (Optional but Recommended)
1. Click on "Google"
2. Toggle "Enable"
3. Select a support email
4. Click "Save"

## Step 5: Configure Your Environment Variables

1. In your `frontend` directory, create a `.env` file (if it doesn't exist)
2. Copy the contents from `.env.example`
3. Fill in your Firebase configuration values:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Important:** Never commit your `.env` file to version control!

## Step 6: Configure Authorized Domains

1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Add your domains:
   - `localhost` (for local development)
   - Your production domain (when deployed)

## Step 7: Test Your Setup

1. Start your development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Navigate to the registration page
3. Try creating an account with email/password
4. Check your email for the verification link
5. Try logging in with Google (if enabled)

## Security Features Implemented

✅ **Password Hashing**: Firebase automatically hashes passwords using bcrypt
✅ **Email Verification**: Users receive verification emails upon registration
✅ **Password Reset**: Users can reset forgotten passwords via email
✅ **OAuth Integration**: Google Sign-In for easy authentication
✅ **Session Management**: Secure token-based authentication
✅ **Rate Limiting**: Firebase protects against brute force attacks
✅ **HTTPS Only**: All authentication requests use HTTPS

## Common Issues and Solutions

### Issue: "Firebase: Error (auth/configuration-not-found)"
**Solution:** Make sure all environment variables are set correctly in your `.env` file

### Issue: "Firebase: Error (auth/unauthorized-domain)"
**Solution:** Add your domain to the authorized domains list in Firebase Console

### Issue: Google Sign-In popup blocked
**Solution:** Allow popups for your domain in browser settings

### Issue: Email verification not sending
**Solution:** 
1. Check your Firebase Console → Authentication → Templates
2. Verify your email templates are configured
3. Check spam folder

## Additional Configuration (Optional)

### Customize Email Templates

1. Go to **Authentication** → **Templates** in Firebase Console
2. Customize the following templates:
   - Email verification
   - Password reset
   - Email address change

### Enable Multi-Factor Authentication

1. Go to **Authentication** → **Settings**
2. Under "User account management", enable "Multi-factor authentication"

### Set Password Policy

1. Go to **Authentication** → **Settings**
2. Under "Password policy", configure:
   - Minimum password length
   - Require uppercase/lowercase
   - Require numbers/symbols

## Testing Checklist

- [ ] User can register with email/password
- [ ] User receives verification email
- [ ] User can log in with verified email
- [ ] User can log in with Google
- [ ] User can reset password
- [ ] User can log out
- [ ] Protected routes redirect to login when not authenticated
- [ ] User session persists on page reload

## Support

For more information, visit:
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)

## Security Best Practices

1. **Never expose your Firebase config in public repositories**
2. **Use environment variables for all sensitive data**
3. **Enable email verification for all users**
4. **Implement proper error handling**
5. **Use HTTPS in production**
6. **Regularly review Firebase security rules**
7. **Monitor authentication logs in Firebase Console**
8. **Keep Firebase SDK updated**

---

**Note:** This implementation uses Firebase Authentication v9+ (modular SDK) for better tree-shaking and smaller bundle sizes.