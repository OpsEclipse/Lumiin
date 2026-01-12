import { auth } from '@clerk/nextjs/server';
import {
	DashboardHeader,
	StatCards,
	WeeklyChart,
	FocusHeatmap,
	SessionHistoryTable,
	StartSessionCard,
} from '@/components/dashboard';
import {
	getUserStats,
	getWeeklyData,
	getHeatmapData,
	getRecentSessions,
} from '@/lib/dashboard-data';

export default async function DashboardPage(): Promise<React.ReactElement> {
	const { userId } = await auth();

	if (!userId) {
		return (
			<>
				<DashboardHeader title="Overview" />
				<div className="p-8">
					<p className="text-muted-foreground">
						Please sign in to view your dashboard.
					</p>
				</div>
			</>
		);
	}

	// Fetch all dashboard data in parallel
	const [stats, weeklyData, heatmapResult, sessions] =
		await Promise.all([
			getUserStats(userId),
			getWeeklyData(userId),
			getHeatmapData(userId),
			getRecentSessions(userId),
		]);

	return (
		<>
			<DashboardHeader title="Overview" />

			<div className="p-8 space-y-8">
				{/* Start Session CTA - Only show for first-time users */}
				{sessions.length === 0 && <StartSessionCard />}

				{/* Stat Cards */}
				<StatCards
					streak={stats.streak}
					sessionHours={stats.sessionHours}
					rank={stats.rank}
					streakTrend={stats.streakTrend}
					rankTrend={stats.rankTrend}
				/>

				{/* Charts Row */}
				<div className="grid grid-cols-12 gap-8">
					<div className="col-span-12 lg:col-span-8">
						<WeeklyChart data={weeklyData} />
					</div>
					<div className="col-span-12 lg:col-span-4">
						<FocusHeatmap
							data={heatmapResult.data}
							mostProductiveTime={
								heatmapResult.mostProductiveTime
							}
						/>
					</div>
				</div>

				{/* Sessions Table */}
				<SessionHistoryTable
					sessions={sessions}
					totalCount={sessions.length}
					currentPage={1}
					pageSize={sessions.length}
					title="Recent Sessions"
					showControls={false}
				/>
			</div>
		</>
	);
}
