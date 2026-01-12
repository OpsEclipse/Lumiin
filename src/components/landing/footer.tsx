import Link from 'next/link';
import { GithubLogo } from '@phosphor-icons/react';
import { Separator } from '@/components/ui/separator';

export function Footer(): React.ReactElement {
	return (
		<footer className="bg-background border-t border-border pt-16 pb-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
					{/* Logo & Location */}
					<div>
						<Link
							href="/"
							className="flex items-center gap-2 mb-4"
						>
							<div className="w-6 h-6 bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
								L
							</div>
							<span className="font-bold text-lg tracking-tight text-foreground">
								Lumiin
							</span>
						</Link>
						<p className="text-sm text-muted-foreground">
							Toronto, Ontario
							<br />
							Designed for the future of work.
						</p>
					</div>

					{/* GitHub Link */}
					<div>
						<h4 className="uppercase tracking-widest text-sm text-foreground mb-4">
							Connect
						</h4>
						<a
							className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
							href="https://github.com/OpsEclipse/Lumiin"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="GitHub"
						>
							<GithubLogo size={24} weight="regular" />
							<span className="text-sm">
								View on GitHub
							</span>
						</a>
					</div>
				</div>

				{/* Bottom Bar */}
				<Separator className="mb-8" />
				<div className="text-center text-xs text-muted-foreground">
					<p>© 2025 Lumiin. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
