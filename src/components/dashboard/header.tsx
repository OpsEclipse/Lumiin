'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlayCircle, CircleNotch } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
	title: string;
}

export function DashboardHeader({
	title,
}: DashboardHeaderProps): React.ReactElement {
	const router = useRouter();
	const [isNavigating, setIsNavigating] = useState(false);

	const handleStartSession = () => {
		setIsNavigating(true);
		router.push('/focus');
	};

	return (
		<header className="h-20 flex items-center justify-between px-8 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
			<h1 className="text-2xl font-display font-light uppercase tracking-widest">
				{title}
			</h1>

			<Button
				onClick={handleStartSession}
				disabled={isNavigating}
				className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-2 flex items-center gap-2 disabled:opacity-50"
			>
				{isNavigating ? (
					<CircleNotch
						size={18}
						weight="bold"
						className="animate-spin"
					/>
				) : (
					<PlayCircle size={18} weight="fill" />
				)}
				Start New Session
			</Button>
		</header>
	);
}
