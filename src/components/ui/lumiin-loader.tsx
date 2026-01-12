import { cn } from '@/lib/utils';

interface LumiinLoaderProps {
	className?: string;
	size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function LumiinLoader({
	className,
	size = 'md',
}: LumiinLoaderProps) {
	const sizeClasses = {
		sm: 'text-2xl',
		md: 'text-4xl',
		lg: 'text-6xl',
		xl: 'text-8xl',
	};

	return (
		<div
			className={cn(
				'flex items-center justify-center font-display font-bold tracking-tight select-none',
				sizeClasses[size],
				className
			)}
			aria-label="Loading Lumiin"
			role="status"
		>
			<span
				className="animate-shimmer-text bg-[linear-gradient(110deg,var(--primary)_35%,#ffffff_50%,var(--primary)_65%)] bg-clip-text text-transparent"
				style={{
					backgroundSize: '200% 100%',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
				}}
			>
				Lumiin
			</span>
		</div>
	);
}
