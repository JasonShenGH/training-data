import { METRIC_HELP as EN_METRIC_HELP } from './metricHelp.js';

const LOCALE_STORAGE_KEY = 'training-dashboard-language';
const DEFAULT_LOCALE = 'zh';

const STRINGS = {
    zh: {
        'app.title': 'LoadFit 洞察',
        'app.brand': 'LoadFit 洞察',
        'loading.title': '加载仪表盘',
        'loading.subtitle': '正在准备你的数据源',
        'error.title': '数据错误',
        'error.reload': '重新加载',
        'gauge.value': '仪表盘数值 {{value}} / 100',
        'errors.fetchFailed': '无法获取 GitHub JSON 文件。',
        'errors.initFailed': '初始化仪表盘失败：{{message}}',
        'header.greeting': '你好，{{name}}',
        'source.prefix': '数据来源：',
        'source.customJson': '自定义 JSON',
        'source.githubJson': 'GitHub JSON',
        'menu.open': '打开数据菜单',
        'menu.uploadJson': '上传 JSON 文件',
        'menu.pasteJson': '粘贴 JSON 内容',
        'menu.clearCustom': '清除自定义数据',
        'menu.loadSample': '加载示例数据',
        'menu.trainingStatus': '训练状态仪表盘',
        'menu.toggleTheme': '切换深色 / 浅色主题',
        'menu.languageToggleToEnglish': '切换到 English',
        'menu.languageToggleToChinese': '切换到 中文',
        'paste.instructions': '在下方粘贴 JSON 内容，然后点击加载。',
        'paste.placeholder': '在这里粘贴 JSON',
        'paste.load': '加载粘贴的 JSON',
        'paste.clear': '清空文本',
        'hero.recoveryScore': '恢复分数',
        'hero.statusLevel': '状态等级',
        'hero.level': '等级 {{level}}',
        'dashboard.recovery': '恢复仪表盘',
        'dashboard.trainingSuggestions': '今日训练建议',
        'dashboard.trainingStructures': '建议训练结构',
        'dashboard.trendProjection': '趋势预测',
        'dashboard.atlCtlTrend': 'ATL / CTL 趋势',
        'dashboard.hrvRhrTrend': 'HRV / RHR 趋势',
        'dashboard.workoutDetails': '训练详情',
        'dashboard.sleepSessions': '睡眠记录',
        'dashboard.hrvSeries': 'HRV 序列',
        'dashboard.rhrSeries': 'RHR 序列',
        'dashboard.atlCtlSeries': 'ATL / CTL 序列',
        'dashboard.comments': '备注',
        'suggest.recommended': '推荐训练',
        'suggest.avoid': '避免训练',
        'suggest.intensity': '强度 / RPE',
        'suggest.zoneDuration': '心率区间 / 时长',
        'trend.fatigue': '疲劳趋势',
        'trend.ctl': 'CTL 趋势',
        'trend.window': '未来 48 小时窗口',
        'trend.risk': '未来疲劳风险',
        'table.info': '信息',
        'table.noData': '暂无数据。',
        'table.date': '日期',
        'table.start': '开始',
        'table.end': '结束',
        'table.totalHours': '总时长（小时）',
        'table.hrv': 'HRV',
        'table.rhr': 'RHR',
        'table.atl': 'ATL',
        'table.ctl': 'CTL',
        'table.form': 'Form',
        'table.rawDate': '日期',
        'table.rawValue': '数值',
        'table.rawName': '名称',
        'table.rawDetail': '详情',
        'comment.none': 'JSON 文件中没有备注。',
        'cockpit.title': '训练状态仪表盘',
        'cockpit.captureGenerating': '正在生成图片…',
        'cockpit.saveLabel': '保存仪表盘为 PNG 图片',
        'cockpit.closeLabel': '关闭训练状态仪表盘',
        'cockpit.recoverySystem': '恢复系统',
        'cockpit.neuralSystem': '神经系统',
        'cockpit.trainingLoad': '训练负荷',
        'cockpit.trainingStructure': '训练结构',
        'cockpit.strengthReadiness': '力量准备度',
        'cockpit.aerobicReadiness': '有氧准备度',
        'cockpit.recommendedTraining': '推荐训练',
        'cockpit.avoidTraining': '避免训练',
        'cockpit.rpeRange': 'RPE 范围',
        'cockpit.heartRateZone': '心率区间',
        'cockpit.duration': '时长',
        'cockpit.recoveryScore': '恢复分数',
        'metricHelp.close': '关闭帮助',
        'metricHelp.about': '关于此指标',
        'metricHelp.label': '帮助：{{title}}',
        'metricTitles.hrvBaseline': 'HRV 基线',
        'metricTitles.hrvRatio': 'HRV 比率',
        'metricTitles.hrvTrend': 'HRV 趋势',
        'metricTitles.hrvVariability': 'HRV 波动性',
        'metricTitles.sleep': '睡眠',
        'metricTitles.rhrDelta': 'RHR 变化',
        'metricTitles.hrvZ': 'HRV Z 分数',
        'metricTitles.neuralReadiness': '神经准备度',
        'metricTitles.cnsFatigue': '中枢神经疲劳',
        'metricTitles.atl': 'ATL（急性训练负荷）',
        'metricTitles.ctl': 'CTL（慢性训练负荷）',
        'metricTitles.form': 'Form（TSB 风格）',
        'metricTitles.acwr': 'ACWR（急慢性负荷比）',
        'metricTitles.atlSpike': 'ATL 突增',
        'metricTitles.fatigueMomentum': '疲劳动量',
        'metricTitles.monotony': '单调性',
        'metricTitles.strain': '应激指数',
        'metricTitles.strengthFatigue': '力量疲劳',
        'metricTitles.strengthFrequency': '力量频率（7 天）',
        'metricTitles.trainingDensity': '训练密度',
        'metricTitles.fatigueRiskScore': '疲劳风险分数',
        'metricTitles.structuralFatigue': '结构性疲劳',
        'metricTitles.readinessScore': '准备度分数',
        'metricTitles.strengthReadiness': '力量准备度',
        'metricTitles.aerobicReadiness': '有氧准备度',
        'structure.detail': '强度等级 {{intensityLevel}}/5（基于 {{readinessLevel}} 级）。{{sessionFocus}}',
        'structure.noRecommendation': '暂无训练建议。',
        'structure.type.recovery': '恢复',
        'structure.type.aerobicPriority': '以有氧为主',
        'structure.type.mixed': '混合（力量 + 有氧）',
        'structure.type.aerobicBase': '有氧基础',
        'structure.focus.recovery': 'Z1 / 灵活性 / 休息',
        'structure.focus.aerobicBase': 'Z2 稳态 45–75 分钟',
        'structure.focus.aerobicPriority': 'Z2 + Z3 间歇（避免重力量）',
        'structure.focus.mixed': '力量（上肢 / 全身，非极限）+ Z2 20 分钟',
        'guidance.easy': '轻松恢复训练',
        'guidance.avoid.easy': 'VO2max / 重力量',
        'guidance.steady': '稳态有氧 + 轻技术',
        'guidance.avoid.steady': '最大间歇',
        'guidance.quality': '高质量训练',
        'guidance.avoid.quality': '无特别限制，注意疲劳',
        'guidance.rpe': 'RPE {{rpe}}',
        'guidance.zoneDuration': '{{zone}} | {{duration}}',
        'trend.accumulating': '累积中',
        'trend.releasing': '释放中',
        'trend.rising': '上升中',
        'trend.dropping': '下降中',
        'trend.recoveryFirst': '以恢复为先',
        'trend.qualityOpen': '可进行高质量训练',
        'trend.controlledVolume': '可控训练量窗口',
        'trend.highRisk': '若提高强度则风险较高',
        'trend.managed': '谨慎递增负荷可控',
        'trend.lowRisk': '短期疲劳风险较低',
        'statuses.veryLow': '很低',
        'statuses.low': '低',
        'statuses.moderate': '中等',
        'statuses.good': '良好',
        'statuses.excellent': '优秀',
        'statuses.nA': '无数据',
        'statuses.superRecovered': '超级恢复',
        'statuses.fresh': '状态清爽',
        'statuses.neutral': '中性',
        'statuses.fatigue': '疲劳',
        'statuses.highFatigue': '高疲劳',
        'statuses.underTraining': '训练不足',
        'statuses.optimalZone': '最佳区间',
        'statuses.highLoad': '高负荷',
        'statuses.injuryRisk': '受伤风险',
        'statuses.superRecovery': '超量恢复',
        'statuses.trainable': '可训练',
        'statuses.recoveryStress': '恢复压力',
        'statuses.improving': '改善中',
        'statuses.declining': '下降中',
        'statuses.stable': '稳定',
        'statuses.normalVariation': '正常波动',
        'statuses.autonomicStress': '自主神经压力',
        'statuses.recovered': '已恢复',
        'statuses.warning': '警告',
        'statuses.clear': '清晰',
        'statuses.ready': '准备就绪',
        'statuses.limited': '受限',
        'statuses.yes': '是',
        'statuses.no': '否',
        'statuses.high': '高',
        'statuses.normal': '正常',
        'statuses.accumulating': '累积中',
        'statuses.releasing': '释放中',
        'statuses.rising': '上升中',
        'statuses.dropping': '下降中',
        'statuses.recovery': '恢复',
        'statuses.aerobicPriority': '以有氧为主',
        'statuses.mixed': '混合',
        'statuses.aerobicBase': '有氧基础'
    },
    en: {
        'app.title': 'LoadFit Insights',
        'app.brand': 'LoadFit Insights',
        'loading.title': 'Loading dashboard',
        'loading.subtitle': 'Preparing your data source',
        'error.title': 'Data error',
        'error.reload': 'Reload',
        'gauge.value': 'Gauge value {{value}} out of 100',
        'errors.fetchFailed': 'Failed to fetch GitHub JSON files.',
        'errors.initFailed': 'Failed to initialize dashboard: {{message}}',
        'header.greeting': 'Hi, {{name}}',
        'source.prefix': 'Data source: ',
        'source.customJson': 'Custom JSON',
        'source.githubJson': 'GitHub JSON',
        'menu.open': 'Open data menu',
        'menu.uploadJson': 'Upload JSON File',
        'menu.pasteJson': 'Paste JSON Content',
        'menu.clearCustom': 'Clear Custom Data',
        'menu.loadSample': 'Load Sample Data',
        'menu.trainingStatus': 'Training Status Dashboard',
        'menu.toggleTheme': 'Toggle Dark/Light Theme',
        'menu.languageToggleToEnglish': 'Switch to English',
        'menu.languageToggleToChinese': 'Switch to 中文',
        'paste.instructions': 'Paste a JSON payload below, then click load.',
        'paste.placeholder': 'Paste JSON here',
        'paste.load': 'Load pasted JSON',
        'paste.clear': 'Clear text',
        'hero.recoveryScore': 'Recovery score',
        'hero.statusLevel': 'Status level',
        'hero.level': 'Level {{level}}',
        'dashboard.recovery': 'Recovery dashboard',
        'dashboard.trainingSuggestions': "Today's training suggestions",
        'dashboard.trainingStructures': 'Suggested training structures',
        'dashboard.trendProjection': 'Trend projection',
        'dashboard.atlCtlTrend': 'ATL / CTL trend',
        'dashboard.hrvRhrTrend': 'HRV / RHR trend',
        'dashboard.workoutDetails': 'Workout details',
        'dashboard.sleepSessions': 'Sleep sessions',
        'dashboard.hrvSeries': 'HRV series',
        'dashboard.rhrSeries': 'RHR series',
        'dashboard.atlCtlSeries': 'ATL / CTL series',
        'dashboard.comments': 'Comments',
        'suggest.recommended': 'Recommended training',
        'suggest.avoid': 'Avoid training',
        'suggest.intensity': 'Intensity / RPE',
        'suggest.zoneDuration': 'Heart rate zone / duration',
        'trend.fatigue': 'Fatigue trend',
        'trend.ctl': 'CTL trend',
        'trend.window': 'Next 48h window',
        'trend.risk': 'Future fatigue risk',
        'table.info': 'Info',
        'table.noData': 'No data.',
        'table.date': 'Date',
        'table.start': 'Start',
        'table.end': 'End',
        'table.totalHours': 'Total hours',
        'table.hrv': 'HRV',
        'table.rhr': 'RHR',
        'table.atl': 'ATL',
        'table.ctl': 'CTL',
        'table.form': 'Form',
        'table.rawDate': 'Date',
        'table.rawValue': 'Value',
        'table.rawName': 'Name',
        'table.rawDetail': 'Detail',
        'comment.none': 'No comments in the JSON file.',
        'cockpit.title': 'TRAINING STATUS DASHBOARD',
        'cockpit.captureGenerating': 'Generating image…',
        'cockpit.saveLabel': 'Save dashboard as PNG image',
        'cockpit.closeLabel': 'Close training status dashboard',
        'cockpit.recoverySystem': 'Recovery System',
        'cockpit.neuralSystem': 'Neural System',
        'cockpit.trainingLoad': 'Training Load',
        'cockpit.trainingStructure': 'Training Structure',
        'cockpit.strengthReadiness': 'Strength Readiness',
        'cockpit.aerobicReadiness': 'Aerobic Readiness',
        'cockpit.recommendedTraining': 'Recommended Training',
        'cockpit.avoidTraining': 'Avoid Training',
        'cockpit.rpeRange': 'RPE Range',
        'cockpit.heartRateZone': 'Heart Rate Zone',
        'cockpit.duration': 'Duration',
        'cockpit.recoveryScore': 'Recovery Score',
        'metricHelp.close': 'Close help',
        'metricHelp.about': 'About this metric',
        'metricHelp.label': 'Help: {{title}}',
        'metricTitles.hrvBaseline': 'HRV Baseline',
        'metricTitles.hrvRatio': 'HRV Ratio',
        'metricTitles.hrvTrend': 'HRV Trend',
        'metricTitles.hrvVariability': 'HRV Variability',
        'metricTitles.sleep': 'Sleep',
        'metricTitles.rhrDelta': 'RHR Delta',
        'metricTitles.hrvZ': 'HRV Z-score',
        'metricTitles.neuralReadiness': 'Neural Readiness',
        'metricTitles.cnsFatigue': 'CNS Fatigue',
        'metricTitles.atl': 'ATL (Acute Training Load)',
        'metricTitles.ctl': 'CTL (Chronic Training Load)',
        'metricTitles.form': 'Form (TSB-style)',
        'metricTitles.acwr': 'ACWR (Acute:Chronic Workload Ratio)',
        'metricTitles.atlSpike': 'ATL Spike',
        'metricTitles.fatigueMomentum': 'Fatigue Momentum',
        'metricTitles.monotony': 'Monotony',
        'metricTitles.strain': 'Strain',
        'metricTitles.strengthFatigue': 'Strength Fatigue',
        'metricTitles.strengthFrequency': 'Strength Frequency (7d)',
        'metricTitles.trainingDensity': 'Training Density',
        'metricTitles.fatigueRiskScore': 'Fatigue Risk Score',
        'metricTitles.structuralFatigue': 'Structural Fatigue',
        'metricTitles.readinessScore': 'Readiness Score',
        'metricTitles.strengthReadiness': 'Strength Readiness',
        'metricTitles.aerobicReadiness': 'Aerobic Readiness',
        'structure.detail': 'Intensity level {{intensityLevel}}/5 (from base {{readinessLevel}}). {{sessionFocus}}',
        'structure.noRecommendation': 'No training recommendation available.',
        'structure.type.recovery': 'Recovery',
        'structure.type.aerobicPriority': 'Aerobic Priority',
        'structure.type.mixed': 'Mixed (Strength + Aerobic)',
        'structure.type.aerobicBase': 'Aerobic Base',
        'structure.focus.recovery': 'Z1 / Mobility / Rest',
        'structure.focus.aerobicBase': 'Z2 steady 45–75min',
        'structure.focus.aerobicPriority': 'Z2 + Z3 intervals (avoid heavy strength)',
        'structure.focus.mixed': 'Strength (upper/full, non-max) + Z2 20min',
        'guidance.easy': 'Easy recovery session',
        'guidance.avoid.easy': 'VO2max / heavy strength',
        'guidance.steady': 'Steady aerobic + light technique',
        'guidance.avoid.steady': 'Maximal intervals',
        'guidance.quality': 'Quality training session',
        'guidance.avoid.quality': 'None specific, monitor fatigue',
        'guidance.rpe': 'RPE {{rpe}}',
        'guidance.zoneDuration': '{{zone}} | {{duration}}',
        'trend.accumulating': 'Accumulating',
        'trend.releasing': 'Releasing',
        'trend.rising': 'Rising',
        'trend.dropping': 'Dropping',
        'trend.recoveryFirst': 'Recovery-first window',
        'trend.qualityOpen': 'Quality session window open',
        'trend.controlledVolume': 'Controlled volume window',
        'trend.highRisk': 'High risk if intensity increases',
        'trend.managed': 'Manageable with careful load progression',
        'trend.lowRisk': 'Low near-term fatigue risk',
        'statuses.veryLow': 'Very Low',
        'statuses.low': 'Low',
        'statuses.moderate': 'Moderate',
        'statuses.good': 'Good',
        'statuses.excellent': 'Excellent',
        'statuses.nA': 'N/A',
        'statuses.superRecovered': 'Super Recovered',
        'statuses.fresh': 'Fresh',
        'statuses.neutral': 'Neutral',
        'statuses.fatigue': 'Fatigue',
        'statuses.highFatigue': 'High Fatigue',
        'statuses.underTraining': 'Under-training',
        'statuses.optimalZone': 'Optimal Zone',
        'statuses.highLoad': 'High Load',
        'statuses.injuryRisk': 'Injury Risk',
        'statuses.superRecovery': 'Super Recovery',
        'statuses.trainable': 'Trainable',
        'statuses.recoveryStress': 'Recovery Stress',
        'statuses.improving': 'Improving',
        'statuses.declining': 'Declining',
        'statuses.stable': 'Stable',
        'statuses.normalVariation': 'Normal Variation',
        'statuses.autonomicStress': 'Autonomic Stress',
        'statuses.recovered': 'Recovered',
        'statuses.warning': 'Warning',
        'statuses.clear': 'Clear',
        'statuses.ready': 'Ready',
        'statuses.limited': 'Limited',
        'statuses.yes': 'Yes',
        'statuses.no': 'No',
        'statuses.high': 'High',
        'statuses.normal': 'Normal',
        'statuses.accumulating': 'Accumulating',
        'statuses.releasing': 'Releasing',
        'statuses.rising': 'Rising',
        'statuses.dropping': 'Dropping',
        'statuses.recovery': 'Recovery',
        'statuses.aerobicPriority': 'Aerobic Priority',
        'statuses.mixed': 'Mixed',
        'statuses.aerobicBase': 'Aerobic Base'
    }
};

