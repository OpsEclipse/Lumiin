'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	CheckCircle,
	Sparkle,
	CircleNotch,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';

const features = [
	'Unlimited Sessions',
	'Real-time Posture Tracking',
	'AI-Powered Analytics',
	'Posture Trends & Insights',
	'Session History & Reports',
	'Customizable Alerts',
	'Focus Heatmap',
	'Weekly Performance Charts',
	'Privacy-First (No Video Upload)',
	'All Future Updates',
];

export function Pricing(): React.ReactElement {
	const { isSignedIn } = useAuth();
	const router = useRouter();
	const [isNavigating, setIsNavigating] = useState(false);

	const handleStartFree = () => {
		setIsNavigating(true);
		router.push(isSignedIn ? '/dashboard' : '/sign-up');
	};

	return (
		<section
			className="py-24 bg-gradient-to-b from-background to-card relative overflow-hidden"
			id="pricing"
		>
			{/* Background Effects */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-3xl" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				{/* Section Header */}
				<div className="text-center mb-16">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 mb-6">
						<Sparkle
							size={16}
							weight="fill"
							className="text-primary"
						/>
						<span className="text-xs uppercase tracking-widest text-primary font-semibold">
							No Hidden Costs
						</span>
					</div>
					<h2 className="text-5xl md:text-6xl uppercase tracking-widest font-bold text-foreground mb-4">
						100% Free
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Everything you need to improve your posture
						and focus.{' '}
						<span className="text-primary font-semibold">
							Forever free.
						</span>
					</p>
				</div>

				{/* Single Pricing Card - Centered */}
				<div className="max-w-xl mx-auto">
					<div className="relative">
						{/* Gradient Border Effect */}
						<div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-75 blur-lg" />

						{/* Main Card */}
						<div className="relative bg-card border-2 border-primary/50 shadow-2xl p-10">
							{/* Top Accent Bar */}
							<div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary" />

							{/* Header */}
							<div className="text-center mb-8">
								<h3 className="text-3xl uppercase tracking-widest font-bold text-foreground mb-2">
									Free Forever
								</h3>
								<p className="text-muted-foreground">
									All features. No limitations. No
									credit card.
								</p>
							</div>

							{/* Price */}
							<div className="text-center mb-8">
								<div className="inline-flex items-baseline">
									<span className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
										$0
									</span>
									<span className="text-2xl text-muted-foreground ml-2">
										/forever
									</span>
								</div>
							</div>

							{/* Features Grid */}
							<div className="mb-8">
								<p className="text-sm uppercase tracking-widest text-muted-foreground mb-4 text-center font-semibold">
									Everything Included
								</p>
								<ul className="grid grid-cols-1 gap-3">
									{features.map((feature) => (
										<li
											key={feature}
											className="flex items-center text-sm text-foreground"
										>
											<CheckCircle
												size={20}
												weight="fill"
												className="mr-3 text-primary flex-shrink-0"
											/>
											<span>{feature}</span>
										</li>
									))}
								</ul>
							</div>

							{/* CTA Button */}
							<Button
								onClick={handleStartFree}
								disabled={isNavigating}
								size="lg"
								className="w-full text-lg py-6 shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all disabled:opacity-50"
							>
								{isNavigating && (
									<CircleNotch
										size={20}
										weight="bold"
										className="mr-2 animate-spin"
									/>
								)}
								Start Using Lumiin Free
							</Button>

							{/* Footer Note */}
							<p className="text-center text-xs text-muted-foreground mt-6">
								No tricks. No trials. Just free,
								forever. 🎉
							</p>
						</div>
					</div>
				</div>

				{/* Additional Emphasis */}
				<div className="mt-16 text-center">
					<p className="text-sm text-muted-foreground max-w-2xl mx-auto">
						We believe great posture and focus should be
						accessible to everyone.{' '}
						<span className="text-primary font-semibold">
							That's why Lumiin will always be free.
						</span>{' '}
						No premium tiers, no paywalls, no surprises.
					</p>
				</div>
			</div>
		</section>
	);
}
