'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import {
	Lightning,
	SquaresFour,
	ChartLineUp,
	Timer,
	PersonSimpleRun,
	Gear,
	Play,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
	{ label: 'Dashboard', href: '/dashboard', icon: SquaresFour },
	{
		label: 'Analytics',
		href: '/dashboard/analytics',
		icon: ChartLineUp,
	},
	{
		label: 'Focus Sessions',
		href: '/dashboard/sessions',
		icon: Timer,
	},
	{
		label: 'Posture Health',
		href: '/dashboard/posture',
		icon: PersonSimpleRun,
	},
	{ label: 'Settings', href: '/dashboard/settings', icon: Gear },
];

export function Sidebar(): React.ReactElement {
	const pathname = usePathname();

	return (
		<aside className="w-64 border-r border-border flex flex-col fixed h-full bg-sidebar z-20">
			{/* Logo */}
			<div className="h-20 flex items-center px-8 border-b border-border">
				<Link
					href="/dashboard"
					className="flex items-center gap-3"
				>
					<div className="w-8 h-8 bg-primary flex items-center justify-center">
						<Lightning
							weight="fill"
							className="text-primary-foreground text-xl"
						/>
					</div>
					<span className="font-display font-bold text-xl tracking-tight">
						LUMIIN
					</span>
				</Link>
			</div>

			{/* Start Session Button */}
			<div className="px-4 pt-6 pb-2">
				<Link
					href="/focus"
					className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-primary-foreground font-medium transition-all hover:opacity-90"
				>
					<Play size={18} weight="fill" />
					Start Session
				</Link>
			</div>

			{/* Navigation */}
			<nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
				{NAV_ITEMS.map((item) => {
					const isActive = pathname === item.href;
					const Icon = item.icon;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								'flex items-center gap-4 px-4 py-3 transition-colors',
								isActive
									? 'bg-accent text-primary font-medium border border-border'
									: 'text-muted-foreground hover:text-foreground hover:bg-accent'
							)}
						>
							<Icon
								size={20}
								weight={isActive ? 'fill' : 'regular'}
							/>
							{item.label}
						</Link>
					);
				})}
			</nav>

			{/* User Footer */}
			<div className="p-4 border-t border-border">
				<div className="flex items-center gap-3 px-4 py-3">
					<UserButton
						appearance={{
							elements: {
								avatarBox: 'w-8 h-8',
							},
						}}
					/>
					<div className="flex flex-col">
						<span className="text-sm font-medium">
							Account
						</span>
						<span className="text-xs text-muted-foreground">
							Pro Plan
						</span>
					</div>
				</div>
			</div>
		</aside>
	);
}