const PHRASE_MAP = {
    zh: new Map([
        ['Very Low', '很低'],
        ['Low', '低'],
        ['Moderate', '中等'],
        ['Good', '良好'],
        ['Excellent', '优秀'],
        ['N/A', '无数据'],
        ['Super Recovered', '超级恢复'],
        ['Fresh', '状态清爽'],
        ['Neutral', '中性'],
        ['Fatigue', '疲劳'],
        ['High Fatigue', '高疲劳'],
        ['Under-training', '训练不足'],
        ['Optimal Zone', '最佳区间'],
        ['High Load', '高负荷'],
        ['Injury Risk', '受伤风险'],
        ['Super Recovery', '超量恢复'],
        ['Trainable', '可训练'],
        ['Recovery Stress', '恢复压力'],
        ['Improving', '改善中'],
        ['Declining', '下降中'],
        ['Stable', '稳定'],
        ['Normal Variation', '正常波动'],
        ['Autonomic Stress', '自主神经压力'],
        ['Recovered', '已恢复'],
        ['Warning', '警告'],
        ['Clear', '清晰'],
        ['High', '高'],
        ['Normal', '正常'],
        ['Accumulating', '累积中'],
        ['Releasing', '释放中'],
        ['Rising', '上升中'],
        ['Dropping', '下降中'],
        ['Recovery-first window', '以恢复为先'],
        ['Quality session window open', '可进行高质量训练'],
        ['Controlled volume window', '可控训练量窗口'],
        ['High risk if intensity increases', '若提高强度则风险较高'],
        ['Manageable with careful load progression', '谨慎递增负荷可控'],
        ['Low near-term fatigue risk', '短期疲劳风险较低'],
        ['Recovery', '恢复'],
        ['Aerobic Priority', '以有氧为主'],
        ['Mixed (Strength + Aerobic)', '混合（力量 + 有氧）'],
        ['Aerobic Base', '有氧基础'],
        ['Z1 / Mobility / Rest', 'Z1 / 灵活性 / 休息'],
        ['Z2 steady 45–75min', 'Z2 稳态 45–75 分钟'],
        ['Z2 + Z3 intervals (avoid heavy strength)', 'Z2 + Z3 间歇（避免重力量）'],
        ['Strength (upper/full, non-max) + Z2 20min', '力量（上肢 / 全身，非极限）+ Z2 20 分钟'],
        ['Easy recovery session', '轻松恢复训练'],
        ['VO2max / heavy strength', 'VO2max / 重力量'],
        ['Steady aerobic + light technique', '稳态有氧 + 轻技术'],
        ['Maximal intervals', '高强度间歇'],
        ['Quality training session', '高质量训练'],
        ['None specific, monitor fatigue', '无特别限制，注意疲劳'],
        ['Per-session sleep stages are not available in GitHub mode.', 'GitHub 模式下不提供单次睡眠阶段数据。']
    ]),
    en: new Map()
};

