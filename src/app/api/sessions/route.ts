import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface SessionPayload {
	userId: string;
	startTime: string;
	endTime: string;
	notes?: string;
	durationMins: number;
	postureLogs: { timestamp: string; score: number }[];
	pauseEvents: { type: 'pause' | 'resume'; timestamp: string }[];
}

export async function POST(request: NextRequest) {
	try {
		const body: SessionPayload = await request.json();

		if (!body.userId) {
			return NextResponse.json(
				{ error: 'User ID required' },
				{ status: 400 }
			);
		}

		const postureScores = body.postureLogs.map(
			(log) => log.score
		);

		const { data: session, error: sessionError } = await supabase
			.from('sessions')
			.insert({
				user_id: body.userId,
				start_time: body.startTime,
				end_time: body.endTime,
				notes: body.notes || null,
				focus_duration_mins: body.durationMins,
				posture: postureScores,
			})
			.select()
			.single();

		if (sessionError) {
			console.error('Session insert error:', sessionError);
			return NextResponse.json(
				{ error: sessionError.message },
				{ status: 500 }
			);
		}

		if (body.postureLogs.length > 0) {
			const biometricLogs = body.postureLogs.map((log) => ({
				session_id: session.id,
				timestamp: log.timestamp,
				score: log.score,
				type: 'posture',
			}));

			const { error: logsError } = await supabase
				.from('biometric_logs')
				.insert(biometricLogs);

			if (logsError)
				console.error(
					'Biometric logs insert error:',
					logsError
				);
		}

		if (body.pauseEvents.length > 0) {
			const eventLogs = body.pauseEvents.map((event) => ({
				session_id: session.id,
				timestamp: event.timestamp,
				score: event.type === 'pause' ? 0 : 1,
				type: event.type,
			}));

			const { error: eventsError } = await supabase
				.from('biometric_logs')
				.insert(eventLogs);

			if (eventsError)
				console.error(
					'Event logs insert error:',
					eventsError
				);
		}

		const { data: existingStats } = await supabase
			.from('user_stats')
			.select('*')
			.eq('user_id', body.userId)
			.single();

		const today = new Date().toISOString().split('T')[0];
		const lastSessionDate = existingStats?.last_session_date;
		const yesterday = new Date(Date.now() - 86400000)
			.toISOString()
			.split('T')[0];

		let newStreak = 1;
		if (existingStats) {
			if (lastSessionDate === today) {
				newStreak = existingStats.current_streak;
			} else if (lastSessionDate === yesterday) {
				newStreak = existingStats.current_streak + 1;
			} else {
				newStreak = 1;
			}
		}

		const totalHours =
			(existingStats?.total_focus_hours || 0) +
			body.durationMins / 60;
		const longestStreak = Math.max(
			existingStats?.longest_streak || 0,
			newStreak
		);

		await supabase.from('user_stats').upsert(
			{
				user_id: body.userId,
				current_streak: newStreak,
				longest_streak: longestStreak,
				total_focus_hours: totalHours,
				last_session_date: today,
				updated_at: new Date().toISOString(),
			},
			{ onConflict: 'user_id' }
		);

		revalidatePath('/dashboard');
		revalidatePath('/dashboard/sessions');

		return NextResponse.json({
			success: true,
			sessionId: session.id,
			stats: {
				streak: newStreak,
				totalHours,
			},
		});
	} catch (error) {
		console.error('Session API error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();
		const {
			sessionId,
			postureLogs,
			avgPostureScore,
			durationMins,
			isFinalSave,
		} = body;

		if (!sessionId) {
			return NextResponse.json(
				{ error: 'Session ID required' },
				{ status: 400 }
			);
		}

		const { data: currentSession, error: fetchError } =
			await supabase
				.from('sessions')
				.select('posture, focus_duration_mins, user_id')
				.eq('id', sessionId)
				.single();

		if (fetchError || !currentSession) {
			return NextResponse.json(
				{ error: fetchError?.message || 'Session not found' },
				{ status: 404 }
			);
		}

		const oldDuration = currentSession.focus_duration_mins || 0;
		const newDuration = durationMins;
		const durationDelta = Math.max(0, newDuration - oldDuration);

		const newScores = postureLogs
			? postureLogs.map((log: { score: number }) => log.score)
			: [];

		// If this is the final save, replace the entire posture array
		// Otherwise, append to it (for periodic syncs during session)
		const updatedPosture = isFinalSave
			? newScores
			: [...(currentSession.posture || []), ...newScores];

		// Calculate average posture score from the final array if not provided
		const calculatedAvgScore =
			avgPostureScore ??
			(updatedPosture.length > 0
				? updatedPosture.reduce(
						(a: number, b: number) => a + b,
						0
					) / updatedPosture.length
				: null);

		const { error: updateError } = await supabase
			.from('sessions')
			.update({
				posture: updatedPosture,
				avg_posture_score: calculatedAvgScore,
				focus_duration_mins: durationMins,
				end_time: new Date().toISOString(),
			})
			.eq('id', sessionId);

		if (updateError) {
			return NextResponse.json(
				{ error: updateError.message },
				{ status: 500 }
			);
		}

		if (durationDelta > 0 && currentSession.user_id) {
			const { data: existingStats } = await supabase
				.from('user_stats')
				.select('*')
				.eq('user_id', currentSession.user_id)
				.single();

			const currentTotal =
				existingStats?.total_focus_hours || 0;
			const currentStreak = existingStats?.current_streak || 1;
			const longestStreak = existingStats?.longest_streak || 1;
			const lastDate =
				existingStats?.last_session_date ||
				new Date().toISOString().split('T')[0];

			await supabase.from('user_stats').upsert(
				{
					user_id: currentSession.user_id,
					total_focus_hours:
						currentTotal + durationDelta / 60,
					updated_at: new Date().toISOString(),
					current_streak: currentStreak,
					longest_streak: longestStreak,
					last_session_date: lastDate,
				},
				{ onConflict: 'user_id' }
			);
		}

		if (postureLogs && postureLogs.length > 0) {
			const biometricLogs = postureLogs.map(
				(log: { timestamp: string; score: number }) => ({
					session_id: sessionId,
					timestamp: log.timestamp,
					score: log.score,
					type: 'posture',
				})
			);

			const { error: logsError } = await supabase
				.from('biometric_logs')
				.insert(biometricLogs);

			if (logsError)
				console.error(
					'Biometric logs insert error:',
					logsError
				);
		}

		revalidatePath('/dashboard');
		revalidatePath('/dashboard/sessions');

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Session PUT error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
