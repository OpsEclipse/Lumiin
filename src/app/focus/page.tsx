'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
	Camera,
	ArrowRight,
	Check,
	CircleNotch,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	createPoseLandmarker,
	calculateMetrics,
	extractLandmarkPositions,
	averageLandmarks,
	smoothLandmarks,
	drawSkeleton,
	ANALYSIS_INTERVAL_MS,
	type CalibrationData,
	type PostureMetrics,
	type LandmarkPosition,
} from '@/lib/mediapipe-utils';
import { PoseLandmarker } from '@mediapipe/tasks-vision';
import { motion } from 'framer-motion';

type SetupStep = 'camera' | 'calibrate' | 'name';

export default function FocusSetupPage(): React.ReactElement {
	const router = useRouter();
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const landmarkerRef = useRef<PoseLandmarker | null>(null);
	const analysisLoopRef = useRef<number | null>(null);
	const renderLoopRef = useRef<number | null>(null);
	const targetLandmarksRef = useRef<LandmarkPosition[] | null>(
		null
	);
	const displayedLandmarksRef = useRef<LandmarkPosition[] | null>(
		null
	);
	const [step, setStep] = useState<SetupStep>('camera');
	const [sessionName, setSessionName] = useState('');
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [isCalibrating, setIsCalibrating] = useState(false);
	const [calibrationComplete, setCalibrationComplete] =
		useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isTracking, setIsTracking] = useState(false);

	// Initialize MediaPipe
	useEffect(() => {
		const loadLandmarker = async () => {
			try {
				const landmarker = await createPoseLandmarker();
				landmarkerRef.current = landmarker;
				console.log('Pose Landmarker loaded');
			} catch (err) {
				console.error('Failed to load MediaPipe:', err);
				setError('Failed to load posture tracking model');
			}
		};
		loadLandmarker();
	}, []);

	// Initialize camera
	const initCamera = useCallback(async () => {
		try {
			const mediaStream =
				await navigator.mediaDevices.getUserMedia({
					video: {
						facingMode: 'user',
						width: 640,
						height: 480,
					},
					audio: false,
				});
			setStream(mediaStream);
			setStep('calibrate');
			setError(null);
		} catch (err) {
			console.error('Camera access error:', err);
			setError(
				'Unable to access camera. Please grant permission and try again.'
			);
		}
	}, []);

	// Attach stream to video element when step is 'calibrate'
	useEffect(() => {
		if (step === 'calibrate' && videoRef.current && stream) {
			videoRef.current.srcObject = stream;
		}
	}, [step, stream]);

	// Analysis loop - runs at 500ms intervals for battery efficiency
	useEffect(() => {
		if (step !== 'calibrate' || !stream || calibrationComplete) {
			if (analysisLoopRef.current) {
				cancelAnimationFrame(analysisLoopRef.current);
				analysisLoopRef.current = null;
			}
			return;
		}

		let lastProcessTime = 0;
		let lastVideoTime = -1;

		const analysisLoop = (timestamp: number) => {
			if (
				timestamp - lastProcessTime >= ANALYSIS_INTERVAL_MS &&
				videoRef.current &&
				landmarkerRef.current &&
				videoRef.current.readyState >= 2
			) {
				let mpTimestamp = performance.now();
				if (mpTimestamp <= lastVideoTime) {
					mpTimestamp = lastVideoTime + 1;
				}
				lastVideoTime = mpTimestamp;

				const result = landmarkerRef.current.detectForVideo(
					videoRef.current,
					mpTimestamp
				);

				if (result.landmarks && result.landmarks.length > 0) {
					setIsTracking(true);
					// Store as target - render loop will interpolate toward this
					targetLandmarksRef.current =
						extractLandmarkPositions(result.landmarks[0]);
				} else {
					setIsTracking(false);
				}
				lastProcessTime = timestamp;
			}
			analysisLoopRef.current =
				requestAnimationFrame(analysisLoop);
		};

		analysisLoopRef.current = requestAnimationFrame(analysisLoop);

		return () => {
			if (analysisLoopRef.current) {
				cancelAnimationFrame(analysisLoopRef.current);
			}
		};
	}, [step, stream, calibrationComplete]);

	// Render loop - runs at 60fps for smooth skeleton animation
	// Draws directly to canvas using refs to avoid React state overhead
	useEffect(() => {
		if (step !== 'calibrate' || !stream || calibrationComplete) {
			if (renderLoopRef.current) {
				cancelAnimationFrame(renderLoopRef.current);
				renderLoopRef.current = null;
			}
			return;
		}

		const RENDER_SMOOTHING = 0.05;

		const renderLoop = () => {
			const canvas = canvasRef.current;
			const video = videoRef.current;
			const target = targetLandmarksRef.current;

			if (canvas && video && target) {
				// Interpolate displayed landmarks toward target
				const displayed = smoothLandmarks(
					target,
					displayedLandmarksRef.current,
					RENDER_SMOOTHING
				);
				displayedLandmarksRef.current = displayed;

				// Draw directly to canvas (no React state update)
				const ctx = canvas.getContext('2d');
				if (ctx) {
					const rect = video.getBoundingClientRect();
					if (
						canvas.width !== rect.width ||
						canvas.height !== rect.height
					) {
						canvas.width = rect.width;
						canvas.height = rect.height;
					}

					ctx.clearRect(0, 0, canvas.width, canvas.height);
					drawSkeleton(ctx, displayed, {
						color: '#10b981',
						lineWidth: 3,
						pointRadius: 4,
						mirrored: true,
					});
				}
			}

			renderLoopRef.current = requestAnimationFrame(renderLoop);
		};

		renderLoopRef.current = requestAnimationFrame(renderLoop);

		return () => {
			if (renderLoopRef.current) {
				cancelAnimationFrame(renderLoopRef.current);
			}
		};
	}, [step, stream, calibrationComplete]);

	// Cleanup camera on unmount
	useEffect(() => {
		return () => {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
			if (analysisLoopRef.current) {
				cancelAnimationFrame(analysisLoopRef.current);
			}
			if (renderLoopRef.current) {
				cancelAnimationFrame(renderLoopRef.current);
			}
		};
	}, [stream]);

	// Complete calibration and store results
	const finishCalibration = useCallback(
		(
			samples: PostureMetrics[],
			landmarkFrames: LandmarkPosition[][]
		) => {
			setIsCalibrating(false);
			if (samples.length < 10) {
				setError(
					'Could not detect posture clearly. Make sure your upper body is visible.'
				);
				return;
			}

			// Calculate average baseline
			const count = samples.length;
			const baseline: PostureMetrics = {
				noseY:
					samples.reduce(
						(acc, curr) => acc + curr.noseY,
						0
					) / count,
				noseZ:
					samples.reduce(
						(acc, curr) => acc + curr.noseZ,
						0
					) / count,
				shoulderMidY:
					samples.reduce(
						(acc, curr) => acc + curr.shoulderMidY,
						0
					) / count,
				shoulderMidZ:
					samples.reduce(
						(acc, curr) => acc + curr.shoulderMidZ,
						0
					) / count,
				eyeToShoulderDistance:
					samples.reduce(
						(acc, curr) =>
							acc + curr.eyeToShoulderDistance,
						0
					) / count,
				shoulderAlignment:
					samples.reduce(
						(acc, curr) => acc + curr.shoulderAlignment,
						0
					) / count,
			};

			const baselineLandmarks =
				averageLandmarks(landmarkFrames);
			const calibrationData: CalibrationData = {
				baseline,
				baselineLandmarks,
				thresholds: { slump: 0.15, lean: 0.1, turtle: 0.1 },
			};
			sessionStorage.setItem(
				'pendingCalibration',
				JSON.stringify(calibrationData)
			);

			setCalibrationComplete(true);
			setStep('name');
		},
		[]
	);

	// Perform calibration with MediaPipe
	const handleCalibrate = useCallback(() => {
		if (!landmarkerRef.current || !videoRef.current) {
			setError(
				'Camera or AI model not ready yet. Please wait a moment.'
			);
			return;
		}

		setIsCalibrating(true);
		const samples: PostureMetrics[] = [];
		const landmarkFrames: LandmarkPosition[][] = [];
		const startTime = Date.now();
		const CALIBRATION_DURATION_MS = 3000;
		let lastVideoTime = -1;

		const processFrame = () => {
			if (Date.now() - startTime >= CALIBRATION_DURATION_MS) {
				finishCalibration(samples, landmarkFrames);
				return;
			}

			if (
				videoRef.current &&
				landmarkerRef.current &&
				videoRef.current.readyState >= 2
			) {
				let timestamp = performance.now();
				if (timestamp <= lastVideoTime) {
					timestamp = lastVideoTime + 1;
				}
				lastVideoTime = timestamp;

				const result = landmarkerRef.current.detectForVideo(
					videoRef.current,
					timestamp
				);
				if (result.landmarks && result.landmarks.length > 0) {
					const metrics = calculateMetrics(
						result.landmarks[0]
					);
					if (metrics) {
						samples.push(metrics);
						landmarkFrames.push(
							extractLandmarkPositions(
								result.landmarks[0]
							)
						);
					}
				}
			}
			requestAnimationFrame(processFrame);
		};

		requestAnimationFrame(processFrame);
	}, [finishCalibration]);

	// Start session
	const handleStartSession = () => {
		const storedCalibration = sessionStorage.getItem(
			'pendingCalibration'
		);
		const calibrationData = storedCalibration
			? JSON.parse(storedCalibration)
			: null;

		// Store session info in sessionStorage for the active page
		sessionStorage.setItem(
			'focusSession',
			JSON.stringify({
				name: sessionName || 'Session',
				startTime: new Date().toISOString(),
				calibrated: true,
				calibrationData,
			})
		);
		sessionStorage.removeItem('pendingCalibration');
		router.push('/focus/active');
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0A1C2A] via-[#0F3A4B] to-[#1B5E6D] flex items-center justify-center p-8">
			<motion.div
				className="w-full max-w-2xl"
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: 'easeOut' }}
			>
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-3xl font-light text-white/90 tracking-widest uppercase mb-2">
						Session Setup
					</h1>
					<p className="text-white/50 text-sm">
						{step === 'camera' &&
							"Let's set up your camera for posture tracking"}
						{step === 'calibrate' &&
							'Assume your ideal posture and calibrate your baseline'}
						{step === 'name' &&
							'Almost ready! Give your session a name (optional)'}
					</p>
				</div>

				{/* Progress Indicators */}
				<div className="flex justify-center gap-3 mb-12">
					{['camera', 'calibrate', 'name'].map((s, i) => (
						<div
							key={s}
							className={`w-2 h-2 rounded-full transition-all duration-300 ${
								step === s
									? 'bg-emerald-400 w-8'
									: [
												'camera',
												'calibrate',
												'name',
										  ].indexOf(step) > i
										? 'bg-emerald-400'
										: 'bg-white/20'
							}`}
						/>
					))}
				</div>

				{/* Main Content Card */}
				<div className="bg-black/20 backdrop-blur-md border border-white/10 p-8">
					{/* Step: Camera Permission */}
					{step === 'camera' && (
						<div className="text-center space-y-8">
							<div className="w-24 h-24 mx-auto bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
								<Camera
									size={40}
									className="text-emerald-400"
								/>
							</div>
							<div>
								<h2 className="text-xl text-white/90 font-light mb-2">
									Enable Camera Access
								</h2>
								<p className="text-white/50 text-sm max-w-md mx-auto">
									We will use your camera to track
									your posture and help you maintain
									focus during your session.
								</p>
							</div>
							{error && (
								<p className="text-red-400 text-sm">
									{error}
								</p>
							)}
							<Button
								onClick={initCamera}
								className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg"
							>
								Enable Camera
								<ArrowRight
									className="ml-2"
									size={20}
								/>
							</Button>
						</div>
					)}

					{/* Step: Calibration */}
					{step === 'calibrate' && (
						<div className="space-y-6">
							{/* Camera Preview with Skeleton */}
							<div className="relative aspect-video bg-black/40 overflow-hidden border border-white/10">
								<video
									ref={videoRef}
									autoPlay
									playsInline
									muted
									className="w-full h-full object-cover scale-x-[-1]"
								/>
								{/* Canvas for skeleton overlay */}
								<canvas
									ref={canvasRef}
									className="absolute inset-0 w-full h-full pointer-events-none"
								/>
								{/* Tracking Status */}
								<div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
									<div
										className={`w-1.5 h-1.5 rounded-full ${
											isTracking
												? 'bg-emerald-400'
												: 'bg-yellow-400 animate-pulse'
										}`}
									/>
									<span className="text-[10px] text-white/60 uppercase tracking-wider">
										{isTracking
											? 'Pose Detected'
											: 'Detecting...'}
									</span>
								</div>
								{/* Calibration Overlay */}
								{isCalibrating && (
									<div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
										<CircleNotch
											size={48}
											className="text-emerald-400 animate-spin mb-4"
										/>
										<p className="text-white/80 text-sm">
											Calibrating your posture
											baseline...
										</p>
										<p className="text-white/50 text-xs mt-1">
											Hold your ideal posture
										</p>
									</div>
								)}
								{calibrationComplete && (
									<div className="absolute inset-0 bg-emerald-500/20 flex flex-col items-center justify-center">
										<Check
											size={48}
											className="text-emerald-400 mb-4"
										/>
										<p className="text-white/80 text-sm">
											Calibration complete!
										</p>
									</div>
								)}
							</div>

							{/* Ideal Posture Instructions */}
							<div className="bg-white/5 border border-white/10 rounded-lg p-4">
								<h3 className="text-white/80 text-sm font-medium mb-3 uppercase tracking-wider">
									Ideal Posture Checklist
								</h3>
								<ul className="space-y-2 text-white/60 text-sm">
									<li className="flex items-start gap-2">
										<span className="text-emerald-400 mt-0.5">
											•
										</span>
										<span>
											<strong className="text-white/80">
												Chin aligned with
												chest
											</strong>{' '}
											— head centered, not
											jutting forward
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-emerald-400 mt-0.5">
											•
										</span>
										<span>
											<strong className="text-white/80">
												Shoulders level and
												relaxed
											</strong>{' '}
											— not hunched or
											asymmetric
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-emerald-400 mt-0.5">
											•
										</span>
										<span>
											<strong className="text-white/80">
												Ears above shoulders
											</strong>{' '}
											— avoiding forward head
											posture
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-emerald-400 mt-0.5">
											•
										</span>
										<span>
											<strong className="text-white/80">
												Sit tall with neutral
												spine
											</strong>{' '}
											— imagine a string pulling
											you up
										</span>
									</li>
								</ul>
							</div>

							{/* Calibrate Button */}
							<div className="text-center">
								<Button
									onClick={handleCalibrate}
									disabled={
										isCalibrating ||
										calibrationComplete ||
										!isTracking
									}
									className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white px-8 py-6 text-lg"
								>
									{isCalibrating ? (
										<>
											<CircleNotch
												className="mr-2 animate-spin"
												size={20}
											/>
											Calibrating...
										</>
									) : calibrationComplete ? (
										<>
											<Check
												className="mr-2"
												size={20}
											/>
											Calibrated!
										</>
									) : !isTracking ? (
										'Waiting for pose detection...'
									) : (
										'Calibrate Ideal Posture'
									)}
								</Button>
							</div>
						</div>
					)}

					{/* Step: Session Name */}
					{step === 'name' && (
						<div className="space-y-8">
							<div className="text-center">
								<h2 className="text-xl text-white/90 font-light mb-2">
									Name Your Session
								</h2>
								<p className="text-white/50 text-sm">
									Optional: Give your session a name
									to help you remember what you
									worked on
								</p>
							</div>

							<Input
								value={sessionName}
								onChange={(e) =>
									setSessionName(e.target.value)
								}
								placeholder="e.g., Working on project proposal"
								className="bg-white/5 border-white/10 text-white placeholder:text-white/30 text-center py-6 text-lg"
							/>

							<div className="flex gap-4 justify-center">
								<Button
									onClick={handleStartSession}
									variant="outline"
									className="border-white/20 text-white/70 hover:bg-white/5 px-6 py-6"
								>
									Skip
								</Button>
								<Button
									onClick={handleStartSession}
									className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg"
								>
									Start Session
									<ArrowRight
										className="ml-2"
										size={20}
									/>
								</Button>
							</div>
						</div>
					)}
				</div>

				{/* Back to Dashboard */}
				<div className="text-center mt-8">
					<button
						onClick={() => router.push('/dashboard')}
						className="text-white/40 hover:text-white/60 text-sm transition-colors"
					>
						← Back to Dashboard
					</button>
				</div>
			</motion.div>
		</div>
	);
}
