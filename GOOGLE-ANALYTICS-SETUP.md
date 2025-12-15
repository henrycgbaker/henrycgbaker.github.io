# Google Analytics Setup Guide

## Why Google Analytics?

Track:
- Number of visitors
- Which pages are popular
- Where visitors come from (referrers)
- Devices (mobile/desktop)
- Geographic location
- Time spent on site

## Step-by-Step Setup

### 1. Create Google Analytics Account

1. Go to: https://analytics.google.com/
2. Click **"Start measuring"** or **"Create"**
3. Choose **"Google Analytics 4"** (GA4)
4. Fill in account details:
   - **Account name:** `Henry Baker Portfolio` (or your preference)
   - Check "Enable Google signals data collection" ✓
   - Check "Enable automated and enhanced measurement" ✓
5. Click **Continue**

### 2. Create Property

6. Fill in property details:
   - **Property name:** `henrycgbaker.github.io`
   - **Reporting timezone:** `Europe/Berlin` (or your timezone)
   - **Currency:** `EUR` (or your preference)
7. Click **Continue**

### 3. Setup Business Details

8. Fill in:
   - **Industry category:** `Professional Services` or `Technology`
   - **Business objectives:** Select all that apply
9. Click **Create**

### 4. Get Your Measurement ID

10. You'll see a screen with your **Measurement ID**
    - Format: `G-XXXXXXXXXX` (10 uppercase letters/numbers after G-)
    - Copy this ID (you'll need it in 30 seconds)

**⚠️ Make sure to copy the full ID including the `G-` prefix**

### 5. Add to Your Site

11. Open your editor and go to `_config.yml`
12. Find this line (~line 42):
    ```yaml
    # google_analytics: G-XXXXXXXXXX
    ```
13. Replace with your actual ID (uncomment and paste):
    ```yaml
    google_analytics: G-XXXXXXXXXX
    ```

    **Example:**
    ```yaml
    google_analytics: G-A1B2C3D4E5
    ```

14. Save the file
15. Commit and push:
    ```bash
    git add _config.yml
    git commit -m "Enable Google Analytics tracking"
    git push origin main
    ```

### 6. Verify It's Working

16. Wait 2-3 minutes for deployment
17. Go back to Google Analytics
18. Click **Admin** (bottom left) → **Tracking Info** → **Tracking Code**
19. You should see your site listed
20. Visit https://henrycgbaker.github.io in your browser
21. Go to Google Analytics → **Reports** → **Realtime**
    - You should see yourself as an active user within 10 seconds

## Viewing Analytics

### Real-time Dashboard
- **Reports** → **Realtime**
- See live visitors right now

### Traffic Overview
- **Reports** → **Home**
- Total users, sessions, engagement

### Popular Pages
- **Reports** → **Pages and screens**
- Which pages get most views

### Traffic Sources
- **Reports** → **Traffic acquisition**
- Where visitors come from (Google, direct, referrals, etc.)

### User Locations
- **Reports** → **Demographics** → **Geography**
- Which countries/cities your visitors are from

### Devices
- **Reports** → **Demographics** → **Technology**
- Mobile vs desktop visitors

## Troubleshooting

### Not seeing data?
1. Check your Measurement ID is correct in `_config.yml`
2. Wait at least 5 minutes after adding ID
3. Make sure you pushed the commit to main
4. Try visiting your site in incognito mode (not cached)

### Wrong timezone?
1. Go to **Admin** → **Property settings**
2. Change timezone and currency
3. Analytics will show data only going forward

### Want to exclude your own traffic?
1. **Admin** → **Data Filters**
2. Create filter to exclude your IP address
3. Or enable "Exclude myself" browser extension from Google

## Privacy & GDPR

If you have EU visitors, consider:
- Adding a privacy policy page mentioning GA tracking
- Getting consent before tracking (GDPR requirement)
- Disabling data sharing with Google partners

## Next Steps

Once Analytics is working:
1. Let it collect data for 1-2 weeks
2. Check which pages are most popular
3. Optimize content based on visitor behavior
4. Consider adding a blog if there's interest

---

**Need help?** See Google's official guide: https://support.google.com/analytics/answer/1008015
