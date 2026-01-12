'use client';

import React, { useState } from 'react';
import {
	CheckCircle,
	WarningCircle,
	CaretRight,
} from '@phosphor-icons/react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DetailedSession } from '@/lib/dashboard-data';
import { formatRelativeDate, formatDuration } from '@/lib/supabase';
import { SessionDetailModal } from '@/components/dashboard/session-detail-modal';

type PostureStatus = 'good' | 'average' | 'poor';

interface SessionsTableProps {
	sessions: DetailedSession[];
}

const POSTURE_CONFIG: Record<
	PostureStatus,
	{ label: string; icon: typeof CheckCircle; className: string }
> = {
	good: {
		label: 'Good',
		icon: CheckCircle,
		className: 'text-success',
	},
	average: {
		label: 'Average',
		icon: WarningCircle,
		className: 'text-yellow-500',
	},
	poor: {
		label: 'Poor',
		icon: WarningCircle,
		className: 'text-destructive',
	},
};

export function SessionsTable({
	sessions,
}: SessionsTableProps): React.ReactElement {
	const [selectedSession, setSelectedSession] =
		useState<DetailedSession | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleSessionClick = (session: DetailedSession) => {
		setSelectedSession(session);
		setIsModalOpen(true);
	};

	const getPostureStatus = (
		score: number | null
	): PostureStatus => {
		if (score === null || score >= 0.8) return 'good';
		if (score >= 0.6) return 'average';
		return 'poor';
	};

	return (
		<>
			<Card className="border border-border bg-card p-8">
				<CardHeader className="p-0 mb-6">
					<CardTitle className="text-xl uppercase tracking-widest font-light">
						Recent Sessions
					</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow className="border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
								<TableHead className="py-4 font-normal">
									Date
								</TableHead>
								<TableHead className="py-4 font-normal">
									Duration
								</TableHead>
								<TableHead className="py-4 font-normal">
									Posture Score
								</TableHead>
								<TableHead className="py-4 font-normal">
									Status
								</TableHead>
								<TableHead className="py-4 font-normal text-right">
									Action
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sessions.map((session) => {
								const avgScore =
									session.avgPostureScore;
								const status =
									getPostureStatus(avgScore);
								const postureConfig =
									POSTURE_CONFIG[status];
								const PostureIcon =
									postureConfig.icon;
								const scoreValue = avgScore
									? Math.round(avgScore * 100)
									: 0;

								return (
									<TableRow
										key={session.id}
										className="border-b border-border cursor-pointer hover:bg-white/5 transition-colors"
										onClick={() =>
											handleSessionClick(
												session
											)
										}
									>
										<TableCell className="py-4">
											{formatRelativeDate(
												session.startTime
											)}
										</TableCell>
										<TableCell className="py-4">
											{formatDuration(
												session.durationMins
											)}
										</TableCell>
										<TableCell className="py-4">
											<div className="flex items-center gap-2">
												<div className="w-16 h-1 bg-muted overflow-hidden">
													<div
														className="h-full bg-secondary"
														style={{
															width: `${scoreValue}%`,
														}}
													/>
												</div>
												<span className="font-bold">
													{scoreValue}%
												</span>
											</div>
										</TableCell>
										<TableCell className="py-4">
											<span
												className={cn(
													'flex items-center gap-1',
													postureConfig.className
												)}
											>
												<PostureIcon
													size={16}
													weight="fill"
												/>
												{postureConfig.label}
											</span>
										</TableCell>
										<TableCell className="py-4 text-right">
											<Button
												variant="ghost"
												size="sm"
												className="text-muted-foreground hover:text-foreground"
											>
												<CaretRight
													size={16}
												/>
											</Button>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<SessionDetailModal
				session={selectedSession}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	);
}
