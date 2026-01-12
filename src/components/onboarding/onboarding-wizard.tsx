'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
	Lightning,
	User,
	Target,
	Timer,
	ArrowRight,
	ArrowLeft,
	CheckCircle,
} from '@phosphor-icons/react';

interface OnboardingData {
	firstName: string;
	lastName: string;
	primaryGoal: 'focus' | 'posture' | 'both' | null;
	dailyTarget: 25 | 50 | 90 | null;
}

const STEPS = [
	{ id: 'name', title: "What's your name?", icon: User },
	{ id: 'goal', title: "What's your primary goal?", icon: Target },
	{
		id: 'target',
		title: 'How long do you want to focus?',
		icon: Timer,
	},
	{ id: 'complete', title: "You're all set!", icon: CheckCircle },
];

export function OnboardingWizard(): React.ReactElement {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [data, setData] = useState<OnboardingData>({
		firstName: '',
		lastName: '',
		primaryGoal: null,
		dailyTarget: null,
	});

	const canProceed = (): boolean => {
		switch (currentStep) {
			case 0:
				return data.firstName.trim().length > 0;
			case 1:
				return data.primaryGoal !== null;
			case 2:
				return data.dailyTarget !== null;
			default:
				return true;
		}
	};

	const handleNext = async (): Promise<void> => {
		if (currentStep < STEPS.length - 1) {
			setCurrentStep((prev) => prev + 1);
		}
	};

	const handleBack = (): void => {
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	const handleComplete = async (): Promise<void> => {
		setIsSubmitting(true);
		try {
			const timezone =
				Intl.DateTimeFormat().resolvedOptions().timeZone;

			const response = await fetch('/api/profile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					firstName: data.firstName.trim(),
					lastName: data.lastName.trim(),
					primaryGoal: data.primaryGoal,
					dailyTarget: data.dailyTarget,
					timezone,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error('API Error:', errorData);
				throw new Error('Failed to save profile');
			}

			// Use hard redirect to ensure middleware re-evaluates
			window.location.href = '/dashboard';
		} catch (error) {
			console.error('Onboarding error:', error);
			setIsSubmitting(false);
		}
	};

	const slideVariants = {
		enter: (direction: number) => ({
			x: direction > 0 ? 100 : -100,
			opacity: 0,
		}),
		center: {
			x: 0,
			opacity: 1,
		},
		exit: (direction: number) => ({
			x: direction < 0 ? 100 : -100,
			opacity: 0,
		}),
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<div className="w-full max-w-lg">
				{/* Logo */}
				<div className="flex items-center justify-center gap-3 mb-12">
					<div className="w-10 h-10 bg-primary flex items-center justify-center">
						<Lightning
							size={24}
							weight="bold"
							className="text-primary-foreground"
						/>
					</div>
					<span className="font-bold text-2xl tracking-tight">
						LUMIIN
					</span>
				</div>

				{/* Progress Bar */}
				<div className="flex gap-2 mb-8">
					{STEPS.map((_, index) => (
						<div
							key={index}
							className={`h-1 flex-1 transition-colors duration-300 ${
								index <= currentStep
									? 'bg-primary'
									: 'bg-border'
							}`}
						/>
					))}
				</div>

				{/* Card */}
				<Card className="border-border">
					<CardContent className="p-8">
						<AnimatePresence mode="wait" custom={1}>
							<motion.div
								key={currentStep}
								custom={1}
								variants={slideVariants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{
									duration: 0.3,
									ease: 'easeInOut',
								}}
							>
								{/* Step 1: Name */}
								{currentStep === 0 && (
									<div className="space-y-6">
										<div className="text-center mb-8">
											<User
												size={48}
												className="mx-auto text-primary mb-4"
											/>
											<h2 className="text-2xl font-bold">
												{STEPS[0].title}
											</h2>
											<p className="text-muted-foreground mt-2">
												Let's personalize your
												experience
											</p>
										</div>
										<div className="space-y-4">
											<div>
												<label className="text-sm uppercase tracking-widest text-muted-foreground mb-2 block">
													First Name
												</label>
												<Input
													placeholder="Enter your first name"
													value={
														data.firstName
													}
													onChange={(e) =>
														setData(
															(
																prev
															) => ({
																...prev,
																firstName:
																	e
																		.target
																		.value,
															})
														)
													}
													className="h-12 text-lg"
													autoFocus
												/>
											</div>
											<div>
												<label className="text-sm uppercase tracking-widest text-muted-foreground mb-2 block">
													Last Name
													(optional)
												</label>
												<Input
													placeholder="Enter your last name"
													value={
														data.lastName
													}
													onChange={(e) =>
														setData(
															(
																prev
															) => ({
																...prev,
																lastName:
																	e
																		.target
																		.value,
															})
														)
													}
													className="h-12 text-lg"
												/>
											</div>
										</div>
									</div>
								)}

								{/* Step 2: Goal */}
								{currentStep === 1 && (
									<div className="space-y-6">
										<div className="text-center mb-8">
											<Target
												size={48}
												className="mx-auto text-primary mb-4"
											/>
											<h2 className="text-2xl font-bold">
												{STEPS[1].title}
											</h2>
											<p className="text-muted-foreground mt-2">
												We'll customize Lumiin
												for you
											</p>
										</div>
										<div className="space-y-3">
											{[
												{
													value: 'focus',
													label: 'Improve Focus',
													desc: 'Stay concentrated and productive',
												},
												{
													value: 'posture',
													label: 'Better Posture',
													desc: 'Maintain healthy alignment',
												},
												{
													value: 'both',
													label: 'Both',
													desc: 'Full biometric accountability',
												},
											].map((option) => (
												<button
													key={option.value}
													onClick={() =>
														setData(
															(
																prev
															) => ({
																...prev,
																primaryGoal:
																	option.value as OnboardingData['primaryGoal'],
															})
														)
													}
													className={`w-full p-4 border text-left transition-all ${
														data.primaryGoal ===
														option.value
															? 'border-primary bg-primary/10'
															: 'border-border hover:border-primary/50'
													}`}
												>
													<div className="font-medium">
														{option.label}
													</div>
													<div className="text-sm text-muted-foreground">
														{option.desc}
													</div>
												</button>
											))}
										</div>
									</div>
								)}

								{/* Step 3: Daily Target */}
								{currentStep === 2 && (
									<div className="space-y-6">
										<div className="text-center mb-8">
											<Timer
												size={48}
												className="mx-auto text-primary mb-4"
											/>
											<h2 className="text-2xl font-bold">
												{STEPS[2].title}
											</h2>
											<p className="text-muted-foreground mt-2">
												Set your default
												session length
											</p>
										</div>
										<div className="grid grid-cols-3 gap-4">
											{[
												{
													value: 25,
													label: '25 min',
													desc: 'Pomodoro',
												},
												{
													value: 50,
													label: '50 min',
													desc: 'Standard',
												},
												{
													value: 90,
													label: '90 min',
													desc: 'Deep Work',
												},
											].map((option) => (
												<button
													key={option.value}
													onClick={() =>
														setData(
															(
																prev
															) => ({
																...prev,
																dailyTarget:
																	option.value as OnboardingData['dailyTarget'],
															})
														)
													}
													className={`p-4 border text-center transition-all ${
														data.dailyTarget ===
														option.value
															? 'border-primary bg-primary/10'
															: 'border-border hover:border-primary/50'
													}`}
												>
													<div className="text-2xl font-light">
														{option.label}
													</div>
													<div className="text-xs text-muted-foreground mt-1">
														{option.desc}
													</div>
												</button>
											))}
										</div>
									</div>
								)}

								{/* Step 4: Complete */}
								{currentStep === 3 && (
									<div className="text-center py-8">
										<CheckCircle
											size={64}
											className="mx-auto text-success mb-6"
											weight="fill"
										/>
										<h2 className="text-2xl font-bold mb-2">
											Welcome, {data.firstName}!
										</h2>
										<p className="text-muted-foreground mb-8">
											Your profile is ready.
											Let's start building
											better focus habits.
										</p>
										<div className="bg-muted p-4 text-left space-y-2">
											<div className="flex justify-between text-sm">
												<span className="text-muted-foreground">
													Goal
												</span>
												<span className="capitalize">
													{data.primaryGoal}
												</span>
											</div>
											<div className="flex justify-between text-sm">
												<span className="text-muted-foreground">
													Session Length
												</span>
												<span>
													{data.dailyTarget}{' '}
													minutes
												</span>
											</div>
										</div>
									</div>
								)}
							</motion.div>
						</AnimatePresence>

						{/* Navigation */}
						<div className="flex justify-between mt-8 pt-6 border-t border-border">
							<Button
								variant="ghost"
								onClick={handleBack}
								disabled={currentStep === 0}
								className={
									currentStep === 0
										? 'invisible'
										: ''
								}
							>
								<ArrowLeft
									size={16}
									className="mr-2"
								/>
								Back
							</Button>

							{currentStep < STEPS.length - 1 ? (
								<Button
									onClick={handleNext}
									disabled={!canProceed()}
									className="bg-primary hover:bg-primary/90"
								>
									Continue
									<ArrowRight
										size={16}
										className="ml-2"
									/>
								</Button>
							) : (
								<Button
									onClick={handleComplete}
									disabled={isSubmitting}
									className="bg-primary hover:bg-primary/90"
								>
									{isSubmitting
										? 'Saving...'
										: 'Get Started'}
									<ArrowRight
										size={16}
										className="ml-2"
									/>
								</Button>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Skip */}
				{currentStep < STEPS.length - 1 && (
					<p className="text-center text-sm text-muted-foreground mt-6">
						<button
							onClick={() =>
								setCurrentStep(STEPS.length - 1)
							}
							className="hover:text-foreground transition-colors"
						>
							Skip for now
						</button>
					</p>
				)}
			</div>
		</div>
	);
}
