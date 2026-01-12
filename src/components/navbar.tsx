'use client';

import { useState } from 'react';
import Link from 'next/link';
import { List, X } from '@phosphor-icons/react';
import { useAuth, useUser, SignOutButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export function Navbar(): React.ReactElement {
	const { isSignedIn } = useAuth();
	const { user } = useUser();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<>
			<nav className="fixed w-full z-50 bg-[#0a0a0a] border-b border-border transition-colors duration-300">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-20">
						{/* Logo */}
						<Link
							href="/"
							className="flex-shrink-0 flex items-center gap-2"
						>
							<div className="w-8 h-8 bg-primary flex items-center justify-center text-primary-foreground font-bold">
								L
							</div>
							<span className="font-bold text-xl tracking-tight text-foreground">
								Lumiin
							</span>
						</Link>

						{/* Desktop Nav */}
						<div className="hidden md:flex space-x-8 items-center">
							<a
								className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
								href="#features"
							>
								Features
							</a>
							<a
								className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
								href="#pricing"
							>
								Pricing
							</a>
							{isSignedIn ? (
								<>
									<span className="text-sm text-muted-foreground">
										{
											user?.primaryEmailAddress
												?.emailAddress
										}
									</span>
									<SignOutButton>
										<button className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
											Sign Out
										</button>
									</SignOutButton>
								</>
							) : (
								<Link
									href="/sign-in"
									className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
								>
									Log in
								</Link>
							)}
							<Button asChild>
								<Link
									href={
										isSignedIn
											? '/dashboard'
											: '/sign-up'
									}
								>
									{isSignedIn
										? 'Dashboard'
										: 'Get Started'}
								</Link>
							</Button>
						</div>

						{/* Mobile Toggle */}
						<div className="md:hidden flex items-center">
							<button
								onClick={() =>
									setIsMobileMenuOpen(
										!isMobileMenuOpen
									)
								}
								className="text-muted-foreground hover:text-foreground focus:outline-none p-2"
								aria-label="Toggle menu"
							>
								{isMobileMenuOpen ? (
									<X size={24} weight="bold" />
								) : (
									<List size={24} weight="bold" />
								)}
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* Mobile Menu Overlay */}
			{isMobileMenuOpen && (
				<div className="fixed inset-0 z-40 bg-background md:hidden">
					<div className="flex justify-between items-center p-4 border-b border-border">
						<Link
							href="/"
							className="flex items-center gap-2"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							<div className="w-8 h-8 bg-primary flex items-center justify-center text-primary-foreground font-bold">
								L
							</div>
							<span className="font-bold text-xl tracking-tight text-foreground">
								Lumiin
							</span>
						</Link>
						<button
							onClick={() => setIsMobileMenuOpen(false)}
							className="text-muted-foreground hover:text-foreground p-2"
							aria-label="Close menu"
						>
							<X size={24} weight="bold" />
						</button>
					</div>
					<nav className="flex flex-col items-center space-y-6 pt-12">
						<a
							href="#features"
							className="text-2xl font-medium text-foreground hover:text-primary transition-colors"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Features
						</a>
						<a
							href="#pricing"
							className="text-2xl font-medium text-foreground hover:text-primary transition-colors"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Pricing
						</a>
						{isSignedIn ? (
							<>
								<SignOutButton>
									<button
										onClick={() =>
											setIsMobileMenuOpen(false)
										}
										className="text-2xl font-medium text-foreground hover:text-primary transition-colors"
									>
										Sign Out
									</button>
								</SignOutButton>
							</>
						) : (
							<Link
								href="/sign-in"
								className="text-2xl font-medium text-foreground hover:text-primary transition-colors"
								onClick={() =>
									setIsMobileMenuOpen(false)
								}
							>
								Log in
							</Link>
						)}
						<Button asChild size="lg" className="mt-4">
							<Link
								href={
									isSignedIn
										? '/dashboard'
										: '/sign-up'
								}
								onClick={() =>
									setIsMobileMenuOpen(false)
								}
							>
								{isSignedIn
									? 'Dashboard'
									: 'Get Started'}
							</Link>
						</Button>
					</nav>
				</div>
			)}
		</>
	);
}
