'use client';

import {
	X,
	CalendarBlank,
	Clock,
	User,
	TrendUp,
	Lightning,
} from '@phosphor-icons/react';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';

import { DetailedSession } from '@/lib/dashboard-data';
import { formatDuration } from '@/lib/supabase';
import { formatDate, getTimeRange } from '@/lib/dashboard-data';

interface SessionDetailModalProps {
	session: DetailedSession | null;
	isOpen: boolean;
	onClose: () => void;
}

export function SessionDetailModal({
	session,
	isOpen,
	onClose,
}: SessionDetailModalProps): React.ReactElement | null {
	if (!session) return null;

	// Handle null/undefined average score
	const postureScore =
		session.avgPostureScore !== null &&
		session.avgPostureScore !== undefined
			? Math.round(session.avgPostureScore * 100)
			: null;

	// Posture grade calculation (reused from summary page)
	const getPostureGrade = (
		score: number | null
	): { grade: string; color: string } => {
		if (score === null)
			return { grade: '--', color: 'text-muted-foreground' };
		if (score >= 90)
			return { grade: 'A+', color: 'text-emerald-400' };
		if (score >= 80)
			return { grade: 'A', color: 'text-emerald-400' };
		if (score >= 70)
			return { grade: 'B', color: 'text-green-400' };
		if (score >= 60)
			return { grade: 'C', color: 'text-yellow-400' };
		if (score >= 1) return { grade: 'D', color: 'text-red-400' };
		return { grade: '--', color: 'text-muted-foreground' }; // Fallback for low scores < 1
	};

	const grade = getPostureGrade(postureScore);

	// Render minimal chart bars from posture array
	const renderPostureChart = () => {
		if (
			!session.postureArray ||
			session.postureArray.length === 0
		) {
			return (
				<div className="text-center text-muted-foreground py-8 text-sm">
					No detailed posture data available for this
					session.
				</div>
			);
		}

		// Sample data down to ~20 bars max
		const maxBars = 20;
		const logs = session.postureArray;
		const step = Math.ceil(logs.length / maxBars) || 1;
		const sampledLogs = logs
			.filter((_, i) => i % step === 0)
			.slice(0, maxBars);

		return (
			<div className="flex items-end justify-center gap-1 h-24 mt-4">
				{sampledLogs.map((score, i) => {
					const height = score * 100;
					const color =
						score >= 0.8
							? 'bg-emerald-400'
							: score >= 0.6
								? 'bg-yellow-400'
								: 'bg-red-400';

					return (
						<div
							key={i}
							className={`w-3 ${color} rounded-t transition-all`}
							style={{
								height: `${Math.max(height, 5)}%`,
							}}
							title={`${Math.round(score * 100)}%`}
						/>
					);
				})}
			</div>
		);
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => !open && onClose()}
		>
			<DialogContent
				className="max-w-xl bg-[#0f0f0f]/95 border-white/10 p-0 overflow-hidden"
				showCloseButton={false}
			>
				{/* Header */}
				<div className="relative p-6 border-b border-white/10 bg-black/20 text-center">
					<button
						onClick={onClose}
						className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors"
					>
						<X size={20} />
					</button>

					<div className="inline-flex items-center gap-2 text-emerald-400 mb-2">
						<Lightning weight="fill" size={20} />
						<span className="text-xs uppercase tracking-widest font-medium">
							Session Report
						</span>
					</div>
					<DialogTitle className="text-xl font-light text-white tracking-wide mb-1">
						{session.title || 'Untitled Session'}
					</DialogTitle>
					<DialogDescription className="text-white/40 text-xs">
						{formatDate(session.startTime)} •{' '}
						{getTimeRange(
							session.startTime,
							session.endTime
						)}
					</DialogDescription>
				</div>

				{/* Content */}
				<div className="p-6 space-y-6">
					{/* Key Metrics */}
					<div className="grid grid-cols-3 gap-4">
						<div className="bg-black/20 border border-white/5 p-4 text-center rounded-sm">
							<Clock
								size={20}
								className="text-emerald-400 mx-auto mb-2"
							/>
							<p className="text-xl font-mono text-white/90">
								{formatDuration(session.durationMins)}
							</p>
							<p className="text-white/30 text-[10px] uppercase tracking-wider mt-1">
								Duration
							</p>
						</div>

						<div className="bg-black/20 border border-white/5 p-4 text-center rounded-sm">
							<User
								size={20}
								className="text-emerald-400 mx-auto mb-2"
							/>
							<p
								className={`text-xl font-mono ${grade.color}`}
							>
								{grade.grade}
							</p>
							<p className="text-white/30 text-[10px] uppercase tracking-wider mt-1">
								Grade
							</p>
						</div>

						<div className="bg-black/20 border border-white/5 p-4 text-center rounded-sm">
							<TrendUp
								size={20}
								className="text-emerald-400 mx-auto mb-2"
							/>
							<p className="text-xl font-mono text-white/90">
								{postureScore !== null
									? `${postureScore}%`
									: 'N/A'}
							</p>
							<p className="text-white/30 text--[10px] uppercase tracking-wider mt-1">
								Avg Score
							</p>
						</div>
					</div>

					{/* Chart Section */}
					<div className="bg-black/20 border border-white/5 p-4 rounded-sm">
						<div className="flex items-center justify-between">
							<h3 className="text-white/60 text-xs uppercase tracking-wider">
								Posture Timeline
							</h3>
						</div>
						{renderPostureChart()}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
