'use client';

import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { PostureTrendPoint } from '@/lib/analytics-data';

interface PostureTrendChartProps {
	data: PostureTrendPoint[];
}

export function PostureTrendChart({
	data,
}: PostureTrendChartProps): React.ReactElement {
	// Check for empty data
	const hasDatapoints =
		data.length > 0 && data.some((p) => p.postureScore > 0);

	return (
		<Card className="border border-border bg-card p-8">
			<CardHeader className="p-0 mb-6">
				<div className="flex justify-between items-start">
					<div>
						<CardTitle className="text-xl uppercase tracking-widest font-light mb-1">
							Posture Trends
						</CardTitle>
						<p className="text-sm text-muted-foreground">
							Avg. Score vs Time
						</p>
					</div>
					<div className="flex gap-4 text-xs font-medium uppercase tracking-wider">
						<div className="flex items-center gap-2">
							<span className="w-2 h-2 rounded-full bg-primary" />
							<span>Posture Score</span>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-0 h-80">
				{!hasDatapoints ? (
					<div className="h-full flex flex-col items-center justify-center text-center p-4">
						<p className="text-muted-foreground mb-4">
							No posture data available for this period.
						</p>
						<p className="text-sm text-muted-foreground/60 max-w-xs">
							Start a focus session today to begin
							tracking your posture trends.
						</p>
					</div>
				) : (
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={data}>
							<defs>
								<linearGradient
									id="scoreGradient"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor="#F59E0B"
										stopOpacity={0.3}
									/>
									<stop
										offset="95%"
										stopColor="#F59E0B"
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="var(--border)"
								vertical={false}
							/>
							<XAxis
								dataKey="date"
								stroke="var(--muted-foreground)"
								fontSize={11}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								stroke="var(--muted-foreground)"
								fontSize={11}
								tickLine={false}
								axisLine={false}
								domain={[0, 100]}
								label={{
									value: 'Score (%)',
									angle: -90,
									position: 'insideLeft',
									style: {
										fill: 'var(--muted-foreground)',
										fontSize: '11px',
									},
								}}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor:
										'hsl(var(--card))',
									borderColor: 'hsl(var(--border))',
									borderRadius: '0px',
									boxShadow:
										'0 4px 6px -1px rgb(0 0 0 / 0.1)',
									color: 'hsl(var(--foreground))',
								}}
								itemStyle={{
									color: 'hsl(var(--foreground))',
								}}
							/>
							<Area
								type="monotone"
								dataKey="postureScore"
								stroke="#F59E0B"
								strokeWidth={2}
								fill="url(#scoreGradient)"
								animationDuration={1000}
							/>
						</AreaChart>
					</ResponsiveContainer>
				)}
			</CardContent>
		</Card>
	);
}