const LOCALIZED_METRIC_HELP = {
    zh: {
        hrvBaseline: {
            title: 'HRV 基线',
            paragraphs: [
                '过去 7 天 HRV 的中位数，代表你近期更“典型”的恢复水平。',
                '应用会用今天的 HRV 与这个基线比较，得出比率和趋势。基线稳定通常意味着恢复节奏稳定；持续漂移可能反映训练、生活或健康变化。',
                '建议把它当作背景信息，而不是目标。绝对值高并不总是更好，和你自己的历史相比是否稳定更重要。'
            ]
        },
        hrvRatio: {
            title: 'HRV 比率',
            paragraphs: [
                '今天的 HRV 除以 7 天中位数基线。接近 1.0 表示今天很正常；高于 1.0 通常说明副交感神经张力更强；低于 1.0 则表示低于你的常态。',
                '仪表盘会基于比率区间标记“超量恢复、正常、可训练、恢复压力”等状态。',
                '如果高强度训练后比率偏低，这很常见；但如果持续偏低并伴随睡眠差或静息心率升高，就该考虑降强度或恢复。'
            ]
        },
        hrvTrend: {
            title: 'HRV 趋势',
            paragraphs: [
                '用基线做归一化后，反映近 3 天 HRV 的变化方向，粗略可理解为今天比 3 天前上升、下降或持平多少。',
                '系统对轻微变化会视为稳定，避免把噪声误判成趋势。',
                '如果趋势上升且睡眠不错，通常支持高质量训练；若趋势大幅下降并伴随高负荷或生病迹象，建议收一收。'
            ]
        },
        hrvVariability: {
            title: 'HRV 波动性',
            paragraphs: [
                '最近 7 天 HRV 的标准差，表示日与日之间的波动幅度，不是平均水平。',
                '波动较小说明状态更稳定；波动较大可能代表压力来源混杂、训练强弱交替，或者测量不一致。',
                '当它与其他指标一起显示很高时，可能提示自主神经压力上升。'
            ]
        },
        sleep: {
            title: '睡眠',
            paragraphs: [
                '来自数据中的最近一次总睡眠时长（小时）。睡眠会显著影响 HRV、主观疲劳和训练质量。',
                '优秀、良好、较差等状态基于简单的小时阈值。',
                '优先保证时长和规律性；如果睡得少，即使动力很足，恢复指标也往往会更差。'
            ]
        },
        rhrDelta: {
            title: 'RHR 变化',
            paragraphs: [
                '今天的静息心率减去最近 7 次 RHR 的平均值。正值说明今天比近期平均更高；负值则更低。',
                'RHR 升高可能伴随生病、脱水、睡眠不足或累积疲劳。偏低则通常更像恢复良好，但也要结合身体感受看。',
                '仪表盘会把这个变化用于神经 / 中枢神经类判断，较大的正值会被视作压力信号。'
            ]
        },
        hrvZ: {
            title: 'HRV Z 分数',
            paragraphs: [
                '今天 HRV 距离最近 7 天均值有多少个标准差：(今天 − 均值) / 标准差。它回答的是“今天有多不寻常”。',
                '接近 0 表示常态；明显为正表示今天特别高；明显为负表示今天特别低。',
                '这个指标会参与神经恢复和中枢神经疲劳提示。'
            ]
        },
        neuralReadiness: {
            title: '神经准备度',
            paragraphs: [
                '布尔型总结：当 HRV 比率高于 0.9 且 RHR 变化没有明显升高（≤ 2 bpm）时，标记为“神经准备”；否则若输入足够则为“神经受限”，若缺少数据则显示 N/A。',
                '它近似反映你是否适合做需要神经驱动的训练，例如协调、重力量或高专注间歇。',
                '如果显示受限，即使肌肉酸痛不明显，也更适合技术、轻有氧或休息。'
            ]
        },
        cnsFatigue: {
            title: '中枢神经疲劳',
            paragraphs: [
                '当以下三个条件里至少有两个成立时会触发警告：HRV 比率低于 0.90、HRV Z 分数低于 -1，或 RHR 变化高于 +3 bpm。',
                '思路是：多个独立压力信号同时出现，比单一坏日子更值得重视。',
                '显示“是”时，系统会更偏向恢复并降低强度建议。它只是训练提醒，不是医学诊断。'
            ]
        },
        atl: {
            title: 'ATL（急性训练负荷）',
            paragraphs: [
                '来自负荷模型的短期训练压力 / 疲劳，通常强调最近一周左右的训练刺激。',
                '训练强度或频率上来时 ATL 很快上升，休息时下降。它回答的是“刚刚给系统加了多少负担？”',
                '把 ATL 和 CTL、Form 放在一起看，能更容易判断你是新鲜、平衡，还是已经累积疲劳。'
            ]
        },
        ctl: {
            title: 'CTL（慢性训练负荷）',
            paragraphs: [
                '来自负荷模型的长期训练压力 / 适应，反映过去一个月甚至更长时间积累的负荷。',
                'CTL 变化慢，代表你建立了多少训练底子。',
                'CTL 持续上升且 ATL 可控，通常意味着在提升体能；CTL 下降往往意味着去训练化或有意 taper。'
            ]
        },
        form: {
            title: 'Form（TSB 风格）',
            paragraphs: [
                '这里定义为 CTL 减 ATL：正值通常意味着更新鲜，负值意味着急性疲劳盖过了慢性适应。',
                '应用里的 Super Recovered、Fresh、Neutral、Fatigue、High Fatigue 等标签都来自这个区间逻辑。',
                '如果长期大幅为负，可能说明过度训练；如果在关键比赛前有计划地保持偏正，则可能很有用。'
            ]
        },
        acwr: {
            title: 'ACWR（急慢性负荷比）',
            paragraphs: [
                '急性负荷与慢性负荷的比值，这里等于最新 ATL 除以最新 CTL。它总结的是：最近几天的负荷和长期背景相比是高还是低。',
                '接近 1.0 表示最近负荷和背景相匹配；远高于 1.0 可能是突增；远低于 1.0 可能是减量或 taper。',
                '研究常把大幅突增和更高受伤风险联系在一起，因此系统会把它分为最佳、高负荷、训练不足、受伤风险等区间。'
            ]
        },
        atlSpike: {
            title: 'ATL 突增',
            paragraphs: [
                'ATL 的日环比变化：今天与昨天相比上升或下降了多少。',
                '大幅上升意味着疲劳正在快速累积，常见于周末大训练、比赛，或停练后突然恢复。',
                '疲劳风险评分会把这个指标作为因素之一，但最好结合睡眠和 HRV 一起看。'
            ]
        },
        fatigueMomentum: {
            title: '疲劳动量',
            paragraphs: [
                'ATL 与 3 天前相比的变化百分比，用来观察短期疲劳是在上升、下降还是持平。',
                '动量上升且恢复指标差，说明负荷还在加码；动量下降则可能是减量或疲劳自然回落。',
                '这里的趋势标签与 HRV 趋势共用逻辑，只是应用在训练负荷轨迹上。'
            ]
        },
        monotony: {
            title: '单调性',
            paragraphs: [
                '来自最近 7 天 ATL 的均值除以标准差。每天都很像时，标准差会很小，单调性就会很高；如果变化更大，单调性会下降。',
                '单调性高通常意味着训练刺激模式重复，和更高的负荷压力有关。',
                '系统会把它用于应激、结构性疲劳和疲劳风险评分。'
            ]
        },
        strain: {
            title: '应激指数',
            paragraphs: [
                '一个综合指标：用周均负荷 × 7 × 单调性 来近似 Banister 风格的 strain 概念。',
                '它既会随着总负荷上升而上升，也会因为每天都很均匀而上升。',
                '可以用它看看这一周是“平铺直叙地硬”，还是更有波动、更容易恢复。'
            ]
        },
        strengthFatigue: {
            title: '力量疲劳',
            paragraphs: [
                '如果过去 48 小时里有像力量训练的课程（原始数据里包含 strength、squat、bench、力量等关键词），则显示“是”。',
                '它只是近期神经肌肉力量负荷的简易代理，不等于真正的肌肉损伤。',
                '当检测到近期力量训练时，系统会稍微压低结构和力量准备度，避免把有氧与力量的疲劳重复计算成“新鲜”。'
            ]
        },
        strengthFrequency: {
            title: '力量频率（7 天）',
            paragraphs: [
                '最近 7 天里像力量训练的次数统计，使用与“力量疲劳”相同的关键词规则。',
                '它有助于区分偶尔举铁和高频力量叠加，后者通常更需要恢复。',
                '准备度模型会把适中的频率视为理想状态，过少或过多都会产生扣分。'
            ]
        },
        trainingDensity: {
            title: '训练密度',
            paragraphs: [
                '最近 7 天平均每天的训练次数（7 天总训练次数 ÷ 7）。如果平均每天超过 1 次，就说明某些天会有双练。',
                '即使单次感觉不大，密度升高也会推高机械和代谢压力。',
                '系统会把它和单调性一起用于结构性疲劳和疲劳风险评估；高密度叠加高单调性会被特别关注。'
            ]
        },
        fatigueRiskScore: {
            title: '疲劳风险分数',
            paragraphs: [
                '一个离散风险等级（低、中、高），由 ACWR、单调性、ATL 突增和训练密度跨阈值后累积分数得到。',
                '每个因素贡献 0–2 分，总分再映射成三档，这样你看到的是简洁的风险提示，而不是连续概率。',
                '当 HRV、睡眠等其他区域也在提示压力时，这个分数更适合用来决定是加量、持平还是回撤。'
            ]
        },
        structuralFatigue: {
            title: '结构性疲劳',
            paragraphs: [
                '当单调性高于 2 且训练密度高于 1.2 时，会被标记为“高”，表示重复负荷 + 高频训练同时存在。',
                '也就是说，即使急性指标看起来还可以，训练结构本身也可能制造疲劳。',
                '显示“正常”只表示这种结构性模式没有被特别标记，并不代表整体一定很新鲜。'
            ]
        },
        readinessScore: {
            title: '准备度分数',
            paragraphs: [
                '一个 0–100 的综合分数，由恢复系统（约 30%）、神经系统（约 20%）、训练负荷（约 25%）、训练结构（约 15%）和疲劳风险（约 10%）混合后得到。',
                '它是在回答“今天模型认为你有多适合高质量训练”。',
                '它只是训练辅助，不是医疗建议；最好结合主观状态和外部压力一起看。'
            ]
        },
        strengthReadiness: {
            title: '力量准备度',
            paragraphs: [
                '一个 0–100 的派生分数：主要基于总体准备度，并会根据近期力量训练做轻微调整。',
                '它更像是对重力量承受能力的近似，而不是杠铃速度或健身房里的 RPE。',
                '做最大努力或高容量力量训练时，可以和力量疲劳、中枢神经疲劳一起看。'
            ]
        },
        aerobicReadiness: {
            title: '有氧准备度',
            paragraphs: [
                '一个 0–100 分数，把总体准备度和 HRV 比率做了额外修正：HRV 更好时会上调，压抑时会下调。',
                '它更偏向持续有氧所需要的系统，尤其是自主神经恢复和整体负荷状态。',
                '有氧准备度低不一定代表完全不能动，只是提示长时间或高强度有氧要更谨慎。'
            ]
        }
    },
    en: {}
};

