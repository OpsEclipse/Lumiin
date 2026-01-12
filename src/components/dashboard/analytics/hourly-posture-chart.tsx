'use client';

import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	Cell,
} from 'recharts';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { HourlyPosturePoint } from '@/lib/analytics-data';
import { ChartBar } from '@phosphor-icons/react';

interface HourlyPostureChartProps {
	data: HourlyPosturePoint[];
}

export function HourlyPostureChart({
	data,
}: HourlyPostureChartProps): React.ReactElement {
	// Find peak hour
	const peak = [...data].sort((a, b) => b.score - a.score)[0];

	return (
		<Card className="border border-border bg-card p-6 flex flex-col h-full">
			<CardHeader className="p-0 mb-6 flex flex-row items-center justify-between space-y-0">
				<CardTitle className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
					Hourly Performance
				</CardTitle>
				<ChartBar size={20} className="text-accent" />
			</CardHeader>
			<CardContent className="p-0 flex-1 min-h-[160px] relative">
				<ResponsiveContainer width="100%" height="100%" minHeight={160}>
					<BarChart data={data} barSize={24}>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="var(--border)"
							vertical={false}
							horizontal={false}
						/>
						<XAxis
							dataKey="hour"
							stroke="var(--muted-foreground)"
							fontSize={10}
							tickLine={false}
							axisLine={false}
							interval={2}
						/>
						<YAxis hide domain={[0, 100]} />
						<Tooltip
							cursor={{ fill: 'transparent' }}
							contentStyle={{
								backgroundColor: 'hsl(var(--card))',
								borderColor: 'hsl(var(--border))',
								color: 'hsl(var(--foreground))',
							}}
							itemStyle={{
								color: 'hsl(var(--foreground))',
							}}
							formatter={(value) => [`${value ?? 0}%`]}
						/>
						<Bar dataKey="score" radius={[2, 2, 0, 0]}>
							{data.map((entry, index) => {
								let fill = '#3f3f46';
								if (entry.score >= 75) fill = '#22c55e';
								else if (entry.score >= 50) fill = '#F59E0B';
								else if (entry.score > 0) fill = '#ef4444';

								return (
									<Cell
										key={`cell-${index}`}
										fill={fill}
									/>
								);
							})}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
			<div className="mt-4 flex justify-between items-end border-t border-border pt-4">
				<div>
					<p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
						Peak Hour
					</p>
					<p className="text-2xl font-light font-display text-foreground">
						{peak?.hour || '--'}
					</p>
				</div>
				<div>
					<p className="text-[10px] text-muted-foreground uppercase tracking-widest text-right mb-1">
						Score
					</p>
					<p className="text-2xl font-light font-display text-right text-primary">
						{peak?.score ? `${peak.score}%` : '--'}
					</p>
				</div>
			</div>
		</Card>
	);
}
