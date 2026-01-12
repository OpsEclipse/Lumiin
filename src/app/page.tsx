'use client';

import { Navbar } from '@/components/navbar';
import {
	Hero,
	SocialProof,
	Features,
	Privacy,
	FocusGlow,
	Pricing,
	CTA,
	Footer,
} from '@/components/landing';

export default function Home(): React.ReactElement {
	return (
		<>
			<Navbar />
			<main>
				<Hero />
				<SocialProof />
				<Features />
				<Privacy />
				<FocusGlow />
				<Pricing />
				<CTA />
			</main>
			<Footer />
		</>
	);
}
