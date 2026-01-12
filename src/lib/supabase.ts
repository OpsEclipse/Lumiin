import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for database tables
export type PostureStatus = 'good' | 'average' | 'poor';

export interface Session {
	id: string;
	user_id: string;
	start_time: string;
	end_time: string | null;
	notes: string | null;
	posture: number[] | null; // Array of posture scores
	focus_duration_mins: number; // DB column
	created_at: string;
}

export interface BiometricLog {
	id: string;
	session_id: string;
	timestamp: string;
	score: number;
	type: 'posture' | 'pause' | 'resume';
}

export interface UserStats {
	id: string;
	user_id: string;
	current_streak: number;
	longest_streak: number;
	total_focus_hours: number; // DB column
	global_rank: number;
	last_session_date: string | null;
	updated_at: string;
}

// Helper to determine posture status from score
export function getPostureStatus(
	score: number | null
): PostureStatus {
	if (score === null) return 'average';
	if (score >= 0.75) return 'good';
	if (score >= 0.5) return 'average';
	return 'poor';
}

// Format duration from minutes
export function formatDuration(mins: number): string {
	const hours = Math.floor(mins / 60);
	const minutes = mins % 60;
	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	}
	return `${minutes}m`;
}

// Format relative date
export function formatRelativeDate(dateStr: string): string {
	const date = new Date(dateStr);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) {
		return `Today, ${date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		})}`;
	} else if (diffDays === 1) {
		return 'Yesterday';
	} else if (diffDays < 7) {
		return `${diffDays} days ago`;
	} else {
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
		});
	}
}
