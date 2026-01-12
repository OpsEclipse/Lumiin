'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
	Pause,
	Play,
	Stop,
	GearSix,
	User,
} from '@phosphor-icons/react';
import { useAuth } from '@clerk/nextjs';
import {
	createPoseLandmarker,
	calculateMetrics,
	calculatePostureScore,
	calculateDetailedScores,
	extractLandmarkPositions,
	smoothLandmarks,
	drawSkeleton,
	getPostureColor,
	ANALYSIS_INTERVAL_MS,
	type CalibrationData,
	type LandmarkPosition,
} from '@/lib/mediapipe-utils';
import { PoseLandmarker } from '@mediapipe/tasks-vision';
import { LumiinLoader } from '@/components/ui/lumiin-loader';

function getPostureStatus(score: number): {
	text: string;
	color: string;
} {
	if (score >= 0.9)
		return { text: 'EXCELLENT', color: 'text-emerald-400' };
	if (score >= 0.75)
		return { text: 'GOOD', color: 'text-yellow-400' };
	if (score >= 0.6)
		return { text: 'FAIR', color: 'text-orange-400' };
	return { text: 'NEEDS ATTENTION', color: 'text-red-400' };
}

interface SessionData {
	name: string;
	startTime: string;
	calibrated: boolean;
	calibrationData: CalibrationData;
}

interface PostureLog {
	timestamp: string;
	score: number;
}

