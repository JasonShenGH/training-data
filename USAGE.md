# Training Dashboard - Quick Start Guide

## Opening the Dashboard

### Option 1: Local Server (Recommended)
1. Open a terminal in the project directory
2. Start a web server:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and navigate to: `http://localhost:8000/index.html`

### Option 2: Direct File Access
Simply double-click `index.html` to open it in your browser. Note: Some browsers may block external data fetching when opening files directly.

## Dashboard Features

### 1. Readiness Card (Top Left)
- **Green (GO)**: Ready to train as planned
- **Yellow (MODIFY)**: Adjust training intensity or volume
- **Red (SKIP)**: Consider rest or very light activity
- Shows signal summary (green/amber/red indicators)

### 2. Quick Stats (Top Right)
- **Training (7d)**: Total hours and TSS from last 7 days
- **Form (TSB)**: Training Stress Balance
  - Positive: Fresh/rested
  - -10 to 0: Optimal training zone
  - -30 to -10: Moderate fatigue
  - Below -30: High fatigue
- **ACWR**: Acute:Chronic Workload Ratio
  - 0.8-1.3: Optimal (low injury risk)
  - Below 0.8: Detraining risk
  - Above 1.3: High injury risk
- **Phase**: Current training phase and week

### 3. Fitness Trends Chart
- **Blue line (CTL)**: Long-term fitness (42-day average)
- **Orange line (ATL)**: Short-term fatigue (7-day average)
- **Green line (TSB)**: Form = CTL - ATL
- Toggle between 30-day and 90-day views using buttons

### 4. Training Load Chart
- Bar chart showing daily TSS for last 7 days
- Color-coded by activity type
- Hover to see activity details

### 5. Activity Distribution
- Pie chart showing breakdown by activity type
- Shows count, duration, and TSS per type

### 6. Recovery & Wellness
- **Sleep Chart**: Daily sleep duration
  - Green: 7.5+ hours (good)
  - Yellow: 6.5-7.5 hours (fair)
  - Red: Below 6.5 hours (poor)
- **RHR Chart**: Resting heart rate trend with 7-day baseline
  - Lower is generally better
  - Elevated RHR may indicate fatigue or illness

### 7. Training Intensity Distribution (TID)
- Compares 7-day vs 28-day zone distribution
- Based on Seiler 3-zone model:
  - Zone 1: Low intensity (recovery/easy)
  - Zone 2: Moderate intensity (tempo)
  - Zone 3: High intensity (threshold+)
- Shows classification (Base/Pyramidal/Polarized)

### 8. Historical Summary
- 90-day, 180-day, and 1-year statistics
- Shows fitness progression and training volume trends

### 9. Recent Activities Table
- Click "Details" to expand each activity
- Shows metrics, heart rate zones, and coach notes
- Zone distribution visualized with color-coded bars

## Keyboard Shortcuts

- **Ctrl+R** (or **Cmd+R** on Mac): Refresh data

## Data Refresh

- Dashboard auto-refreshes every 5 minutes
- Manual refresh: Click "Refresh Data" button in header
- Data is cached for 5 minutes to improve performance

## Troubleshooting

### Page won't load
- Ensure you're using `http://localhost:8000` not `file://`
- Check that the server is running
- Clear browser cache and reload

### Charts not displaying
- Check browser console (F12) for errors
- Ensure internet connection (CDN libraries need to load)
- Try a different browser (Chrome, Firefox, Edge recommended)

### Data not updating
- Click "Refresh Data" button
- Clear browser cache
- Check that GitHub URLs are accessible

## Browser Requirements

- Modern browser with ES6 module support
- JavaScript enabled
- Internet connection for CDN libraries and data fetching

## Mobile Usage

The dashboard is fully responsive and works on mobile devices:
- Charts automatically resize
- Tables are horizontally scrollable
- Touch-friendly interface

## Tips

1. **Best viewed on desktop** for full chart details
2. **Bookmark the page** for quick access
3. **Check readiness daily** before training
4. **Monitor TSB trends** to avoid overtraining
5. **Track sleep patterns** for recovery insights
6. **Review TID** to ensure proper training distribution

## Data Sources

- Latest data: `https://raw.githubusercontent.com/JasonShenGH/training-data/main/latest.json`
- Historical data: `https://raw.githubusercontent.com/JasonShenGH/training-data/main/history.json`

Data is automatically fetched from these URLs when you open the dashboard.
