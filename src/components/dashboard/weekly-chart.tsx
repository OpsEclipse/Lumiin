'use client';

import {
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Area,
	AreaChart,
} from 'recharts';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

interface WeeklyDataPoint {
	day: string;
	durationMins: number;
	posture: number;
}

interface WeeklyChartProps {
	data: WeeklyDataPoint[];
}

export function WeeklyChart({
	data,
}: WeeklyChartProps): React.ReactElement {
	return (
		<Card className="border border-border bg-card p-8">
			<CardHeader className="p-0 mb-6">
				<div className="flex items-center justify-between">
					<CardTitle className="text-xl uppercase tracking-widest font-light">
						Weekly Performance
					</CardTitle>
					<div className="flex gap-4 text-sm">
						<div className="flex items-center gap-2">
							<span className="w-3 h-3 bg-primary" />
							<span className="text-muted-foreground">
								Duration (min)
							</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="w-3 h-3 bg-secondary" />
							<span className="text-muted-foreground">
								Posture (%)
							</span>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-0 h-64">
				<ResponsiveContainer width="100%" height="100%" minHeight={256}>
					<AreaChart data={data}>
						<defs>
							<linearGradient
								id="durationGradient"
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="5%"
									stopColor="#F59E0B"
									stopOpacity={0.2}
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
							dataKey="day"
							stroke="var(--muted-foreground)"
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis
							yAxisId="left"
							stroke="var(--muted-foreground)"
							fontSize={12}
							tickLine={false}
							axisLine={false}
							label={{
								value: 'Min',
								angle: -90,
								position: 'insideLeft',
								style: {
									fill: 'var(--muted-foreground)',
								},
							}}
						/>
						<YAxis
							yAxisId="right"
							orientation="right"
							stroke="var(--muted-foreground)"
							fontSize={12}
							tickLine={false}
							axisLine={false}
							domain={[0, 100]}
							label={{
								value: '%',
								angle: 90,
								position: 'insideRight',
								style: {
									fill: 'var(--muted-foreground)',
								},
							}}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: 'var(--card)',
								border: '1px solid var(--border)',
								borderRadius: '0px',
							}}
							labelStyle={{
								color: 'var(--foreground)',
							}}
						/>
						<Area
							yAxisId="left"
							type="monotone"
							dataKey="durationMins"
							name="Duration (min)"
							stroke="#F59E0B"
							strokeWidth={2}
							fill="url(#durationGradient)"
						/>
						<Line
							yAxisId="right"
							type="monotone"
							dataKey="posture"
							name="Posture Score"
							stroke="#3B82F6"
							strokeWidth={2}
							strokeDasharray="5 5"
							dot={false}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
