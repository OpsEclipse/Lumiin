'use client';

import { Flame, Clock, Trophy, TrendUp } from '@phosphor-icons/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface StatCardProps {
	label: string;
	value: string;
	unit?: string;
	icon: React.ElementType;
	iconColor: string;
	trend?: {
		value: string;
		positive: boolean;
	};
}

const cardVariants = {
	hidden: {
		opacity: 0,
		y: 20,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.4,
			ease: 'easeOut' as const,
		},
	},
};

function StatCard({
	label,
	value,
	unit,
	icon: Icon,
	iconColor,
	trend,
}: StatCardProps): React.ReactElement {
	return (
		<motion.div variants={cardVariants}>
			<Card className="border border-border bg-card p-6 relative group overflow-hidden">
				{/* Background Icon */}
				<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
					<Icon
						size={64}
						weight="fill"
						className={iconColor}
					/>
				</div>

				{/* Content */}
				<CardContent className="p-0 flex flex-col h-full justify-between relative z-10">
					<p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
						{label}
					</p>
					<div className="flex items-baseline gap-2">
						<h3 className="text-4xl font-light">
							{value}
							{unit && (
								<span className="text-lg text-muted-foreground ml-1">
									{unit}
								</span>
							)}
						</h3>
						{trend && (
							<Badge
								variant="outline"
								className={
									trend.positive
										? 'bg-success/10 text-success border-success/30'
										: 'bg-destructive/10 text-destructive border-destructive/30'
								}
							>
								<TrendUp
									size={12}
									className={`mr-1 ${!trend.positive ? 'rotate-180' : ''}`}
								/>
								{trend.value}
							</Badge>
						)}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

interface StatCardsProps {
	streak: number;
	sessionHours: number;
	rank: number;
	streakTrend?: number;
	rankTrend?: number;
}

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.1,
		},
	},
};

export function StatCards({
	streak,
	sessionHours,
	rank: _rank,
	streakTrend,
	rankTrend: _rankTrend,
}: StatCardsProps): React.ReactElement {
	return (
		<motion.div
			className="grid grid-cols-1 md:grid-cols-3 gap-8"
			variants={containerVariants}
			initial="hidden"
			animate="visible"
		>
			<StatCard
				label="Current Streak"
				value={String(streak)}
				unit="days"
				icon={Flame}
				iconColor="text-primary"
				trend={
					streakTrend
						? { value: `+${streakTrend}`, positive: true }
						: undefined
				}
			/>
			<StatCard
				label="Session Hours"
				value={sessionHours.toFixed(1)}
				unit="hrs"
				icon={Clock}
				iconColor="text-secondary"
			/>
			<StatCard
				label="Global Rank"
				value="Coming Soon"
				icon={Trophy}
				iconColor="text-yellow-400"
			/>
		</motion.div>
	);
}
