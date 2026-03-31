/**
 * Help copy for dashboard metric cards. Keys must match the `title` passed to metricCard / setMetricGrid entries.
 */
export const METRIC_HELP = {
    'HRV Baseline': {
        title: 'HRV Baseline',
        paragraphs: [
            'The median of your heart rate variability (HRV) over the last seven days. It represents your recent “typical” autonomic balance when you are not acutely stressed or ill.',
            'The app compares today’s HRV to this baseline to form the HRV ratio and trend. A stable baseline over time usually means consistent recovery patterns; a drifting baseline can reflect training, lifestyle, or health changes.',
            'Interpretation: use it as context, not a target. Higher absolute HRV is not always “better” for everyone; consistency relative to your own history matters more.'
        ]
    },
    'HRV Ratio': {
        title: 'HRV Ratio',
        paragraphs: [
            'Today’s HRV divided by your seven-day median baseline. Values near 1.0 mean today looks like a normal day for you; above 1.0 suggests stronger parasympathetic tone relative to baseline; below 1.0 suggests suppression vs your norm.',
            'This dashboard flags bands such as super recovery, normal, trainable, and recovery stress based on ratio thresholds used in the scoring logic.',
            'Interpretation: a low ratio after hard training can be expected; persistent lows with poor sleep or rising RHR warrant easier days or recovery focus.'
        ]
    },
    'HRV Trend': {
        title: 'HRV Trend',
        paragraphs: [
            'Short-term change in HRV expressed as a fraction of your baseline: roughly (today − three days ago) / baseline. It captures whether HRV is moving up, down, or holding steady over a few days.',
            'Improving, stable, and declining labels use small positive/negative cutoffs so minor noise is treated as stable.',
            'Interpretation: rising trend with good sleep often supports quality training; sharp declines alongside high load or illness suggest backing off intensity or volume.'
        ]
    },
    'HRV Variability': {
        title: 'HRV Variability',
        paragraphs: [
            'The standard deviation of your daily HRV values over the last seven days. It measures how much day-to-day HRV fluctuates, not the average level.',
            'Low spread can mean a steady autonomic state; larger spread can reflect mixed stressors, alternating hard/easy days, or measurement inconsistency.',
            'This app treats very high variability as a possible sign of autonomic stress when combined with other signals—use it as one clue among many.'
        ]
    },
    Sleep: {
        title: 'Sleep',
        paragraphs: [
            'The most recent total sleep duration from your data (hours). Sleep strongly influences HRV, perceived fatigue, and training quality.',
            'Bands like excellent, good, and poor are based on simple hour thresholds used in the recovery score.',
            'Interpretation: prioritize duration and regularity; if sleep is short, expect recovery metrics to look worse even when motivation is high.'
        ]
    },
    'RHR Delta': {
        title: 'RHR Delta',
        paragraphs: [
            'Today’s resting heart rate minus the average of your last seven RHR readings. Positive values mean today’s RHR is higher than your recent norm; negative means lower.',
            'Elevated RHR can accompany illness, dehydration, poor sleep, or accumulated fatigue. A lower-than-usual RHR can align with good recovery but should be viewed alongside how you feel.',
            'The dashboard uses this delta in neural/CNS-style flags and in recovery scoring—large positive deltas are weighted as stress signals.'
        ]
    },
    'HRV Z-score': {
        title: 'HRV Z-score',
        paragraphs: [
            'How many standard deviations today’s HRV is from the mean of the last seven days: (today − mean) / SD. It standardizes “how unusual is today” compared to your very recent week.',
            'Values near 0 are typical; strongly positive means today is unusually high for you; strongly negative means unusually low.',
            'This metric feeds neural recovery labels and can contribute to CNS fatigue warnings when combined with other triggers.'
        ]
    },
    'Neural Readiness': {
        title: 'Neural Readiness',
        paragraphs: [
            'A boolean summary: “Neural Ready” when your HRV ratio is above 0.9 and RHR delta is not elevated past a small threshold (≤ 2 bpm vs seven-day average), otherwise “Neural Limited” if data allows a decision, or N/A if inputs are missing.',
            'It approximates whether autonomic markers align with being ready for neurologically demanding work (coordination, heavy lifting, high-focus intervals).',
            'Interpretation: when Limited, favor technique, easy aerobic, or rest even if muscle soreness feels manageable.'
        ]
    },
    'CNS Fatigue': {
        title: 'CNS Fatigue',
        paragraphs: [
            'A warning flag when at least two of these are true: HRV ratio below 0.90, HRV Z-score below −1, or RHR delta at or above +3 bpm vs your seven-day average.',
            'The idea is that multiple independent stress signals are more trustworthy than any single bad day.',
            'When “Yes,” the app biases training suggestions toward recovery and caps intensity guidance—treat it as a caution, not a medical diagnosis.'
        ]
    },
    ATL: {
        title: 'ATL (Acute Training Load)',
        paragraphs: [
            'Your short-term training stress (fatigue) from the load model—here taken as the latest value in your ATL series, typically emphasizing the last week or so of training impulse.',
            'ATL rises quickly when you train hard or often and falls when you rest. It answers: “How much did I just load the system?”',
            'Compare ATL to CTL and Form to see whether you are fresh, balanced, or digging a fatigue hole.'
        ]
    },
    CTL: {
        title: 'CTL (Chronic Training Load)',
        paragraphs: [
            'Your longer-horizon training stress (fitness) from the load model—the latest value in your CTL series, reflecting accumulated load over roughly the past month or more.',
            'CTL changes slowly; it estimates how much training background you have built.',
            'Rising CTL with manageable ATL usually means building fitness; falling CTL often means detraining or a deliberate taper.'
        ]
    },
    Form: {
        title: 'Form (TSB-style)',
        paragraphs: [
            'CTL minus ATL in this dashboard: positive values mean chronic load exceeds acute load (often fresher); negative means acute fatigue outweighs chronic fitness (often tired but possibly adapting).',
            'Labels like Super Recovered, Fresh, Neutral, Fatigue, and High Fatigue map to ranges used in the app’s scoring.',
            'Interpretation: very negative form for long stretches can mean overreaching; very positive form before a key event can be useful if timed intentionally.'
        ]
    },
    ACWR: {
        title: 'ACWR (Acute:Chronic Workload Ratio)',
        paragraphs: [
            'The ratio of acute load to chronic load (here, latest ATL divided by latest CTL). It summarizes whether recent load is high or low relative to your longer-term baseline.',
            'Values near 1.0 mean recent load matches your background; well above 1.0 can mean a spike; well below can mean underloading or taper.',
            'Research links large spikes to higher injury risk; this app marks optimal, high load, under-training, and injury-risk style bands for interpretation.'
        ]
    },
    'ATL Spike': {
        title: 'ATL Spike',
        paragraphs: [
            'Day-over-day percent change in ATL: (today − yesterday) / yesterday. It highlights sudden jumps in acute load.',
            'Large positive spikes mean fatigue is accumulating quickly—useful after big weekends, races, or returning from time off.',
            'The fatigue risk score uses spike magnitude as one factor; combine with sleep and HRV rather than reacting to spikes alone.'
        ]
    },
    'Fatigue Momentum': {
        title: 'Fatigue Momentum',
        paragraphs: [
            'Percent change in ATL over a few days (today vs three days ago). It captures whether acute load is trending up, down, or flat over a short window.',
            'Rising momentum with poor recovery markers suggests load is still building; declining momentum can mean a deload or natural fatigue decay.',
            'Trend labels (improving/stable/declining) reuse the same logic as HRV trend but applied to this load trajectory.'
        ]
    },
    Monotony: {
        title: 'Monotony',
        paragraphs: [
            'Derived from your last seven ATL values: mean daily load divided by the standard deviation. When every day looks similar, SD is small and monotony is high; more variety lowers monotony.',
            'High monotony means repetitive stress patterns, which some models associate with higher strain and injury risk.',
            'This dashboard uses monotony in strain calculation, structural fatigue, and fatigue risk scoring.'
        ]
    },
    Strain: {
        title: 'Strain',
        paragraphs: [
            'A composite index: weekly load flavor approximated as mean daily load × 7 × monotony (Banister-style strain concept). It rises both when total load rises and when daily load is uniform.',
            'High strain means you are both loading and repeating—often more stressful than the same volume spread with variety and easier days.',
            'Use it to see whether your week is “flat” hard vs undulating.'
        ]
    },
    'Strength Fatigue': {
        title: 'Strength Fatigue',
        paragraphs: [
            '“Yes” if any workout in the last 48 hours looks like strength work (keywords in the raw workout data such as strength, squat, bench, 力量, etc.).',
            'It is a simple proxy for recent neuromuscular lifting stress, not a measure of muscle damage.',
            'The app reduces structure and strength readiness scores slightly when recent strength work is detected so aerobic and heavy lifting demands are not double-counted as “fresh.”'
        ]
    },
    'Strength Frequency (7d)': {
        title: 'Strength Frequency (7d)',
        paragraphs: [
            'Count of strength-like sessions in the rolling past seven days (same keyword heuristic as Strength Fatigue).',
            'It helps distinguish occasional lifting from frequent strength stacking that may need more recovery between sessions.',
            'The readiness model treats a moderate frequency as ideal, with penalties for none or for very high counts in the structure score.'
        ]
    },
    'Training Density': {
        title: 'Training Density',
        paragraphs: [
            'Average number of workouts per day over the last seven days (workouts in 7d ÷ 7). Values above 1 mean more than one session per day on average across the week.',
            'Higher density increases mechanical and metabolic stress even when each session feels small.',
            'Used with monotony and other factors for structural fatigue and fatigue risk; very high density plus high monotony is flagged as especially demanding.'
        ]
    },
    'Fatigue Risk Score': {
        title: 'Fatigue Risk Score',
        paragraphs: [
            'A discrete risk level (Low, Moderate, High) built from points assigned when ACWR, monotony, ATL spike, and training density cross thresholds.',
            'Each factor contributes 0–2 points; totals map to three bands so you get a simple headline risk, not a continuous probability.',
            'Use it to decide whether to add intensity, hold steady, or pull back—especially when other sections (HRV, sleep) agree.'
        ]
    },
    'Structural Fatigue': {
        title: 'Structural Fatigue',
        paragraphs: [
            '“High” when monotony is above 2 and training density is above 1.2 in the same window—meaning repetitive loading plus frequent sessions.',
            'The idea is that structure (how load is distributed) can create fatigue even when acute markers still look acceptable.',
            '“Normal” means that specific structural pattern is not flagged; it does not guarantee you are fresh overall.'
        ]
    },
    'Readiness Score': {
        title: 'Readiness Score',
        paragraphs: [
            'A 0–100 composite blending recovery system (~30%), neural (~20%), training load (~25%), training structure (~15%), and fatigue risk (~10%), then clamped to the 0–100 range.',
            'It summarizes “how ready does the model think you are to train hard today” from the same inputs you see in the cards.',
            'It is a training aid, not medical advice; align it with subjective readiness and external stressors.'
        ]
    },
    'Strength Readiness': {
        title: 'Strength Readiness',
        paragraphs: [
            'A derived 0–100 score: heavily based on the overall readiness score, with an adjustment for recent strength work (recent strength session reduces the number slightly; absence adds a small boost).',
            'It is meant to approximate tolerance for heavy lifting, not bar speed or RPE in the gym.',
            'Use it alongside Strength Fatigue and CNS Fatigue when planning max effort or high-volume lifting.'
        ]
    },
    'Aerobic Readiness': {
        title: 'Aerobic Readiness',
        paragraphs: [
            'A 0–100 score combining the overall readiness score with an HRV-ratio adjustment: better ratio nudges aerobic readiness up; suppressed HRV nudges it down.',
            'It emphasizes systems most relevant to sustained cardio (autonomic recovery and general load state).',
            'Low aerobic readiness does not always forbid easy movement; it suggests caution with long or intense aerobic work.'
        ]
    }
};
