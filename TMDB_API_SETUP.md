# TMDB API Setup Guide

## Problem: TMDB API Key Not Responding

Your TMDB API is not responding because you're using an **old API Key format** instead of the new **Read Access Token (Bearer Token)** that TMDB now requires.

## Solution: Get a New Bearer Token

### Step 1: Access TMDB API Settings
1. Go to [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. Log in to your TMDB account (or create one if you don't have it)

### Step 2: Get Your Read Access Token
1. Scroll down to the section labeled **"API Read Access Token (v4 auth)"**
2. You'll see a long token that starts with `eyJ...`
3. Click the **Copy** button to copy the entire token

### Step 3: Update Your .env File
1. Open `frontend/.env` in your project
2. Replace the current `VITE_TMDB_API_KEY` value with your new Bearer Token
3. The token should look like this (but much longer):
   ```
   VITE_TMDB_API_KEY=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI....(very long string)
   ```

### Step 4: Restart Your Development Server
1. Stop your current dev server (Ctrl+C)
2. Restart it with `npm run dev`
3. The API should now work!

## How to Verify It's Working

### Option 1: Run the Test Script
```bash
node frontend/test-tmdb-api.js
```

This will test both the old API key format and the new Bearer token format.

### Option 2: Check Browser Console
1. Open your app in the browser
2. Open Developer Tools (F12)
3. Check the Console tab
4. If you see errors like "401 Unauthorized", your token is invalid
5. If you see movie data loading, it's working!

## Common Issues

### Issue: Still Getting 401 Errors
**Solution:** Make sure you copied the **entire** Bearer Token. It's very long (200+ characters).

### Issue: Token Starts with a Regular String
**Solution:** You copied the wrong thing. The Bearer Token must start with `eyJ`.

### Issue: Changes Not Taking Effect
**Solution:** 
1. Make sure you saved the `.env` file
2. Restart your development server
3. Clear your browser cache (Ctrl+Shift+R)

## What Changed?

- **Old Format (API Key):** `feade1c6afce47ef56a28cafe1e6efcf`
  - Short string (32 characters)
  - Used in URL parameters: `?api_key=xxx`
  - ❌ No longer recommended by TMDB

- **New Format (Bearer Token):** `eyJhbGciOiJIUzI1NiJ9...`
  - Long JWT token (200+ characters)
  - Used in Authorization header: `Authorization: Bearer xxx`
  - ✅ Required for new TMDB API v4

## Code Changes Made

The following files have been updated to support both formats and provide better error messages:

1. **`frontend/src/services/api.js`**
   - Added automatic detection of Bearer tokens
   - Added comprehensive error handling
   - Shows helpful error messages in console

2. **`frontend/.env`**
   - Added detailed instructions on how to get Bearer Token

3. **`frontend/.env.example`**
   - Updated with clear instructions for new users

## Need Help?

If you're still having issues:
1. Check the browser console for specific error messages
2. Verify your token at [TMDB API Settings](https://www.themoviedb.org/settings/api)
3. Make sure your TMDB account is verified
4. Try generating a new token if the current one doesn't work