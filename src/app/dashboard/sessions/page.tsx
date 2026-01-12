'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { PlayCircle } from '@phosphor-icons/react';
import {
	SessionHistoryTable,
	DashboardHeader,
} from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import {
	getSessionsPageData,
	type DetailedSession,
} from '@/lib/dashboard-data';
import Link from 'next/link';
import { LumiinLoader } from '@/components/ui/lumiin-loader';
import { motion } from 'framer-motion';

export default function SessionsPage(): React.ReactElement {
	const { userId, isLoaded } = useAuth();
	const [sessions, setSessions] = useState<DetailedSession[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);

	const pageSize = 10;

	const fetchSessions = useCallback(async () => {
		if (!userId) return;

		setIsLoading(true);
		try {
			const data = await getSessionsPageData(userId, {
				page: currentPage,
				limit: pageSize,
				sortBy: 'date',
				sortOrder: 'desc',
			});
			setSessions(data.sessions);
			setTotalCount(data.totalCount);
		} catch (error) {
			console.error('Error fetching sessions:', error);
		} finally {
			setIsLoading(false);
		}
	}, [userId, currentPage]);

	useEffect(() => {
		if (isLoaded && userId) {
			fetchSessions();
		}
	}, [isLoaded, userId, fetchSessions]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (!isLoaded) {
		return (
			<>
				<DashboardHeader title="Sessions" />
				<div className="flex items-center justify-center min-h-[60vh]">
					<LumiinLoader size="lg" />
				</div>
			</>
		);
	}

	if (!userId) {
		return (
			<>
				<DashboardHeader title="Sessions" />
				<div className="p-8">
					<p className="text-muted-foreground">
						Please sign in to view your sessions.
					</p>
				</div>
			</>
		);
	}

	return (
		<>
			{/* Header with start button */}
			<header className="h-20 flex items-center justify-between px-8 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
				<h1 className="text-2xl font-display font-light uppercase tracking-widest">
					Sessions
				</h1>
				<Link href="/focus">
					<Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-2 flex items-center gap-2">
						<PlayCircle size={18} weight="fill" />
						Start New Session
					</Button>
				</Link>
			</header>

			{/* Main content */}
			<motion.div
				className="p-8 max-w-7xl mx-auto space-y-10"
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.35, ease: 'easeOut' }}
			>
				{/* Session History Table */}
				<section>
					{isLoading ? (
						<div className="flex items-center justify-center h-64 border border-border bg-card/50">
							<LumiinLoader size="md" />
						</div>
					) : (
						<SessionHistoryTable
							sessions={sessions}
							totalCount={totalCount}
							currentPage={currentPage}
							pageSize={pageSize}
							onPageChange={handlePageChange}
						/>
					)}
				</section>
			</motion.div>

			{/* Footer */}
			<footer className="border-t border-border p-8 mt-4 text-center">
				<p className="text-xs text-muted-foreground uppercase tracking-widest">
					Lumiin Analytics © {new Date().getFullYear()}
				</p>
			</footer>
		</>
	);
}
