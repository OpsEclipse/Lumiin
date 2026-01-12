'use client';

import Link from 'next/link';
import { ArrowRight, PlayCircle } from '@phosphor-icons/react';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export function Hero(): React.ReactElement {
	const { isSignedIn } = useAuth();

	return (
		<section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
			{/* Background Effects */}
			<div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 blur-3xl" />
			<div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/10 blur-3xl" />
			<div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					{/* Left: Text Content */}
					<div>
						{/* Status Badge */}
						<div className="inline-flex items-center gap-2 px-3 py-1 bg-card border border-border mb-6">
							<span className="flex h-2 w-2 relative">
								<span className="animate-ping absolute inline-flex h-full w-full bg-secondary opacity-75" />
								<span className="relative inline-flex h-2 w-2 bg-secondary" />
							</span>
							<span className="text-xs uppercase tracking-widest text-muted-foreground">
								AI-Powered Focus Tracking
							</span>
						</div>

						{/* Headline */}
						<h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
							Your Biometric{' '}
							<br className="hidden lg:block" />
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
								Accountability
							</span>{' '}
							Partner
						</h1>

						{/* Description */}
						<p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
							Lumiin uses privacy-first computer vision
							to monitor your posture and focus in
							real-time. Build healthier habits while
							you work, without wearing a device.
						</p>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-4">
							<Button
								asChild
								size="lg"
								className="text-lg px-8 py-6 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all group"
							>
								<Link
									href={
										isSignedIn
											? '/dashboard'
											: '/sign-up'
									}
								>
									Get Started Free
									<ArrowRight
										size={20}
										weight="bold"
										className="ml-2 group-hover:translate-x-1 transition-transform"
									/>
								</Link>
							</Button>
							<Button
								asChild
								variant="outline"
								size="lg"
								className="text-lg px-8 py-6"
							>
								<a href="#features">
									<PlayCircle
										size={20}
										weight="fill"
										className="mr-2 text-muted-foreground"
									/>
									How it works
								</a>
							</Button>
						</div>

						{/* Social Proof */}
						<div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
							<div className="flex -space-x-2">
								<div className="inline-block h-8 w-8 ring-2 ring-background bg-gradient-to-br from-blue-400 to-purple-500" />
								<div className="inline-block h-8 w-8 ring-2 ring-background bg-gradient-to-br from-green-400 to-cyan-500" />
								<div className="inline-block h-8 w-8 ring-2 ring-background bg-gradient-to-br from-orange-400 to-red-500" />
							</div>
							<p>Trusted by 10,000+ deep workers</p>
						</div>
					</div>

					{/* Right: Laptop Mockup */}
					<div className="relative lg:h-[600px] flex items-center justify-center">
						{/* Decorative Rings */}
						<div className="absolute z-0 w-[500px] h-[500px] border border-border opacity-50" />
						<div className="absolute z-0 w-[400px] h-[400px] border border-border opacity-50" />
						<div className="absolute z-0 w-[300px] h-[300px] border border-border opacity-50" />

						{/* Laptop Screen */}
						<div className="relative w-full max-w-md aspect-video bg-card border-4 border-border shadow-2xl overflow-hidden z-20">
							{/* Background gradient */}
							<div className="absolute inset-0 bg-gradient-to-br from-card via-muted to-card" />

							{/* CV Overlay SVG */}
							<svg
								className="absolute inset-0 w-full h-full text-primary pointer-events-none"
								fill="none"
								viewBox="0 0 400 300"
								xmlns="http://www.w3.org/2000/svg"
							>
								{/* Head circle */}
								<circle
									className="animate-pulse-slow"
									cx="200"
									cy="100"
									r="35"
									stroke="currentColor"
									strokeDasharray="4 4"
									strokeWidth="1.5"
								/>

								{/* Body lines */}
								<path
									d="M200 135 L200 200"
									stroke="currentColor"
									strokeOpacity="0.5"
									strokeWidth="1.5"
								/>
								<path
									d="M160 180 L200 155 L240 180"
									stroke="currentColor"
									strokeOpacity="0.5"
									strokeWidth="1.5"
								/>
								<path
									d="M170 250 L200 200 L230 250"
									stroke="currentColor"
									strokeOpacity="0.5"
									strokeWidth="1.5"
								/>

								{/* Landmark dots */}
								<circle
									className="text-secondary"
									cx="200"
									cy="100"
									fill="currentColor"
									r="3"
								/>
								<circle
									cx="185"
									cy="95"
									fill="currentColor"
									r="2"
								/>
								<circle
									cx="215"
									cy="95"
									fill="currentColor"
									r="2"
								/>
								<circle
									cx="200"
									cy="110"
									fill="currentColor"
									r="2"
								/>
							</svg>

							{/* Posture Status Badge */}
							<div className="absolute top-4 right-4 bg-background/60 backdrop-blur-sm px-3 py-1 text-xs font-mono text-primary border border-primary/30 flex items-center gap-2">
								<span className="w-2 h-2 bg-success animate-pulse" />
								POSTURE: GOOD
							</div>

							{/* Focus Score Bar */}
							<div className="absolute bottom-4 left-4 right-4 bg-background/60 backdrop-blur-sm p-3 border border-border">
								<div className="flex justify-between text-xs text-muted-foreground font-mono mb-1">
									<span>FOCUS SCORE</span>
									<span className="text-secondary">
										94%
									</span>
								</div>
								<div className="h-1 w-full bg-muted overflow-hidden">
									<div className="h-full bg-gradient-to-r from-primary to-secondary w-[94%]" />
								</div>
							</div>
						</div>

						{/* Laptop Base */}
						<div className="absolute bottom-[calc(50%-130px)] w-24 h-4 bg-muted z-10" />
						{/* Laptop Stand */}
						<div className="absolute bottom-[calc(50%-140px)] w-48 h-3 bg-muted-foreground z-10 shadow-xl" />
					</div>
				</div>
			</div>
		</section>
	);
}
