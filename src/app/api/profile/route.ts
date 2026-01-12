import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ProfilePayload {
	firstName: string;
	lastName?: string;
	primaryGoal: 'focus' | 'posture' | 'both';
	dailyTarget: 25 | 50 | 90;
	timezone: string;
}

// GET - Check if profile exists
export async function GET(): Promise<NextResponse> {
	try {
		const { userId } = await auth();

		if (!userId) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const { data: profile, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('user_id', userId)
			.single();

		if (error && error.code !== 'PGRST116') {
			// PGRST116 = no rows returned (expected for new users)
			console.error('Profile fetch error:', error);
			return NextResponse.json(
				{ error: 'Database error' },
				{ status: 500 }
			);
		}

		return NextResponse.json({ profile: profile ?? null });
	} catch (error) {
		console.error('Profile GET error:', error);
		return NextResponse.json(
			{ error: 'Server error' },
			{ status: 500 }
		);
	}
}

// POST - Create or update profile (onboarding)
export async function POST(
	request: NextRequest
): Promise<NextResponse> {
	try {
		const { userId } = await auth();
		const user = await currentUser();

		if (!userId) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const body = (await request.json()) as ProfilePayload;

		// Upsert profile
		const { data: profile, error } = await supabase
			.from('profiles')
			.upsert(
				{
					user_id: userId,
					first_name: body.firstName,
					last_name: body.lastName ?? null,
					primary_goal: body.primaryGoal,
					daily_target: body.dailyTarget,
					timezone: body.timezone,
					onboarded: true,
				},
				{ onConflict: 'user_id' }
			)
			.select()
			.single();

		if (error) {
			console.error('Profile upsert error:', error);
			return NextResponse.json(
				{
					error: 'Failed to save profile',
					details: error.message,
				},
				{ status: 500 }
			);
		}

		// Update Clerk metadata in background (fire and forget)
		// Don't await - let it happen asynchronously
		if (user) {
			fetch(
				`https://api.clerk.dev/v1/users/${userId}/metadata`,
				{
					method: 'PATCH',
					headers: {
						Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						public_metadata: {
							onboarded: true,
							firstName: body.firstName,
						},
					}),
				}
			).catch((clerkError) => {
				console.error(
					'Clerk metadata update failed:',
					clerkError
				);
			});
		}

		return NextResponse.json({ profile });
	} catch (error) {
		console.error('Profile POST error:', error);
		return NextResponse.json(
			{ error: 'Server error' },
			{ status: 500 }
		);
	}
}

// PATCH - Update profile fields
export async function PATCH(
	request: NextRequest
): Promise<NextResponse> {
	try {
		const { userId } = await auth();

		if (!userId) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const body = await request.json();

		const { data: profile, error } = await supabase
			.from('profiles')
			.update(body)
			.eq('user_id', userId)
			.select()
			.single();

		if (error) {
			console.error('Profile update error:', error);
			return NextResponse.json(
				{ error: 'Failed to update profile' },
				{ status: 500 }
			);
		}

		return NextResponse.json({ profile });
	} catch (error) {
		console.error('Profile PATCH error:', error);
		return NextResponse.json(
			{ error: 'Server error' },
			{ status: 500 }
		);
	}
}
