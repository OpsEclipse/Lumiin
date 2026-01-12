import { auth } from '@clerk/nextjs/server';
import {
	DashboardHeader,
	StatCards,
	WeeklyChart,
	FocusHeatmap,
	SessionsTable,
	SessionHistoryTable,
	AIRecommendation,
	StartSessionCard,
} from '@/components/dashboard';
import {
	getUserStats,
	getWeeklyData,
	getHeatmapData,
	getRecentSessions,
	getAIRecommendation,
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
	const [
		stats,
		weeklyData,
		heatmapResult,
		sessions,
		recommendation,
	] = await Promise.all([
		getUserStats(userId),
		getWeeklyData(userId),
		getHeatmapData(userId),
		getRecentSessions(userId),
		getAIRecommendation(userId),
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

				{/* AI Recommendation */}
				<AIRecommendation recommendation={recommendation} />
			</div>
		</>
	);
}