const EN_HELP_TITLE_BY_KEY = {
    hrvBaseline: 'HRV Baseline',
    hrvRatio: 'HRV Ratio',
    hrvTrend: 'HRV Trend',
    hrvVariability: 'HRV Variability',
    sleep: 'Sleep',
    rhrDelta: 'RHR Delta',
    hrvZ: 'HRV Z-score',
    neuralReadiness: 'Neural Readiness',
    cnsFatigue: 'CNS Fatigue',
    atl: 'ATL (Acute Training Load)',
    ctl: 'CTL (Chronic Training Load)',
    form: 'Form (TSB-style)',
    acwr: 'ACWR (Acute:Chronic Workload Ratio)',
    atlSpike: 'ATL Spike',
    fatigueMomentum: 'Fatigue Momentum',
    monotony: 'Monotony',
    strain: 'Strain',
    strengthFatigue: 'Strength Fatigue',
    strengthFrequency: 'Strength Frequency (7d)',
    trainingDensity: 'Training Density',
    fatigueRiskScore: 'Fatigue Risk Score',
    structuralFatigue: 'Structural Fatigue',
    readinessScore: 'Readiness Score',
    strengthReadiness: 'Strength Readiness',
    aerobicReadiness: 'Aerobic Readiness'
};

function normalizeLocale(locale) {
    return locale === 'en' ? 'en' : DEFAULT_LOCALE;
}

