'use client';

import {
	Area,
	AreaChart,
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
import { FatiguePoint } from '@/lib/analytics-data';
import { WaveSine } from '@phosphor-icons/react';

interface FatigueChartProps {
	data: FatiguePoint[];
}

export function FatigueChart({
	data,
}: FatigueChartProps): React.ReactElement {
	const startScore = data[0]?.score || 0;
	const endScore = data[data.length - 1]?.score || 0;
	const trend =
		endScore < startScore - 10 ? 'Decreasing' : 'Stable';

	const hasData = data.some((point) => point.score > 0);
	const strokeColor = trend === 'Decreasing' ? '#ef4444' : '#22c55e';
	const gradientId =
		trend === 'Decreasing'
			? 'fatigueGradientRed'
			: 'fatigueGradientGreen';

	return (
		<Card className="border border-border bg-card p-6 flex flex-col h-full">
			<CardHeader className="p-0 mb-6 flex flex-row items-center justify-between space-y-0">
				<CardTitle className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
					Posture Fatigue
				</CardTitle>
				<WaveSine size={20} style={{ color: strokeColor }} />
			</CardHeader>
			<CardContent className="p-0 flex-1 min-h-[160px] relative">
				{!hasData ? (
					<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
						<p className="text-xs text-muted-foreground">
							Collect more session data to see fatigue
							analysis.
						</p>
					</div>
				) : (
					<ResponsiveContainer width="100%" height="100%" minHeight={160}>
						<AreaChart data={data}>
							<defs>
								<linearGradient
									id="fatigueGradientGreen"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor="#22c55e"
										stopOpacity={0.3}
									/>
									<stop
										offset="95%"
										stopColor="#22c55e"
										stopOpacity={0}
									/>
								</linearGradient>
								<linearGradient
									id="fatigueGradientRed"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor="#ef4444"
										stopOpacity={0.3}
									/>
									<stop
										offset="95%"
										stopColor="#ef4444"
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>
							<XAxis
								dataKey="minuteBin"
								stroke="#a1a1aa"
								fontSize={10}
								tickLine={false}
								axisLine={false}
								tickFormatter={(val) => `${val}%`}
							/>
							<YAxis hide domain={[0, 100]} />
							<Tooltip
								contentStyle={{
									backgroundColor: '#18181b',
									borderColor: '#3f3f46',
									borderRadius: '0px',
									color: '#fafafa',
								}}
								itemStyle={{
									color: '#fafafa',
								}}
								formatter={(value) => [
									`${value || 0}%`,
									'Posture',
								]}
								labelFormatter={(label) =>
									`Session progress: ${label}%`
								}
							/>
							<Area
								type="monotone"
								dataKey="score"
								stroke={strokeColor}
								strokeWidth={2}
								fill={`url(#${gradientId})`}
							/>
						</AreaChart>
					</ResponsiveContainer>
				)}
			</CardContent>
			<div className="mt-4 pt-4 border-t border-border">
				<p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-widest">
					Trend Insight
				</p>
				<p className="text-sm font-light text-foreground">
					{!hasData
						? 'N/A'
						: trend === 'Decreasing'
							? 'Posture degrades towards end of sessions.'
							: 'Posture remains consistent throughout sessions.'}
				</p>
			</div>
		</Card>
	);
}
