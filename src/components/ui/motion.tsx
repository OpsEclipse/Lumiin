'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

// ============================================
// Page Transition Wrapper
// ============================================
// Wrap page content to get fade + slide-up effect on mount

const pageVariants: Variants = {
	hidden: {
		opacity: 0,
		y: 12,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.4,
			ease: [0.25, 0.1, 0.25, 1], // Smooth ease-out
		},
	},
	exit: {
		opacity: 0,
		y: -8,
		transition: {
			duration: 0.2,
			ease: 'easeIn',
		},
	},
};

interface PageTransitionProps {
	children: ReactNode;
	className?: string;
}

export function PageTransition({
	children,
	className,
}: PageTransitionProps) {
	return (
		<motion.div
			initial="hidden"
			animate="visible"
			exit="exit"
			variants={pageVariants}
			className={className}
		>
			{children}
		</motion.div>
	);
}

// ============================================
// Staggered Container & Item
// ============================================
// Use StaggerContainer to wrap a list, and StaggerItem for each child
// The children will animate in one after another

const staggerContainerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.1,
		},
	},
};

const staggerItemVariants: Variants = {
	hidden: {
		opacity: 0,
		y: 16,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.35,
			ease: [0.25, 0.1, 0.25, 1],
		},
	},
};

interface StaggerContainerProps {
	children: ReactNode;
	className?: string;
	delay?: number;
}

export function StaggerContainer({
	children,
	className,
	delay = 0.1,
}: StaggerContainerProps) {
	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={{
				...staggerContainerVariants,
				visible: {
					...staggerContainerVariants.visible,
					transition: {
						staggerChildren: 0.08,
						delayChildren: delay,
					},
				},
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}

interface StaggerItemProps {
	children: ReactNode;
	className?: string;
}

export function StaggerItem({
	children,
	className,
}: StaggerItemProps) {
	return (
		<motion.div
			variants={staggerItemVariants}
			className={className}
		>
			{children}
		</motion.div>
	);
}

// ============================================
// Fade In
// ============================================
// Simple fade-in animation for individual elements

const fadeInVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			duration: 0.4,
			ease: 'easeOut',
		},
	},
};

interface FadeInProps {
	children: ReactNode;
	className?: string;
	delay?: number;
}

export function FadeIn({
	children,
	className,
	delay = 0,
}: FadeInProps) {
	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={{
				hidden: fadeInVariants.hidden,
				visible: {
					...fadeInVariants.visible,
					transition: {
						duration: 0.4,
						ease: 'easeOut',
						delay,
					},
				},
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}

// ============================================
// Scale In
// ============================================
// Subtle scale + fade for cards and panels

const scaleInVariants: Variants = {
	hidden: {
		opacity: 0,
		scale: 0.96,
	},
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.3,
			ease: [0.25, 0.1, 0.25, 1],
		},
	},
};

interface ScaleInProps {
	children: ReactNode;
	className?: string;
	delay?: number;
}

export function ScaleIn({
	children,
	className,
	delay = 0,
}: ScaleInProps) {
	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={{
				hidden: scaleInVariants.hidden,
				visible: {
					...scaleInVariants.visible,
					transition: {
						duration: 0.3,
						ease: [0.25, 0.1, 0.25, 1],
						delay,
					},
				},
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}
