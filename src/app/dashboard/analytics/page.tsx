'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { DashboardHeader } from '@/components/dashboard';
import {
	getAnalyticsData,
	AnalyticsData,
	TimeRange,
} from '@/lib/analytics-data';
import { PostureTrendChart } from '@/components/dashboard/analytics/posture-trend-chart';
import { HourlyPostureChart } from '@/components/dashboard/analytics/hourly-posture-chart';
import { FatigueChart } from '@/components/dashboard/analytics/fatigue-chart';
import { RecentAlerts } from '@/components/dashboard/analytics/recent-alerts';
import { SessionDurationCard } from '@/components/dashboard/analytics/session-duration-card';
import { Button } from '@/components/ui/button';
import { PlayCircle } from '@phosphor-icons/react';
import Link from 'next/link';
import { LumiinLoader } from '@/components/ui/lumiin-loader';
import { motion } from 'framer-motion';

export default function AnalyticsPage(): React.ReactElement {
	const { userId, isLoaded } = useAuth();
	const [timeRange, setTimeRange] = useState<TimeRange>(7);
	const [data, setData] = useState<AnalyticsData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			if (!userId) return;

			setIsLoading(true);

			try {
				const result = await getAnalyticsData(
					userId,
					timeRange
				);
				setData(result);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		}

		if (isLoaded && userId) {
			fetchData();
		}
	}, [userId, isLoaded, timeRange]);

	if (!isLoaded || isLoading) {
		return (
			<>
				<DashboardHeader title="Analytics" />
				<div className="flex items-center justify-center min-h-[60vh]">
					<LumiinLoader size="lg" />
				</div>
			</>
		);
	}

	if (!data) return <div>Error loading data</div>;

	return (
		<>
			{/* Header */}
			<header className="h-20 flex items-center justify-between px-8 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
				<h1 className="text-2xl font-display font-light uppercase tracking-widest">
					Detailed Analytics
				</h1>
				<Link href="/focus">
					<Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-2 flex items-center gap-2">
						<PlayCircle size={18} weight="fill" />
						Start New Session
					</Button>
				</Link>
			</header>

			<motion.div
				className="p-8 max-w-[1600px] mx-auto space-y-8"
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.35, ease: 'easeOut' }}
			>
				{/* Filters */}
				<div className="flex justify-end gap-2">
					<Button
						variant={
							timeRange === 3 ? 'default' : 'outline'
						}
						size="sm"
						onClick={() => setTimeRange(3)}
					>
						3 Days
					</Button>
					<Button
						variant={
							timeRange === 7 ? 'default' : 'outline'
						}
						size="sm"
						onClick={() => setTimeRange(7)}
					>
						7 Days
					</Button>
					<Button
						variant={
							timeRange === 15 ? 'default' : 'outline'
						}
						size="sm"
						onClick={() => setTimeRange(15)}
					>
						15 Days
					</Button>
				</div>

				{/* Main Chart */}
				<PostureTrendChart data={data.postureTrend} />

				{/* Grid Section */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="h-96">
						<SessionDurationCard
							avgDuration={
								data.stats.avgSessionDuration
							}
						/>
					</div>
					<div className="h-96">
						<HourlyPostureChart
							data={data.hourlyPosture}
						/>
					</div>
					<div className="h-96">
						<FatigueChart data={data.fatigueAnalysis} />
					</div>
				</div>

				{/* Bottom Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Reusing Recent Alerts as a large block as per design */}
					<div className="h-full">
						<RecentAlerts alerts={data.alerts} />
					</div>

					{/* Placeholder for future detailed breakdown or reusing heatmap */}
					<div className="border border-border bg-card p-8 h-full min-h-[300px] flex items-center justify-center text-muted-foreground flex-col gap-4">
						<div className="text-center">
							<h3 className="text-xl font-display uppercase tracking-widest mb-2 text-foreground">
								Additional Insights
							</h3>
							<p className="text-sm border-b pb-4 mb-4 border-border">
								Coming soon: Biomechanical detailed
								breakdown
							</p>
							<p className="text-xs">
								detailed neck, back, and shoulder
								analysis from camera data
							</p>
						</div>
					</div>
				</div>
			</motion.div>

			<footer className="border-t border-border p-8 mt-4 text-center">
				<p className="text-xs text-muted-foreground uppercase tracking-widest">
					Lumiin Analytics © {new Date().getFullYear()}
				</p>
			</footer>
		</>
	);
}
