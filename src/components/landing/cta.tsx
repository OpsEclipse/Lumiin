'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircleNotch } from '@phosphor-icons/react';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export function CTA(): React.ReactElement {
	const { isSignedIn } = useAuth();
	const router = useRouter();
	const [isNavigating, setIsNavigating] = useState(false);

	const handleStartFree = () => {
		setIsNavigating(true);
		router.push(isSignedIn ? '/dashboard' : '/sign-up');
	};

	return (
		<section className="py-24 bg-card relative">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<h2 className="text-4xl md:text-5xl uppercase tracking-widest font-light text-foreground mb-6">
					Ready to master your focus?
				</h2>
				<p className="text-xl text-muted-foreground mb-10">
					Join thousands of developers, designers, and
					writers who use Lumiin to stay healthy and
					productive.
				</p>

				<Button
					onClick={handleStartFree}
					disabled={isNavigating}
					size="lg"
					className="px-12 py-6 text-lg shadow-xl shadow-primary/25 disabled:opacity-50"
				>
					{isNavigating && (
						<CircleNotch
							size={20}
							weight="bold"
							className="mr-2 animate-spin"
						/>
					)}
					Start for Free
				</Button>

				<p className="mt-6 text-sm text-muted-foreground">
					100% free. No hidden costs. Forever.
				</p>
			</div>
		</section>
	);
}