function interpolate(template, params = {}) {
    return String(template).replace(/\{\{(\w+)\}\}/g, (_, key) => {
        const value = params[key];
        return value === undefined || value === null ? '' : String(value);
    });
}

function readStoredLocale() {
    try {
        return normalizeLocale(localStorage.getItem(LOCALE_STORAGE_KEY));
    } catch {
        return DEFAULT_LOCALE;
    }
}

export function getLocale() {
    return readStoredLocale();
}

export function setLocale(locale) {
    const next = normalizeLocale(locale);
    try {
        localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
        /* ignore quota/private mode */
    }
    applyDocumentLocale(next);
    return next;
}

export function toggleLocale(locale = getLocale()) {
    return locale === 'en' ? 'zh' : 'en';
}

export function applyDocumentLocale(locale = getLocale()) {
    const next = normalizeLocale(locale);
    document.documentElement.lang = next;
    document.documentElement.dataset.locale = next;
    document.documentElement.dir = 'ltr';
    document.title = t('app.title', {}, next);
}

function lookup(map, key) {
    if (!map) return undefined;
    if (Object.prototype.hasOwnProperty.call(map, key)) {
        return map[key];
    }
    return key.split('.').reduce((acc, part) => (acc && Object.prototype.hasOwnProperty.call(acc, part) ? acc[part] : undefined), map);
}

