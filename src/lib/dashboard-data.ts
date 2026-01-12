import {
	supabase,
	Session,
	UserStats,
	formatDuration,
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

export interface DashboardStats {
	streak: number;
	sessionHours: number;
	rank: number;
	streakTrend?: number;
	rankTrend?: number;
}

export interface WeeklyDataPoint {
	day: string;
	durationMins: number;
	posture: number;
}

export interface HeatmapSlot {
	label: string;
	days: number[];
}

export interface TableSession {
	id: string;
	date: string;
	duration: string;
	posture: PostureStatus;
	postureScore: number;
}

// Fetch user stats
export async function getUserStats(
	userId: string
): Promise<DashboardStats> {
	const { data, error } = await supabase
		.from('user_stats')
		.select('*')
		.eq('user_id', userId)
		.single();

	if (error || !data) {
		return {
			streak: 0,
			sessionHours: 0,
			rank: 9999,
		};
	}

	const stats = data as UserStats;
	return {
		streak: stats.current_streak,
		sessionHours: stats.total_focus_hours, // Map DB column to frontend property
		rank: stats.global_rank,
	};
}

// Fetch weekly performance data (last 7 days)
export async function getWeeklyData(
	userId: string
): Promise<WeeklyDataPoint[]> {
	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const result: WeeklyDataPoint[] = [];

	for (let i = 6; i >= 0; i--) {
		const date = new Date();
		date.setDate(date.getDate() - i);
		const dayStart = new Date(
			date.setHours(0, 0, 0, 0)
		).toISOString();
		const dayEnd = new Date(
			date.setHours(23, 59, 59, 999)
		).toISOString();

		const { data } = await supabase
			.from('sessions')
			.select('posture, focus_duration_mins') // Use actual DB column
			.eq('user_id', userId)
			.gte('start_time', dayStart)
			.lte('start_time', dayEnd);

		let totalDuration = 0;
		let avgPosture = 0;

		if (data && data.length > 0) {
			totalDuration = data.reduce(
				(sum, s) => sum + (s.focus_duration_mins || 0),
				0
			);

			// Flatten all posture arrays from all sessions this day to get a true daily average
			// This weighs the average by the number of samples (time), which is more accurate
			const allDailyScores = data
				.flatMap((s) => s.posture || [])
				.filter((s): s is number => typeof s === 'number');

			if (allDailyScores.length > 0) {
				const sum = allDailyScores.reduce((a, b) => a + b, 0);
				avgPosture = Math.round(
					(sum / allDailyScores.length) * 100
				);
			}
		}

		result.push({
			day: days[new Date(dayStart).getDay()],
			durationMins: totalDuration,
			posture: avgPosture,
		});
	}

	return result;
}

// Fetch heatmap data (session intensity by time of day, last 7 days)
// Fetch heatmap data (session intensity by time of day, last 7 days)
export async function getHeatmapData(
	userId: string
): Promise<{ data: HeatmapSlot[]; mostProductiveTime: string }> {
	const timeSlots = [
		{ label: '06 - 09', start: 6, end: 9 },
		{ label: '09 - 12', start: 9, end: 12 },
		{ label: '12 - 15', start: 12, end: 15 },
		{ label: '15 - 18', start: 15, end: 18 },
		{ label: '18 - 21', start: 18, end: 21 },
		{ label: '21 - 24', start: 21, end: 24 },
	];

	const weekAgo = new Date();
	weekAgo.setDate(weekAgo.getDate() - 7);

	const { data: sessions } = await supabase
		.from('sessions')
		.select('start_time, focus_duration_mins') // Use actual DB column
		.eq('user_id', userId)
		.gte('start_time', weekAgo.toISOString());

	const intensityGrid: number[][] = timeSlots.map(() => [
		0, 0, 0, 0, 0, 0, 0,
	]);
	let maxIntensityTime = 'No Data'; // Default if no data

	if (sessions && sessions.length > 0) {
		const minutesGrid: number[][] = timeSlots.map(() => [
			0, 0, 0, 0, 0, 0, 0,
		]);

		// 1. Fill grid with duration minutes
		for (const session of sessions) {
			const date = new Date(session.start_time);
			const hour = date.getHours();
			const dayIndex = date.getDay(); // 0 = Sun, 6 = Sat

			const slotIndex = timeSlots.findIndex(
				(slot) => hour >= slot.start && hour < slot.end
			);
			if (slotIndex !== -1) {
				minutesGrid[slotIndex][dayIndex] +=
					session.focus_duration_mins || 0;
			}
		}

		// 2. Normalize for visualization (0-4 scale)
		const maxMinutes = Math.max(...minutesGrid.flat(), 1);
		for (let i = 0; i < timeSlots.length; i++) {
			for (let j = 0; j < 7; j++) {
				const ratio = minutesGrid[i][j] / maxMinutes;
				intensityGrid[i][j] = Math.round(ratio * 4);
			}
		}

		// 3. Find most productive time slot (aggregate across days)
		const slotTotals = minutesGrid.map((row) =>
			row.reduce((a, b) => a + b, 0)
		);
		const maxTotal = Math.max(...slotTotals);
		const bestSlotIndex = slotTotals.indexOf(maxTotal);

		if (maxTotal > 0 && bestSlotIndex !== -1) {
			const slot = timeSlots[bestSlotIndex];
			const startAmPm = slot.start >= 12 ? 'PM' : 'AM';
			const endAmPm = slot.end >= 12 ? 'PM' : 'AM';
			const start12 =
				slot.start > 12 ? slot.start - 12 : slot.start;
			const end12 = slot.end > 12 ? slot.end - 12 : slot.end;

			maxIntensityTime = `${start12} ${startAmPm} - ${end12} ${endAmPm}`;
		}
	}

	return {
		data: timeSlots.map((slot, i) => ({
			label: slot.label,
			days: intensityGrid[i],
		})),
		mostProductiveTime: maxIntensityTime,
	};
}

// Fetch recent sessions
export async function getRecentSessions(
	userId: string,
	limit = 5
): Promise<DetailedSession[]> {
	const { data, error } = await supabase
		.from('sessions')
		.select('*')
		.eq('user_id', userId)
		.order('start_time', { ascending: false })
		.limit(limit);

	if (error || !data) {
		return [];
	}

	return (data as Session[]).map((session) => ({
		id: session.id,
		title: session.notes,
		startTime: session.start_time,
		endTime: session.end_time,
		durationMins: session.focus_duration_mins,
		avgPostureScore: calcAverage(session.posture),
		postureArray: session.posture || [],
	}));
}

// Get AI recommendation
export async function getAIRecommendation(
	userId: string
): Promise<string> {
	const { data: sessions } = await supabase
		.from('sessions')
		.select('start_time, posture')
		.eq('user_id', userId)
		.order('start_time', { ascending: false })
		.limit(20);

	if (!sessions || sessions.length === 0) {
		return 'Start your first session to begin building insights about your posture patterns.';
	}

	const validSessions = sessions
		.map((s) => calcAverage(s.posture))
		.filter((s): s is number => s !== null);

	if (validSessions.length === 0) {
		return 'Start your first session to begin building insights about your posture patterns.';
	}

	const recentAvg =
		validSessions.reduce((acc, val) => acc + val, 0) /
		validSessions.length;

	if (recentAvg < 0.6) {
		return 'Your recent posture scores indicate some fatigue. Consider taking more frequent breaks or adjusting your camera setup for accurate tracking.';
	} else if (recentAvg > 0.85) {
		return "Excellent posture maintenance! You're building great habits. Keep consistent.";
	} else {
		return 'Your posture is generally good, but varies. Try to be mindful of slouching towards the end of long sessions.';
	}
}

// ============================================
// Sessions Page Data Functions
// ============================================

export interface DetailedSession {
	id: string;
	title: string | null;
	startTime: string;
	endTime: string | null;
	durationMins: number;
	avgPostureScore: number | null;
	postureArray: number[];
}

export interface SessionsPageData {
	sessions: DetailedSession[];
	totalCount: number;
}

// Format time
export function formatTime(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});
}

