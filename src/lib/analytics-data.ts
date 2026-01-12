import {
	supabase,
	Session,
	formatRelativeDate,
	getPostureStatus,
	PostureStatus,
} from './supabase';

// Helper to calculate average from array
function calcAverage(
	arr: number[] | null | undefined
): number | null {
	if (!arr || arr.length === 0) return null;
	return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export type TimeRange = 3 | 7 | 15;

export interface PostureTrendPoint {
	date: string;
	postureScore: number;
}

export interface HourlyPosturePoint {
	hour: string; // "9AM", "10AM"
	score: number;
	intensity: 'High' | 'Medium' | 'Low';
}

export interface FatiguePoint {
	minuteBin: number; // 0, 10, 20, 30... % of session
	score: number;
}

export interface Alert {
	id: string;
	type: 'warning' | 'success' | 'info';
	title: string;
	message: string;
	time: string;
}

export interface AnalyticsData {
	postureTrend: PostureTrendPoint[];
	hourlyPosture: HourlyPosturePoint[];
	fatigueAnalysis: FatiguePoint[];
	alerts: Alert[];
	stats: {
		avgSessionDuration: number;
		totalSessions: number;
		avgPosture: number;
	};
}

export async function getAnalyticsData(
	userId: string,
	days: TimeRange
): Promise<AnalyticsData> {
	// Use day start for broader inclusion
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);
	startDate.setHours(0, 0, 0, 0); // Start of that day

	const [sessionsResult, userStatsResult] = await Promise.all([
		supabase
			.from('sessions')
			.select('*')
			.eq('user_id', userId)
			.gte('start_time', startDate.toISOString())
			.order('start_time', { ascending: true }),
		supabase
			.from('user_stats')
			.select('current_streak')
			.eq('user_id', userId)
			.single(),
	]);

	const { data: sessionsData, error } = sessionsResult;
	const currentStreak = userStatsResult.data?.current_streak || 0;

	if (error) {
		console.error('Error fetching analytics data', error);
		return {
			postureTrend: [],
			hourlyPosture: [],
			fatigueAnalysis: [],
			alerts: [],
			stats: {
				avgSessionDuration: 0,
				totalSessions: 0,
				avgPosture: 0,
			},
		};
	}

	let sessions = sessionsData as Session[];

	// Fallback: If no sessions in range, get last 20 sessions to show *something*
	if (sessions.length === 0) {
		console.log(
			'No sessions in range, fetching last 20 sessions as fallback'
		);
		const { data: fallbackSessions } = await supabase
			.from('sessions')
			.select('*')
			.eq('user_id', userId)
			.order('start_time', { ascending: false }) // Newest first
			.limit(20);

		if (fallbackSessions && fallbackSessions.length > 0) {
			sessions = fallbackSessions.reverse() as Session[]; // Reverse to chronological order
		}
	}

	console.log(`Analytics processing ${sessions.length} sessions`);

	// 1. Posture Trend (Daily Average)
	const trendMap = new Map<
		string,
		{ sum: number; count: number }
	>();
	// Initialize last N days with 0
	for (let i = 0; i < days; i++) {
		const d = new Date();
		d.setDate(d.getDate() - (days - 1 - i));
		const dateStr = d.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
		});
		trendMap.set(dateStr, { sum: 0, count: 0 });
	}

	sessions.forEach((session) => {
		const dateStr = new Date(
			session.start_time
		).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
		});
		const avg = calcAverage(session.posture);
		if (avg !== null && trendMap.has(dateStr)) {
			const entry = trendMap.get(dateStr)!;
			entry.sum += avg * 100;
			entry.count += 1;
		}
	});

	const postureTrend: PostureTrendPoint[] = Array.from(
		trendMap.entries()
	).map(([date, { sum, count }]) => ({
		date,
		postureScore: count > 0 ? Math.round(sum / count) : 0,
	}));

	// 2. Hourly Posture Patterns
	const hourMap = new Map<number, { sum: number; count: number }>();
	for (let i = 6; i <= 22; i++)
		hourMap.set(i, { sum: 0, count: 0 }); // 6am to 10pm

	sessions.forEach((session) => {
		const hour = new Date(session.start_time).getHours();
		const avg = calcAverage(session.posture);
		if (avg !== null && hourMap.has(hour)) {
			const entry = hourMap.get(hour)!;
			entry.sum += avg * 100;
			entry.count += 1;
		}
	});

	const hourlyPosture: HourlyPosturePoint[] = Array.from(
		hourMap.entries()
	).map(([hour, { sum, count }]) => {
		const score = count > 0 ? Math.round(sum / count) : 0;
		const displayHour =
			hour === 12
				? '12PM'
				: hour > 12
					? `${hour - 12}PM`
					: `${hour}AM`;
		return {
			hour: displayHour,
			score,
			intensity:
				score > 80 ? 'High' : score > 50 ? 'Medium' : 'Low',
		};
	});

	// 3. Fatigue Analysis (Normalized Session Progression)
	// Divide each session into 10 buckets (0-10%, 10-20%... of duration) and average posture in those buckets
	const fatigueBuckets = Array(10).fill({ sum: 0, count: 0 });

	sessions.forEach((session) => {
		if (!session.posture || session.posture.length < 5) return; // Skip very short sessions

		const arr = session.posture;
		const chunkSize = arr.length / 10;

		for (let i = 0; i < 10; i++) {
			const startIdx = Math.floor(i * chunkSize);
			const endIdx = Math.floor((i + 1) * chunkSize);
			const chunk = arr.slice(startIdx, endIdx);

			if (chunk.length > 0) {
				const chunkAvg =
					chunk.reduce((a, b) => a + b, 0) / chunk.length;
				fatigueBuckets[i] = {
					sum: fatigueBuckets[i].sum + chunkAvg * 100,
					count: fatigueBuckets[i].count + 1,
				};
			}
		}
	});

	const fatigueAnalysis: FatiguePoint[] = fatigueBuckets.map(
		(bucket, i) => ({
			minuteBin: (i + 1) * 10, // 10%, 20%...
			score:
				bucket.count > 0
					? Math.round(bucket.sum / bucket.count)
					: 0,
		})
	);

	// 4. Alerts (Real analysis based on recent data)
	const alerts: Alert[] = [];
	const sortedSessions = [...sessions].sort(
		(a, b) =>
			new Date(b.start_time).getTime() -
			new Date(a.start_time).getTime()
	);
	const last3Sessions = sortedSessions.slice(0, 3);

	// Alert 1: Recent form check
	if (last3Sessions.length > 0) {
		const recentAvg = calcAverage(last3Sessions[0].posture);
		if (recentAvg !== null) {
			if (recentAvg < 0.6) {
				alerts.push({
					id: 'sub-poor',
					type: 'warning',
					title: 'Attention Needed',
					message:
						'Your posture score in the last session was low (' +
						Math.round(recentAvg * 100) +
						'%). Try recalibrating.',
					time: formatRelativeDate(
						last3Sessions[0].start_time
					),
				});
			} else if (recentAvg > 0.85) {
				alerts.push({
					id: 'sub-great',
					type: 'success',
					title: 'Great Form',
					message:
						'Maintaining excellent posture in your recent session. Keep it up!',
					time: formatRelativeDate(
						last3Sessions[0].start_time
					),
				});
			}
		}
	}

	// Alert 2: Fatigue / Duration Warning
	const longSessions = sessions.filter(
		(s) => (s.focus_duration_mins || 0) > 60
	);
	if (longSessions.length > 0) {
		alerts.push({
			id: 'high-duration',
			type: 'info',
			title: 'Long Sessions Detected',
			message: `You have ${longSessions.length} sessions over 60 mins. Remember to take breaks.`,
			time: 'This week',
		});
	}

	// Alert 3: Trend Analysis (if enough data)
	if (postureTrend.length >= 3) {
		const last3Days = postureTrend.slice(-3);
		const trendingDown =
			last3Days[0].postureScore > last3Days[1].postureScore &&
			last3Days[1].postureScore > last3Days[2].postureScore;

		if (trendingDown) {
			alerts.push({
				id: 'trend-down',
				type: 'warning',
				title: 'Downward Trend',
				message:
					'Your average posture score has decreased over the last 3 active days.',
				time: 'Recent Trend',
			});
		}
	}

	// Alert 4: Consistency
	if (
		currentStreak > 3 &&
		!alerts.find((a) => a.type === 'success')
	) {
		alerts.push({
			id: 'streak',
			type: 'success',
			title: 'Consistent Focus',
			message: `You're on a ${currentStreak} day streak! Consistency is key to improvement.`,
			time: 'Current Streak',
		});
	}

	// 5. Global Stats
	const totalDuration = sessions.reduce(
		(acc, s) => acc + (s.focus_duration_mins || 0),
		0
	);
	const validPostures = sessions
		.map((s) => calcAverage(s.posture))
		.filter((s): s is number => s !== null);

	const totalAvgPosture =
		validPostures.length > 0
			? Math.round(
					(validPostures.reduce((a, b) => a + b, 0) /
						validPostures.length) *
						100
				)
			: 0;

	return {
		postureTrend,
		hourlyPosture,
		fatigueAnalysis,
		alerts: alerts.slice(0, 4), // Limit to top 4 alerts
		stats: {
			avgSessionDuration:
				sessions.length > 0
					? Math.round(totalDuration / sessions.length)
					: 0,
			totalSessions: sessions.length,
			avgPosture: totalAvgPosture,
		},
	};
}
