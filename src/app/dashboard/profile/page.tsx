'use client';

import { useEffect, useState } from 'react';
import { UserProfile } from '@clerk/nextjs';
import { DashboardHeader } from '@/components/dashboard';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
	User,
	Target,
	Timer,
	CheckCircle,
	PencilSimple,
	X,
} from '@phosphor-icons/react';
import { LumiinLoader } from '@/components/ui/lumiin-loader';

interface Profile {
	first_name: string;
	last_name: string | null;
	primary_goal: 'focus' | 'posture' | 'both';
	daily_target: 25 | 50 | 90;
	timezone: string;
}

export default function ProfilePage(): React.ReactElement {
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState(false);
	const [saving, setSaving] = useState(false);
	const [editData, setEditData] = useState<Partial<Profile>>({});

	useEffect(() => {
		async function fetchProfile(): Promise<void> {
			try {
				const response = await fetch('/api/profile');
				const data = await response.json();
				if (data.profile) {
					setProfile(data.profile);
				}
			} catch (error) {
				console.error('Failed to fetch profile:', error);
			} finally {
				setLoading(false);
			}
		}
		fetchProfile();
	}, []);

	const handleEdit = (): void => {
		if (profile) {
			setEditData({
				first_name: profile.first_name,
				last_name: profile.last_name,
				primary_goal: profile.primary_goal,
				daily_target: profile.daily_target,
			});
			setEditing(true);
		}
	};

	const handleSave = async (): Promise<void> => {
		setSaving(true);
		try {
			const response = await fetch('/api/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(editData),
			});
			const data = await response.json();
			if (data.profile) {
				setProfile(data.profile);
				setEditing(false);
			}
		} catch (error) {
			console.error('Failed to save profile:', error);
		} finally {
			setSaving(false);
		}
	};

	const goalLabels = {
		focus: 'Improve Focus',
		posture: 'Better Posture',
		both: 'Both',
	};

	return (
		<>
			<DashboardHeader title="Profile" />
			<div className="p-8 space-y-8">
				{/* Lumiin Profile */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="text-xl uppercase tracking-widest font-light flex items-center gap-2">
							<User
								size={24}
								className="text-primary"
							/>
							Lumiin Profile
						</CardTitle>
						{!editing && (
							<Button
								variant="ghost"
								onClick={handleEdit}
								size="sm"
							>
								<PencilSimple
									size={16}
									className="mr-2"
								/>
								Edit
							</Button>
						)}
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="flex justify-center p-8">
								<LumiinLoader size="sm" />
							</div>
						) : profile ? (
							editing ? (
								<div className="space-y-6">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="text-sm uppercase tracking-widest text-muted-foreground mb-2 block">
												First Name
											</label>
											<Input
												value={
													editData.first_name ??
													''
												}
												onChange={(e) =>
													setEditData(
														(prev) => ({
															...prev,
															first_name:
																e
																	.target
																	.value,
														})
													)
												}
											/>
										</div>
										<div>
											<label className="text-sm uppercase tracking-widest text-muted-foreground mb-2 block">
												Last Name
											</label>
											<Input
												value={
													editData.last_name ??
													''
												}
												onChange={(e) =>
													setEditData(
														(prev) => ({
															...prev,
															last_name:
																e
																	.target
																	.value,
														})
													)
												}
											/>
										</div>
									</div>

									<div>
										<label className="text-sm uppercase tracking-widest text-muted-foreground mb-2 block">
											<Target
												size={14}
												className="inline mr-1"
											/>
											Primary Goal
										</label>
										<div className="flex gap-2">
											{(
												[
													'focus',
													'posture',
													'both',
												] as const
											).map((goal) => (
												<Button
													key={goal}
													variant={
														editData.primary_goal ===
														goal
															? 'default'
															: 'outline'
													}
													onClick={() =>
														setEditData(
															(
																prev
															) => ({
																...prev,
																primary_goal:
																	goal,
															})
														)
													}
													className="capitalize"
												>
													{goalLabels[goal]}
												</Button>
											))}
										</div>
									</div>

									<div>
										<label className="text-sm uppercase tracking-widest text-muted-foreground mb-2 block">
											<Timer
												size={14}
												className="inline mr-1"
											/>
											Session Length
										</label>
										<div className="flex gap-2">
											{(
												[25, 50, 90] as const
											).map((target) => (
												<Button
													key={target}
													variant={
														editData.daily_target ===
														target
															? 'default'
															: 'outline'
													}
													onClick={() =>
														setEditData(
															(
																prev
															) => ({
																...prev,
																daily_target:
																	target,
															})
														)
													}
												>
													{target} min
												</Button>
											))}
										</div>
									</div>

									<Separator />

									<div className="flex gap-2">
										<Button
											onClick={handleSave}
											disabled={saving}
										>
											<CheckCircle
												size={16}
												className="mr-2"
											/>
											{saving
												? 'Saving...'
												: 'Save Changes'}
										</Button>
										<Button
											variant="ghost"
											onClick={() =>
												setEditing(false)
											}
										>
											<X
												size={16}
												className="mr-2"
											/>
											Cancel
										</Button>
									</div>
								</div>
							) : (
								<div className="space-y-4">
									<div className="grid grid-cols-2 gap-8">
										<div>
											<p className="text-sm uppercase tracking-widest text-muted-foreground mb-1">
												Name
											</p>
											<p className="text-lg">
												{profile.first_name}{' '}
												{profile.last_name}
											</p>
										</div>
										<div>
											<p className="text-sm uppercase tracking-widest text-muted-foreground mb-1">
												Timezone
											</p>
											<p className="text-lg">
												{profile.timezone}
											</p>
										</div>
									</div>
									<Separator />
									<div className="grid grid-cols-2 gap-8">
										<div>
											<p className="text-sm uppercase tracking-widest text-muted-foreground mb-1">
												<Target
													size={14}
													className="inline mr-1"
												/>
												Primary Goal
											</p>
											<p className="text-lg">
												{
													goalLabels[
														profile
															.primary_goal
													]
												}
											</p>
										</div>
										<div>
											<p className="text-sm uppercase tracking-widest text-muted-foreground mb-1">
												<Timer
													size={14}
													className="inline mr-1"
												/>
												Session Length
											</p>
											<p className="text-lg">
												{profile.daily_target}{' '}
												minutes
											</p>
										</div>
									</div>
								</div>
							)
						) : (
							<div className="text-muted-foreground">
								No profile found
							</div>
						)}
					</CardContent>
				</Card>

				{/* Clerk Profile (Account Settings) */}
				<Card>
					<CardHeader>
						<CardTitle className="text-xl uppercase tracking-widest font-light">
							Account Settings
						</CardTitle>
					</CardHeader>
					<CardContent>
						<UserProfile
							appearance={{
								elements: {
									rootBox: 'w-full',
									card: 'bg-transparent border-none shadow-none p-0',
									navbar: 'hidden',
									pageScrollBox: 'p-0',
									profileSection:
										'border border-border p-4',
									headerTitle: 'text-foreground',
									headerSubtitle:
										'text-muted-foreground',
									formFieldLabel: 'text-foreground',
									formFieldInput:
										'bg-background border-border text-foreground',
									formButtonPrimary:
										'bg-primary hover:bg-primary/90',
								},
							}}
						/>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