// Format date
export function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

// Calculate time range
export function getTimeRange(
	startTime: string,
	endTime: string | null
): string {
	const start = formatTime(startTime);
	if (!endTime) return `${start} - In Progress`;
	const end = formatTime(endTime);
	return `${start} - ${end}`;
}

// Fetch sessions with pagination
export async function getSessionsPageData(
	userId: string,
	options: {
		page?: number;
		limit?: number;
		sortBy?: 'date' | 'duration' | 'posture';
		sortOrder?: 'asc' | 'desc';
	} = {}
): Promise<SessionsPageData> {
	const {
		page = 1,
		limit = 10,
		sortBy = 'date',
		sortOrder = 'desc',
	} = options;

	const offset = (page - 1) * limit;

	let query = supabase
		.from('sessions')
		.select('*', { count: 'exact' })
		.eq('user_id', userId);

	const sortColumn =
		sortBy === 'date'
			? 'start_time'
			: sortBy === 'posture'
				? 'start_time' // Fallback for now as we can't sort by array average easily in DB
				: 'focus_duration_mins'; // Use correct DB column

	query = query.order(sortColumn, {
		ascending: sortOrder === 'asc',
	});

	query = query.range(offset, offset + limit - 1);

	const { data, error, count } = await query;

	if (error || !data) {
		return { sessions: [], totalCount: 0 };
	}

	const sessions: DetailedSession[] = (data as Session[]).map(
		(session) => ({
			id: session.id,
			title: session.notes,
			startTime: session.start_time,
			endTime: session.end_time,
			durationMins: session.focus_duration_mins, // Map DB column
			avgPostureScore: calcAverage(session.posture),
			postureArray: session.posture || [],
		})
	);

	return {
		sessions,
		totalCount: count || 0,
	};
}