export default function ActiveSessionPage(): React.ReactElement {
	const router = useRouter();
	const { userId } = useAuth();

	// UI State (Triggers Renders)
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [sessionData, setSessionData] =
		useState<SessionData | null>(null);
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [allPostureLogs, setAllPostureLogs] = useState<
		PostureLog[]
	>([]);
	const [pendingLogs, setPendingLogs] = useState<PostureLog[]>([]);
	const [currentPostureScore, setCurrentPostureScore] =
		useState(1.0);
	const [pauseEvents, setPauseEvents] = useState<
		{ type: 'pause' | 'resume'; timestamp: string }[]
	>([]);
	const [isTracking, setIsTracking] = useState(false);
	const [detailedScores, setDetailedScores] = useState({
		slump: 1.0,
		lean: 1.0,
		turtle: 1.0,
	});

	// Refs (For Intervals/Loops)
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const landmarkerRef = useRef<PoseLandmarker | null>(null);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const analysisLoopRef = useRef<number | null>(null);
	const renderLoopRef = useRef<number | null>(null);
	const targetLandmarksRef = useRef<LandmarkPosition[] | null>(
		null
	);
	const displayedLandmarksRef = useRef<LandmarkPosition[] | null>(
		null
	);

	// Refs for accessing state in callbacks without stale closures
	const sessionDataRef = useRef<SessionData | null>(null);
	const latestScoreRef = useRef<number>(1.0);
	const pendingLogsRef = useRef<PostureLog[]>([]);
	const allLogsRef = useRef<PostureLog[]>([]);
	const elapsedSecondsRef = useRef(0);
	const sessionIdRef = useRef<string | null>(null);
	const sessionInitRef = useRef(false);

	// Sync state to refs for use in async callbacks
	useEffect(() => {
		sessionDataRef.current = sessionData;
		latestScoreRef.current = currentPostureScore;
		elapsedSecondsRef.current = elapsedSeconds;
		sessionIdRef.current = sessionId;
	}, [sessionData, currentPostureScore, elapsedSeconds, sessionId]);

	useEffect(() => {
		if (sessionInitRef.current) return;

		const stored = sessionStorage.getItem('focusSession');
		if (stored) {
			const data = JSON.parse(stored);
			setSessionData(data);
			sessionInitRef.current = true;
			if (userId) {
				fetch('/api/sessions', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						userId,
						startTime: data.startTime,
						endTime: data.startTime,
						notes: data.name,
						durationMins: 0,
						postureLogs: [],
						pauseEvents: [],
					}),
				})
					.then((res) => res.json())
					.then((res) => {
						if (res.sessionId)
							setSessionId(res.sessionId);
					})
					.catch((err) =>
						console.error('Failed to init session:', err)
					);
			}
		} else {
			router.push('/focus');
		}
	}, [router, userId]);
	useEffect(() => {
		let isMounted = true;
		const init = async () => {
			try {
				const landmarker = await createPoseLandmarker();
				if (!isMounted) return;
				landmarkerRef.current = landmarker;

				const mediaStream =
					await navigator.mediaDevices.getUserMedia({
						video: {
							facingMode: 'user',
							width: 640,
							height: 480,
						},
						audio: false,
					});

				if (!isMounted) {
					mediaStream.getTracks().forEach((t) => t.stop());
					return;
				}

				setStream(mediaStream);
				if (videoRef.current) {
					videoRef.current.srcObject = mediaStream;
				}
			} catch (err) {
				console.error('Initialization error:', err);
			}
		};
		init();

		return () => {
			isMounted = false;
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	// Analysis loop - runs at 500ms intervals to save battery
	useEffect(() => {
		if (isPaused || !sessionData?.calibrationData) return;

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
					// Store as target - the render loop will interpolate toward this
					targetLandmarksRef.current =
						extractLandmarkPositions(result.landmarks[0]);

					const metrics = calculateMetrics(
						result.landmarks[0]
					);
					if (
						metrics &&
						sessionDataRef.current?.calibrationData
					) {
						const score = calculatePostureScore(
							metrics,
							sessionDataRef.current.calibrationData
						);
						const detailed = calculateDetailedScores(
							metrics,
							sessionDataRef.current.calibrationData
						);

						setCurrentPostureScore(
							(prev) => prev * 0.2 + score * 0.8
						);
						setDetailedScores(detailed);
					}
				}
				lastProcessTime = timestamp;
			}
			analysisLoopRef.current =
				requestAnimationFrame(analysisLoop);
		};

		analysisLoopRef.current = requestAnimationFrame(analysisLoop);

		return () => {
			if (analysisLoopRef.current)
				cancelAnimationFrame(analysisLoopRef.current);
		};
	}, [isPaused, sessionData]);

	// Render loop - runs at 60fps for smooth skeleton animation
	// Draws directly to canvas using refs to avoid React state overhead
	useEffect(() => {
		if (isPaused || !sessionData?.calibrationData) return;

		const RENDER_SMOOTHING = 0.05; // Per-frame interpolation factor (lower = smoother)
		let frameCount = 0;

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

					// Draw baseline skeleton (ghost overlay)
					const baselineLandmarks =
						sessionData?.calibrationData
							?.baselineLandmarks;
					if (baselineLandmarks) {
						drawSkeleton(ctx, baselineLandmarks, {
							color: '#06b6d4',
							lineWidth: 2,
							pointRadius: 3,
							alpha: 0.4,
							mirrored: true,
						});
					}

					// Draw current skeleton with smooth color based on score
					const color = getPostureColor(
						currentPostureScore
					);

					drawSkeleton(ctx, displayed, {
						color,
						lineWidth: 3,
						pointRadius: 4,
						alpha: 1,
						mirrored: true,
					});
				}

				// Update tracking state every 10 frames for UI indicator
				frameCount++;
				if (frameCount >= 10) {
					frameCount = 0;
					setIsTracking(true);
				}
			} else if (frameCount > 0) {
				frameCount++;
				if (frameCount >= 30) {
					frameCount = 0;
					setIsTracking(false);
				}
			}

			renderLoopRef.current = requestAnimationFrame(renderLoop);
		};

		renderLoopRef.current = requestAnimationFrame(renderLoop);

		return () => {
			if (renderLoopRef.current)
				cancelAnimationFrame(renderLoopRef.current);
		};
	}, [isPaused, sessionData, currentPostureScore]);
	useEffect(() => {
		if (isPaused) return;

		const interval = setInterval(() => {
			const log = {
				timestamp: new Date().toISOString(),
				score: parseFloat(latestScoreRef.current.toFixed(2)),
			};

			pendingLogsRef.current = [...pendingLogsRef.current, log];
			allLogsRef.current = [...allLogsRef.current, log];
			setAllPostureLogs((prev) => [...prev, log]);
			setPendingLogs((prev) => [...prev, log]);
		}, 5000);

		return () => clearInterval(interval);
	}, [isPaused]);
	useEffect(() => {
		const interval = setInterval(() => {
			const currentSessionId = sessionIdRef.current;
			const logsToSync = pendingLogsRef.current;

			if (!currentSessionId || logsToSync.length === 0) return;

			pendingLogsRef.current = [];
			setPendingLogs([]);

			const avgScore =
				allLogsRef.current.length > 0
					? allLogsRef.current.reduce(
							(a, b) => a + b.score,
							0
						) / allLogsRef.current.length
					: 1;

			fetch('/api/sessions', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sessionId: currentSessionId,
					postureLogs: logsToSync,
					avgPostureScore: avgScore,
					durationMins: Math.round(
						elapsedSecondsRef.current / 60
					),
				}),
			})
				.then((res) => {
					if (!res.ok) {
						throw new Error(`Sync failed: ${res.status}`);
					}
				})
				.catch((err) => {
					console.error('Sync failed, requeuing logs', err);
					pendingLogsRef.current = [
						...logsToSync,
						...pendingLogsRef.current,
					];
					setPendingLogs((prev) => [
						...logsToSync,
						...prev,
					]);
				});
		}, 30000);

		return () => clearInterval(interval);
	}, []);
	useEffect(() => {
		if (!isPaused) {
			timerRef.current = setInterval(() => {
				setElapsedSeconds((prev) => prev + 1);
			}, 1000);
		}
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [isPaused]);

	const formatTime = (seconds: number): string => {
		const hrs = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hrs > 0) {
			return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
		}
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};
	const handlePauseToggle = () => {
		const event = {
			type: isPaused ? ('resume' as const) : ('pause' as const),
			timestamp: new Date().toISOString(),
		};
		setPauseEvents((prev) => [...prev, event]);
		setIsPaused(!isPaused);
	};
	const handleEndSession = useCallback(async () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}
		if (analysisLoopRef.current) {
			cancelAnimationFrame(analysisLoopRef.current);
		}
		if (renderLoopRef.current) {
			cancelAnimationFrame(renderLoopRef.current);
		}
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
		}

		const avgPosture =
			allPostureLogs.length > 0
				? allPostureLogs.reduce(
						(sum, log) => sum + log.score,
						0
					) / allPostureLogs.length
				: currentPostureScore;

		const summary = {
			name: sessionData?.name || 'Session',
			startTime: sessionData?.startTime,
			endTime: new Date().toISOString(),
			durationMins: Math.round(elapsedSeconds / 60),
			durationSeconds: elapsedSeconds,
			avgPostureScore: avgPosture,
			postureLogs: allPostureLogs,
			pauseEvents,
			pauseCount: pauseEvents.filter((e) => e.type === 'pause')
				.length,
		};

		sessionStorage.setItem(
			'sessionSummary',
			JSON.stringify(summary)
		);
		if (sessionId) {
			try {
				const res = await fetch('/api/sessions', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						sessionId,
						postureLogs: allPostureLogs, // Send ALL logs for complete posture timeline
						avgPostureScore: avgPosture,
						durationMins: Math.round(elapsedSeconds / 60),
						isFinalSave: true, // Flag to indicate this is the final save (replaces posture array)
					}),
				});
				if (!res.ok) {
					const data = await res.json();
					console.error(
						'Error saving session:',
						data.error
					);
				}
			} catch (err) {
				console.error('Error saving session:', err);
			}
		}

		router.push('/focus/summary');
	}, [
		stream,
		allPostureLogs,
		pendingLogs,
		currentPostureScore,
		sessionData,
		elapsedSeconds,
		pauseEvents,
		router,
		sessionId,
	]);
	const postureStatus = getPostureStatus(currentPostureScore);

	if (!sessionData) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-[#0A1C2A] via-[#0F3A4B] to-[#1B5E6D] flex items-center justify-center">
				<LumiinLoader size="xl" className="text-white" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0A1C2A] via-[#0F3A4B] to-[#1B5E6D] relative overflow-hidden">
			{/* Main Content */}
			<div className="relative z-10 w-full h-screen flex flex-col justify-between p-8">
				{/* Header */}
				<header className="flex justify-between items-center w-full">
					<div className="flex items-center space-x-3 opacity-60 hover:opacity-100 transition-opacity cursor-default">
						<div className="w-6 h-6 bg-emerald-500 flex items-center justify-center">
							<span className="text-white text-xs font-bold">
								L
							</span>
						</div>
						<span className="font-light tracking-widest text-base uppercase text-white/70">
							Lumiin Flow
						</span>
					</div>
					<div
						className={`text-xs font-mono ${postureStatus.color} opacity-80`}
					>
						<User
							className="inline-block align-middle mr-1"
							size={14}
						/>
						<span className="align-middle">
							POSTURE: {postureStatus.text}
						</span>
					</div>
				</header>

				{/* Main Timer Display */}
				<main className="grow flex items-center justify-center relative w-full">
					<div className="text-center flex flex-col items-center">
						<h1 className="font-mono text-8xl md:text-9xl font-light text-white/90 tracking-tighter">
							{formatTime(elapsedSeconds)}
						</h1>
						<p className="text-emerald-400/60 text-lg uppercase tracking-[0.2em] mt-4 font-normal">
							{sessionData.name}
						</p>
						{isPaused && (
							<p className="text-yellow-400/80 text-sm uppercase tracking-widest mt-2 animate-pulse">
								— Paused —
							</p>
						)}
					</div>
				</main>

				{/* Footer Controls */}
				<footer className="flex justify-center items-end pb-8">
					<div className="flex items-center space-x-4">
						{/* Settings Button */}
						<button
							aria-label="Settings"
							className="w-12 h-12 rounded-full bg-white/5 backdrop-blur border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
						>
							<GearSix size={24} />
						</button>

						{/* Pause/Play Button */}
						<button
							aria-label={
								isPaused
									? 'Resume Session'
									: 'Pause Session'
							}
							onClick={handlePauseToggle}
							className="w-16 h-16 rounded-full bg-emerald-500/20 backdrop-blur border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
						>
							{isPaused ? (
								<Play size={32} weight="fill" />
							) : (
								<Pause size={32} weight="fill" />
							)}
						</button>

						{/* Stop Button */}
						<button
							aria-label="End Session"
							onClick={handleEndSession}
							className="w-12 h-12 rounded-full bg-white/5 backdrop-blur border border-white/10 flex items-center justify-center text-white/60 hover:text-red-400 hover:border-red-400/30 transition-all"
						>
							<Stop size={24} weight="fill" />
						</button>
					</div>
				</footer>

				{/* Webcam Preview & Posture Panel (Bottom Right) */}
				<div className="absolute bottom-8 right-8 z-50 flex items-end gap-4">
					{/* Posture Score Panel */}
					<div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-lg p-4 w-48">
						{/* Main Score */}
						<div className="text-center mb-4">
							<div
								className={`text-5xl font-mono font-bold ${postureStatus.color}`}
							>
								{Math.round(
									currentPostureScore * 100
								)}
								%
							</div>
							<div
								className={`text-xs uppercase tracking-widest mt-1 ${postureStatus.color}`}
							>
								{postureStatus.text}
							</div>
						</div>

						{/* Individual Metrics */}
						<div className="space-y-2">
							<div className="flex items-center justify-between text-xs">
								<span className="text-white/50 uppercase tracking-wider">
									Slump
								</span>
								<div className="flex items-center gap-2">
									<div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
										<div
											className="h-full rounded-full transition-all duration-300"
											style={{
												width: `${detailedScores.slump * 100}%`,
												backgroundColor:
													getPostureColor(
														detailedScores.slump
													),
											}}
										/>
									</div>
								</div>
							</div>
							<div className="flex items-center justify-between text-xs">
								<span className="text-white/50 uppercase tracking-wider">
									Lean
								</span>
								<div className="flex items-center gap-2">
									<div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
										<div
											className="h-full rounded-full transition-all duration-300"
											style={{
												width: `${detailedScores.lean * 100}%`,
												backgroundColor:
													getPostureColor(
														detailedScores.lean
													),
											}}
										/>
									</div>
								</div>
							</div>
							<div className="flex items-center justify-between text-xs">
								<span className="text-white/50 uppercase tracking-wider">
									Neck
								</span>
								<div className="flex items-center gap-2">
									<div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
										<div
											className="h-full rounded-full transition-all duration-300"
											style={{
												width: `${detailedScores.turtle * 100}%`,
												backgroundColor:
													getPostureColor(
														detailedScores.turtle
													),
											}}
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Legend */}
						<div className="mt-4 pt-3 border-t border-white/10">
							<div className="flex items-center gap-2 text-[10px] text-white/40">
								<div className="flex items-center gap-1">
									<div className="w-2 h-2 rounded-full bg-cyan-500/40" />
									<span>Baseline</span>
								</div>
								<div className="flex items-center gap-1">
									<div className="w-2 h-2 rounded-full bg-emerald-500" />
									<span>Current</span>
								</div>
							</div>
						</div>
					</div>

					{/* Video Feed with Skeleton Overlay */}
					<div className="relative w-72 h-52 rounded-lg bg-black/30 backdrop-blur-md border border-emerald-400/30 shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-emerald-400/20">
						{/* Recording Indicator */}
						<div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-400 animate-pulse z-20" />

						{/* MediaPipe Active Indicator */}
						<div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
							<div
								className={`w-1.5 h-1.5 rounded-full ${isTracking ? 'bg-emerald-400' : 'bg-yellow-400 animate-pulse'}`}
							/>
							<span className="text-[10px] text-white/60 uppercase tracking-wider">
								{isTracking
									? 'Tracking'
									: 'Detecting...'}
							</span>
						</div>

						{/* Camera Feed */}
						<video
							ref={videoRef}
							autoPlay
							playsInline
							muted
							className="w-full h-full object-cover scale-x-[-1]"
						/>

						{/* Canvas Overlay for Skeleton */}
						<canvas
							ref={canvasRef}
							className="absolute inset-0 w-full h-full pointer-events-none"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