export function t(key, params = {}, locale = getLocale()) {
    const next = normalizeLocale(locale);
    const value = lookup(STRINGS[next], key) ?? lookup(STRINGS.en, key) ?? key;
    return interpolate(value, params);
}

export function applyStaticTranslations(root = document) {
    const locale = getLocale();
    applyDocumentLocale(locale);

    root.querySelectorAll('[data-i18n]').forEach((node) => {
        const key = node.getAttribute('data-i18n');
        if (key) {
            node.textContent = t(key, {}, locale);
        }
    });

    root.querySelectorAll('[data-i18n-attr]').forEach((node) => {
        const mapping = node.getAttribute('data-i18n-attr');
        if (!mapping) return;
        mapping.split('|').forEach((pair) => {
            const [attr, key] = pair.split(':').map((s) => s.trim());
            if (attr && key) {
                node.setAttribute(attr, t(key, {}, locale));
            }
        });
    });
}

export function getMetricTitle(key, locale = getLocale()) {
    return t(`metricTitles.${key}`, {}, locale);
}

export function localizeStatus(status, locale = getLocale()) {
    if (!status) return status;
    const label = translatePhrase(status.label, locale);
    return { ...status, label };
}

export function translatePhrase(value, locale = getLocale()) {
    const next = normalizeLocale(locale);
    if (next === 'en') return value;
    return PHRASE_MAP.zh.get(value) || value;
}

