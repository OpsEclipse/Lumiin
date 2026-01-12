'use client';

import React from 'react';

import {
	CalendarBlank,
	CaretLeft,
	CaretRight,
	ArrowRight,
	PlayCircle,
	User,
} from '@phosphor-icons/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/supabase';
import {
	formatDate,
	getTimeRange,
	type DetailedSession,
} from '@/lib/dashboard-data';
import Link from 'next/link';
import { SessionDetailModal } from '@/components/dashboard/session-detail-modal';

interface SessionHistoryTableProps {
	sessions: DetailedSession[];
	totalCount: number;
	currentPage: number;
	pageSize: number;
	onPageChange?: (page: number) => void;
	title?: string;
	showControls?: boolean;
}

export function SessionHistoryTable({
	sessions,
	totalCount,
	currentPage,
	pageSize,
	onPageChange,
	title = 'Session History',
	showControls = true,
}: SessionHistoryTableProps): React.ReactElement {
	const totalPages = Math.ceil(totalCount / pageSize);
	const startItem = (currentPage - 1) * pageSize + 1;
	const endItem = Math.min(currentPage * pageSize, totalCount);

	const getPostureColor = (score: number | null) => {
		if (score === null) return 'text-muted-foreground';
		if (score >= 0.8) return 'text-emerald-500';
		if (score >= 0.6) return 'text-amber-500';
		return 'text-red-500';
	};

	// Modal state
	const [selectedSession, setSelectedSession] =
		React.useState<DetailedSession | null>(null);
	const [isModalOpen, setIsModalOpen] = React.useState(false);

	const handleSessionClick = (session: DetailedSession) => {
		setSelectedSession(session);
		setIsModalOpen(true);
	};

	return (
		<>
			<Card className="border border-border bg-card/50 backdrop-blur-sm">
				{/* Header with Sort */}
				<CardHeader className="p-6 border-b border-border">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
						<h3 className="text-sm uppercase tracking-widest font-medium text-muted-foreground hidden md:block">
							{title}
						</h3>

						{/* Sort dropdown */}
						{showControls && (
							<div className="flex items-center gap-3 ml-auto">
								<span className="text-xs text-muted-foreground uppercase tracking-wide">
									Sort by:
								</span>
								<select className="bg-transparent border-none text-xs font-medium text-foreground focus:ring-0 cursor-pointer uppercase tracking-wide">
									<option>Date (Newest)</option>
									<option>Duration</option>
									<option>Posture Score</option>
								</select>
							</div>
						)}
					</div>
				</CardHeader>

				{/* Table */}
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="bg-muted/50 border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
									<th className="py-4 px-6 font-normal w-1/3">
										Date & Time
									</th>
									<th className="py-4 px-6 font-normal w-1/4">
										Duration
									</th>
									<th className="py-4 px-6 font-normal w-1/4">
										Avg Posture
									</th>
									<th className="py-4 px-6 font-normal text-center">
										Details
									</th>
								</tr>
							</thead>
							<tbody className="text-sm divide-y divide-border">
								{sessions.length === 0 ? (
									<tr>
										<td
											colSpan={4}
											className="py-12 px-6 text-center"
										>
											<div className="flex flex-col items-center gap-3 text-muted-foreground">
												<CalendarBlank
													size={48}
													className="opacity-30"
												/>
												<p>
													No sessions found.
													Start your first
													session!
												</p>
												<Link
													href="/focus"
													passHref
												>
													<Button className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground">
														<PlayCircle
															size={18}
															className="mr-2"
														/>
														Start Session
													</Button>
												</Link>
											</div>
										</td>
									</tr>
								) : (
									sessions.map((session) => {
										const postureScore =
											session.avgPostureScore
												? Math.round(
														session.avgPostureScore *
															100
													)
												: null;

										return (
											<tr
												key={session.id}
												className="group hover:bg-muted/30 transition-colors cursor-pointer"
												onClick={() =>
													handleSessionClick(
														session
													)
												}
											>
												{/* Date & Time */}
												<td className="py-5 px-6">
													<div className="flex items-center gap-3">
														<div className="w-10 h-10 bg-background border border-border flex items-center justify-center text-muted-foreground">
															<CalendarBlank
																size={
																	20
																}
															/>
														</div>
														<div>
															<div className="font-medium">
																{formatDate(
																	session.startTime
																)}
															</div>
															<div className="text-xs text-muted-foreground">
																{getTimeRange(
																	session.startTime,
																	session.endTime
																)}
															</div>
														</div>
													</div>
												</td>

												{/* Duration */}
												<td className="py-5 px-6">
													<span className="font-display font-light text-lg">
														{formatDuration(
															session.durationMins
														)}
													</span>
												</td>

												{/* Posture Score */}
												<td className="py-5 px-6">
													<div className="flex items-center gap-2">
														<User
															size={16}
															weight="fill"
															className={getPostureColor(
																session.avgPostureScore
															)}
														/>
														<span
															className={cn(
																'text-lg font-light',
																getPostureColor(
																	session.avgPostureScore
																)
															)}
														>
															{postureScore !==
															null
																? `${postureScore}%`
																: '--'}
														</span>
													</div>
												</td>

												{/* Details button - CENTERED */}
												<td className="py-5 px-6 text-center">
													<button className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors mx-auto">
														<ArrowRight
															size={16}
														/>
													</button>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					{showControls && totalCount > 0 && (
						<div className="px-6 py-4 border-t border-border flex items-center justify-between">
							<span className="text-xs text-muted-foreground uppercase tracking-widest">
								Showing {startItem}-{endItem} of{' '}
								{totalCount}
							</span>
							<div className="flex gap-2">
								<button
									onClick={() =>
										onPageChange?.(
											currentPage - 1
										)
									}
									disabled={currentPage <= 1}
									className="w-8 h-8 flex items-center justify-center border border-border hover:bg-muted text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<CaretLeft size={16} />
								</button>
								<button
									onClick={() =>
										onPageChange?.(
											currentPage + 1
										)
									}
									disabled={
										currentPage >= totalPages
									}
									className="w-8 h-8 flex items-center justify-center border border-border hover:bg-muted text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<CaretRight size={16} />
								</button>
							</div>
						</div>
					)}
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
