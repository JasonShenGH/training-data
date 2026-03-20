# Training Data Dashboard

An interactive web dashboard for visualizing training data from intervals.icu.

## Features

- **Real-time Data Fetching**: Automatically fetches latest training data from GitHub
- **Readiness Assessment**: Color-coded daily training recommendation (GO/MODIFY/SKIP)
- **Fitness Trends**: Interactive CTL/ATL/TSB charts with 30-day and 90-day views
- **Activity Breakdown**: Visual analysis of training load and activity distribution
- **Recovery Metrics**: Sleep duration and resting heart rate tracking
- **Training Zones**: Seiler 3-zone model distribution analysis
- **Historical Summary**: Long-term trends (90d, 180d, 1y)
- **Activity Details**: Expandable table with detailed metrics and zone distribution

## Data Sources

The dashboard fetches data from:
- `https://raw.githubusercontent.com/JasonShenGH/training-data/main/latest.json`
- `https://raw.githubusercontent.com/JasonShenGH/training-data/main/history.json`

## Usage

### Local Development

1. Start a local web server:
   ```bash
   python -m http.server 8000
   ```

2. Open in browser:
   ```
   http://localhost:8000/index.html
   ```

### Deployment

Simply upload all files to any web hosting service. No build step required.

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6 modules)
- **Styling**: Tailwind CSS (via CDN)
- **Charts**: Chart.js v4 with date-fns adapter
- **No dependencies**: All libraries loaded via CDN

## File Structure

```
index.html          # Main HTML page with layout
app.js              # Data fetching and UI population
charts.js           # Chart.js configurations
utils.js            # Data formatting and helper functions
styles.css          # Custom CSS styles
latest.json         # Latest 7-day training data
history.json        # Historical training data (90+ days)
```

## Key Metrics Explained

- **CTL (Chronic Training Load)**: Long-term fitness (42-day exponential average)
- **ATL (Acute Training Load)**: Short-term fatigue (7-day exponential average)
- **TSB (Training Stress Balance)**: Form = CTL - ATL (freshness indicator)
- **ACWR (Acute:Chronic Workload Ratio)**: Injury risk indicator (optimal: 0.8-1.3)
- **TSS (Training Stress Score)**: Workout intensity × duration metric
- **TID (Training Intensity Distribution)**: Time spent in different intensity zones

## Browser Compatibility

- Modern browsers with ES6 module support
- Chrome 61+, Firefox 60+, Safari 11+, Edge 79+

## License

This dashboard is built for personal use with intervals.icu training data.