export function translateMetricValue(key, value, locale = getLocale()) {
    if (value === null || value === undefined) return value;
    const next = normalizeLocale(locale);
    if (next === 'en') return value;
    const map = {
        recommended: t('guidance.easy', {}, locale),
        avoid: t('guidance.avoid.easy', {}, locale),
        steadyRecommended: t('guidance.steady', {}, locale),
        steadyAvoid: t('guidance.avoid.steady', {}, locale),
        qualityRecommended: t('guidance.quality', {}, locale),
        qualityAvoid: t('guidance.avoid.quality', {}, locale)
    };
    return map[key] || value;
}

export function translateGuidanceText(text, locale = getLocale()) {
    return translatePhrase(text, locale);
}

export function translateStructureType(type, locale = getLocale()) {
    const next = normalizeLocale(locale);
    if (next === 'en') return type;
    return PHRASE_MAP.zh.get(type) || type;
}

export function translateSessionFocus(text, locale = getLocale()) {
    return translatePhrase(text, locale);
}

export function translateTrendText(text, locale = getLocale()) {
    return translatePhrase(text, locale);
}

export function translateReadinessBand(label, locale = getLocale()) {
    return translatePhrase(label, locale);
}

export function translateTableHeader(key, locale = getLocale()) {
    const next = normalizeLocale(locale);
    if (next === 'en') {
        const enMap = {
            info: 'Info',
            parsed_date: 'Date',
            parsed_start: 'Start',
            parsed_end: 'End',
            total_hours: 'Total hours',
            date: 'Date',
            hrv: 'HRV',
            rhr: 'RHR',
            atl: 'ATL',
            ctl: 'CTL',
            form: 'Form'
        };
        return enMap[key] || key.replace(/_/g, ' ');
    }
    const zhMap = {
        info: '信息',
        parsed_date: '日期',
        parsed_start: '开始',
        parsed_end: '结束',
        total_hours: '总时长（小时）',
        date: '日期',
        hrv: 'HRV',
        rhr: 'RHR',
        atl: 'ATL',
        ctl: 'CTL',
        form: 'Form'
    };
    return zhMap[key] || key.replace(/_/g, ' ');
}

