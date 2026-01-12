'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	Clock,
	TrendUp,
	User,
	Lightning,
	ArrowRight,
	Pause,
} from '@phosphor-icons/react';
import { LumiinLoader } from '@/components/ui/lumiin-loader';
import { motion } from 'framer-motion';

interface SessionSummary {
	name: string;
	startTime: string;
	endTime: string;
	durationMins: number;
	durationSeconds: number;
	avgPostureScore: number;
	postureLogs: { timestamp: string; score: number }[];
	pauseEvents: { type: 'pause' | 'resume'; timestamp: string }[];
	pauseCount: number;
}

export default function SessionSummaryPage(): React.ReactElement {
	const router = useRouter();
	const [summary, setSummary] = useState<SessionSummary | null>(
		null
	);

	useEffect(() => {
		const stored = sessionStorage.getItem('sessionSummary');
		if (stored) {
			setSummary(JSON.parse(stored));
			// Clear active session flag only
			sessionStorage.removeItem('focusSession');
		} else {
			router.push('/dashboard');
		}
	}, [router]);

	// Format duration
	const formatDuration = (seconds: number): string => {
		const hrs = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hrs > 0) {
			return `${hrs}h ${mins}m`;
		}
		if (mins > 0) {
			return `${mins}m ${secs}s`;
		}
		return `${secs}s`;
	};

	// Get posture grade
	const getPostureGrade = (
		score: number
	): { grade: string; color: string } => {
		if (score >= 0.9)
			return { grade: 'A+', color: 'text-emerald-400' };
		if (score >= 0.8)
			return { grade: 'A', color: 'text-emerald-400' };
		if (score >= 0.7)
			return { grade: 'B', color: 'text-green-400' };
		if (score >= 0.6)
			return { grade: 'C', color: 'text-yellow-400' };
		return { grade: 'D', color: 'text-red-400' };
	};

	// Simple posture chart (visual bars)
	const renderPostureChart = () => {
		if (!summary || summary.postureLogs.length === 0) {
			return (
				<div className="text-center text-white/40 py-8">
					<p>No posture data recorded</p>
					<p className="text-xs mt-1">
						Sessions under 30 seconds don't log posture
					</p>
				</div>
			);
		}

		const maxBars = 20;
		const logs = summary.postureLogs;
		const step = Math.ceil(logs.length / maxBars);
		const sampledLogs = logs
			.filter((_, i) => i % step === 0)
			.slice(0, maxBars);

		return (
			<div className="flex items-end justify-center gap-1 h-24">
				{sampledLogs.map((log, i) => {
					const height = log.score * 100;
					const color =
						log.score >= 0.8
							? 'bg-emerald-400'
							: log.score >= 0.6
								? 'bg-yellow-400'
								: 'bg-red-400';

					return (
						<div
							key={i}
							className={`w-3 ${color} rounded-t transition-all`}
							style={{ height: `${height}%` }}
							title={`${Math.round(log.score * 100)}%`}
						/>
					);
				})}
			</div>
		);
	};

	if (!summary) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-[#0A1C2A] via-[#0F3A4B] to-[#1B5E6D] flex items-center justify-center">
				<LumiinLoader size="xl" className="text-white" />
			</div>
		);
	}

	const postureGrade = getPostureGrade(summary.avgPostureScore);

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0A1C2A] via-[#0F3A4B] to-[#1B5E6D] flex items-center justify-center p-8">
			<motion.div
				className="w-full max-w-2xl"
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: 'easeOut' }}
			>
				{/* Header */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center gap-2 text-emerald-400 mb-4">
						<Lightning weight="fill" size={24} />
						<span className="text-sm uppercase tracking-widest">
							Session Complete
						</span>
					</div>
					<h1 className="text-3xl font-light text-white/90 tracking-wide mb-2">
						{summary.name}
					</h1>
					<p className="text-white/40 text-sm">
						{new Date(
							summary.startTime
						).toLocaleDateString('en-US', {
							weekday: 'long',
							month: 'long',
							day: 'numeric',
						})}
					</p>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-3 gap-4 mb-8">
					{/* Duration */}
					<div className="bg-black/20 backdrop-blur-md border border-white/10 p-6 text-center">
						<Clock
							size={24}
							className="text-emerald-400 mx-auto mb-2"
						/>
						<p className="text-2xl font-mono text-white/90">
							{formatDuration(summary.durationSeconds)}
						</p>
						<p className="text-white/40 text-xs uppercase tracking-wider mt-1">
							Duration
						</p>
					</div>

					{/* Posture Grade */}
					<div className="bg-black/20 backdrop-blur-md border border-white/10 p-6 text-center">
						<User
							size={24}
							className="text-emerald-400 mx-auto mb-2"
						/>
						<p
							className={`text-2xl font-mono ${postureGrade.color}`}
						>
							{postureGrade.grade}
						</p>
						<p className="text-white/40 text-xs uppercase tracking-wider mt-1">
							Posture Grade
						</p>
					</div>

					{/* Pauses */}
					<div className="bg-black/20 backdrop-blur-md border border-white/10 p-6 text-center">
						<Pause
							size={24}
							className="text-emerald-400 mx-auto mb-2"
						/>
						<p className="text-2xl font-mono text-white/90">
							{summary.pauseCount}
						</p>
						<p className="text-white/40 text-xs uppercase tracking-wider mt-1">
							Pauses
						</p>
					</div>
				</div>

				{/* Posture Over Time Chart */}
				<div className="bg-black/20 backdrop-blur-md border border-white/10 p-6 mb-8">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-white/70 text-sm uppercase tracking-wider">
							Posture Over Time
						</h3>
						<div className="flex items-center gap-2 text-xs text-white/40">
							<TrendUp size={14} />
							<span>
								Avg:{' '}
								{Math.round(
									summary.avgPostureScore * 100
								)}
								%
							</span>
						</div>
					</div>
					{renderPostureChart()}
				</div>

				{/* Score Breakdown */}
				<div className="bg-black/20 backdrop-blur-md border border-white/10 p-6 mb-8">
					<h3 className="text-white/70 text-sm uppercase tracking-wider mb-4">
						Session Metrics
					</h3>
					<div className="space-y-3">
						<div className="flex justify-between items-center">
							<span className="text-white/60 text-sm">
								Average Posture
							</span>
							<div className="flex items-center gap-2">
								<div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
									<div
										className="h-full bg-emerald-400 rounded-full"
										style={{
											width: `${summary.avgPostureScore * 100}%`,
										}}
									/>
								</div>
								<span className="text-white/80 text-sm font-mono w-12 text-right">
									{Math.round(
										summary.avgPostureScore * 100
									)}
									%
								</span>
							</div>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-white/60 text-sm">
								Session Time
							</span>
							<span className="text-white/80 text-sm font-mono">
								{formatDuration(
									summary.durationSeconds
								)}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-white/60 text-sm">
								Data Points
							</span>
							<span className="text-white/80 text-sm font-mono">
								{summary.postureLogs.length}
							</span>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-4 justify-center">
					<button
						onClick={() => router.push('/focus')}
						className="px-6 py-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
					>
						Start Another Session
					</button>
					<button
						onClick={() =>
							(window.location.href = '/dashboard')
						}
						className="px-6 py-4 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
					>
						Back to Dashboard
						<ArrowRight size={16} />
					</button>
				</div>
			</motion.div>
		</div>
	);
}
