'use client';

import { PlayCircle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface DashboardHeaderProps {
	title: string;
}

export function DashboardHeader({
	title,
}: DashboardHeaderProps): React.ReactElement {
	return (
		<header className="h-20 flex items-center justify-between px-8 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
			<h1 className="text-2xl font-display font-light uppercase tracking-widest">
				{title}
			</h1>

			<Link href="/focus">
				<Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-2 flex items-center gap-2">
					<PlayCircle size={18} weight="fill" />
					Start New Session
				</Button>
			</Link>
		</header>
	);
}
