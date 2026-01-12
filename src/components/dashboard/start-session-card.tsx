import Link from 'next/link';
import {
	Play,
	Lightning,
	Clock,
} from '@phosphor-icons/react/dist/ssr';

interface StartSessionCardProps {
	lastSessionDaysAgo?: number;
}

export function StartSessionCard({
	lastSessionDaysAgo,
}: StartSessionCardProps): React.ReactElement {
	return (
		<div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 bg-primary/20 flex items-center justify-center">
						<Lightning
							weight="fill"
							className="text-primary text-2xl"
						/>
					</div>
					<div>
						<h2 className="text-lg font-medium text-foreground">
							Ready to Focus?
						</h2>
						<p className="text-sm text-muted-foreground">
							{lastSessionDaysAgo === 0
								? 'Keep your streak going!'
								: lastSessionDaysAgo === 1
									? 'Continue your streak from yesterday'
									: lastSessionDaysAgo &&
										  lastSessionDaysAgo > 1
										? `${lastSessionDaysAgo} days since your last session`
										: 'Start your first focus session'}
						</p>
					</div>
				</div>

				<Link
					href="/focus"
					className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium transition-all hover:opacity-90 group"
				>
					<Play size={18} weight="fill" />
					<span>Start Session</span>
				</Link>
			</div>

			{/* Quick stats */}
			<div className="flex gap-6 mt-4 pt-4 border-t border-border/50">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Clock size={16} />
					<span>No time limit</span>
				</div>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Lightning size={16} />
					<span>Posture tracking enabled</span>
				</div>
			</div>
		</div>
	);
}