export function getMetricHelp(locale = getLocale(), key) {
    const next = normalizeLocale(locale);
    if (next === 'zh') {
        return LOCALIZED_METRIC_HELP.zh?.[key] || { title: key, paragraphs: [] };
    }
    const englishTitle = EN_HELP_TITLE_BY_KEY[key];
    return (englishTitle && EN_METRIC_HELP[englishTitle]) || LOCALIZED_METRIC_HELP.en?.[key] || { title: key, paragraphs: [] };
}

export function getTrainingStructureName(trainingType, locale = getLocale()) {
    return translatePhrase(trainingType, locale);
}

export function getTrainingStructureDetail(trainingType, intensityLevel, readinessLevel, sessionFocus, locale = getLocale()) {
    return t('structure.detail', {
        intensityLevel,
        readinessLevel,
        sessionFocus: translateSessionFocus(sessionFocus, locale)
    }, locale);
}

export function getGuidanceLabel(kind, locale = getLocale()) {
    const next = normalizeLocale(locale);
    if (next === 'en') {
        return {
            recommended: t('guidance.easy', {}, locale),
            avoid: t('guidance.avoid.easy', {}, locale),
            steadyRecommended: t('guidance.steady', {}, locale),
            steadyAvoid: t('guidance.avoid.steady', {}, locale),
            qualityRecommended: t('guidance.quality', {}, locale),
            qualityAvoid: t('guidance.avoid.quality', {}, locale)
        }[kind] || kind;
    }
    return {
        recommended: t('guidance.easy', {}, locale),
        avoid: t('guidance.avoid.easy', {}, locale),
        steadyRecommended: t('guidance.steady', {}, locale),
        steadyAvoid: t('guidance.avoid.steady', {}, locale),
        qualityRecommended: t('guidance.quality', {}, locale),
        qualityAvoid: t('guidance.avoid.quality', {}, locale)
    }[kind] || kind;
}

export { LOCALE_STORAGE_KEY, DEFAULT_LOCALE };
