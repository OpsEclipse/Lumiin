import {
	PoseLandmarker,
	FilesetResolver,
	NormalizedLandmark,
} from '@mediapipe/tasks-vision';

// Types
export interface PostureMetrics {
	noseY: number;
	noseZ: number;
	shoulderMidY: number;
	shoulderMidZ: number;
	eyeToShoulderDistance: number;
	shoulderAlignment: number; // 0 is perfect horizontal
}

// Simplified landmark position for skeleton drawing
export interface LandmarkPosition {
	x: number;
	y: number;
	z: number;
}

// Upper body landmark indices we care about (shoulders and up only)
export const UPPER_BODY_LANDMARKS = {
	NOSE: 0,
	LEFT_EYE: 2,
	RIGHT_EYE: 5,
	LEFT_EAR: 7,
	RIGHT_EAR: 8,
	LEFT_SHOULDER: 11,
	RIGHT_SHOULDER: 12,
} as const;

// Connections for drawing skeleton lines (shoulders and up only)
export const UPPER_BODY_CONNECTIONS: [number, number][] = [
	// Shoulders
	[
		UPPER_BODY_LANDMARKS.LEFT_SHOULDER,
		UPPER_BODY_LANDMARKS.RIGHT_SHOULDER,
	],
	// Neck/head connections (ears to shoulders)
	[
		UPPER_BODY_LANDMARKS.LEFT_EAR,
		UPPER_BODY_LANDMARKS.LEFT_SHOULDER,
	],
	[
		UPPER_BODY_LANDMARKS.RIGHT_EAR,
		UPPER_BODY_LANDMARKS.RIGHT_SHOULDER,
	],
	// Face
	[UPPER_BODY_LANDMARKS.LEFT_EYE, UPPER_BODY_LANDMARKS.NOSE],
	[UPPER_BODY_LANDMARKS.RIGHT_EYE, UPPER_BODY_LANDMARKS.NOSE],
	[UPPER_BODY_LANDMARKS.LEFT_EAR, UPPER_BODY_LANDMARKS.LEFT_EYE],
	[UPPER_BODY_LANDMARKS.RIGHT_EAR, UPPER_BODY_LANDMARKS.RIGHT_EYE],
];

export interface CalibrationData {
	baseline: PostureMetrics;
	baselineLandmarks: LandmarkPosition[];
	thresholds: {
		slump: number;
		lean: number;
		turtle: number;
	};
}

// Initialize MediaPipe Pose Landmarker
export async function createPoseLandmarker(): Promise<PoseLandmarker> {
	const vision = await FilesetResolver.forVisionTasks(
		'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
	);

	return await PoseLandmarker.createFromOptions(vision, {
		baseOptions: {
			modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
			delegate: 'GPU',
		},
		runningMode: 'VIDEO',
		numPoses: 1,
		minPoseDetectionConfidence: 0.5,
		minPosePresenceConfidence: 0.5,
		minTrackingConfidence: 0.5,
	});
}

// Calculate metrics from a single frame of landmarks
export function calculateMetrics(
	landmarks: NormalizedLandmark[]
): PostureMetrics | null {
	if (!landmarks || landmarks.length < 33) return null;

	const nose = landmarks[0];
	const leftEar = landmarks[7];
	const rightEar = landmarks[8];
	const leftShoulder = landmarks[11];
	const rightShoulder = landmarks[12];

	const eyeLineY = (leftEar.y + rightEar.y) / 2;
	const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
	const shoulderMidZ = (leftShoulder.z + rightShoulder.z) / 2;

	return {
		noseY: nose.y,
		noseZ: nose.z,
		shoulderMidY,
		shoulderMidZ,
		eyeToShoulderDistance: Math.abs(eyeLineY - shoulderMidY),
		shoulderAlignment: Math.abs(leftShoulder.y - rightShoulder.y),
	};
}

// Calculate individual posture scores for each metric
// Returns scores from 0.0 to 1.0 for slump, lean, and turtle neck
function calculateIndividualScores(
	current: PostureMetrics,
	baseline: PostureMetrics
): { slump: number; lean: number; turtle: number } {
	// Slump Detection (Vertical compression)
	// If eye-to-shoulder distance decreases significantly, user is slumping
	const distanceRatio =
		current.eyeToShoulderDistance /
		baseline.eyeToShoulderDistance;
	let slumpScore = 1.0;
	if (distanceRatio < 0.85) {
		slumpScore = Math.max(0, 1.0 - (0.85 - distanceRatio) * 5);
	}

	// Lean Detection (Shoulders not level)
	const leanDiff = Math.abs(
		current.shoulderAlignment - baseline.shoulderAlignment
	);
	let leanScore = 1.0;
	if (leanDiff > 0.05) {
		leanScore = Math.max(0, 1.0 - (leanDiff - 0.05) * 10);
	}

	// Turtle Neck (Forward head)
	// Check if nose is moving forward relative to shoulders compared to baseline
	const baseZDiff = baseline.noseZ - baseline.shoulderMidZ;
	const currZDiff = current.noseZ - current.shoulderMidZ;
	const zShift = baseZDiff - currZDiff;
	let turtleScore = 1.0;
	if (zShift > 0.1) {
		turtleScore = Math.max(0, 1.0 - (zShift - 0.1) * 5);
	}

	return {
		slump: Math.min(1.0, Math.max(0.0, slumpScore)),
		lean: Math.min(1.0, Math.max(0.0, leanScore)),
		turtle: Math.min(1.0, Math.max(0.0, turtleScore)),
	};
}

// Calculate overall posture score based on current metrics vs baseline
// Returns 0.0 to 1.0 (1.0 is perfect match or better)
export function calculatePostureScore(
	current: PostureMetrics,
	calibration: CalibrationData
): number {
	const scores = calculateIndividualScores(
		current,
		calibration.baseline
	);
	// Weighted average - neck (turtle) is emphasized at 60%
	const score =
		scores.slump * 0.25 +
		scores.lean * 0.15 +
		scores.turtle * 0.6;
	return Math.min(1.0, Math.max(0.0, score));
}

// Analysis interval in milliseconds (lower = more responsive, higher = less battery)
export const ANALYSIS_INTERVAL_MS = 500;

// Smooth color interpolation based on posture score
// Returns color transitioning: red (≤60%) → orange → yellow → green (≥90%)
export function getPostureColor(score: number): string {
	const s = Math.min(1, Math.max(0, score));
	const RED_THRESHOLD = 0.6;
	const GREEN_THRESHOLD = 0.9;

	if (s <= RED_THRESHOLD) return '#ef4444';
	if (s >= GREEN_THRESHOLD) return '#10b981';

	// Interpolate between red → orange → yellow → green
	const t = (s - RED_THRESHOLD) / (GREEN_THRESHOLD - RED_THRESHOLD);

	// Color stops: Red → Orange → Yellow → Green
	const colors = [
		{ r: 239, g: 68, b: 68 }, // #ef4444
		{ r: 249, g: 115, b: 22 }, // #f97316
		{ r: 234, g: 179, b: 8 }, // #eab308
		{ r: 16, g: 185, b: 129 }, // #10b981
	];

	const segment = Math.min(2, Math.floor(t * 3));
	const localT = t * 3 - segment;
	const from = colors[segment];
	const to = colors[segment + 1];

	const r = Math.round(from.r + (to.r - from.r) * localT);
	const g = Math.round(from.g + (to.g - from.g) * localT);
	const b = Math.round(from.b + (to.b - from.b) * localT);

	return `rgb(${r}, ${g}, ${b})`;
}

// Smoothing factor for exponential smoothing (0-1, lower = smoother but laggier)
export const SMOOTHING_FACTOR = 0.3;

// Extract landmark positions from MediaPipe result
export function extractLandmarkPositions(
	landmarks: NormalizedLandmark[]
): LandmarkPosition[] {
	return landmarks.map((lm) => ({ x: lm.x, y: lm.y, z: lm.z }));
}

// Exponential smoothing for landmark positions
// Smoothly interpolates from previous to current positions
export function smoothLandmarks(
	current: LandmarkPosition[],
	previous: LandmarkPosition[] | null,
	factor: number = SMOOTHING_FACTOR
): LandmarkPosition[] {
	if (!previous || previous.length !== current.length) {
		return current;
	}

	return current.map((curr, i) => ({
		x: previous[i].x + (curr.x - previous[i].x) * factor,
		y: previous[i].y + (curr.y - previous[i].y) * factor,
		z: previous[i].z + (curr.z - previous[i].z) * factor,
	}));
}

// Average multiple landmark frames for stable baseline
export function averageLandmarks(
	frames: LandmarkPosition[][]
): LandmarkPosition[] {
	if (frames.length === 0) return [];

	const numLandmarks = frames[0].length;
	const result: LandmarkPosition[] = [];

	for (let i = 0; i < numLandmarks; i++) {
		let sumX = 0;
		let sumY = 0;
		let sumZ = 0;
		for (const frame of frames) {
			sumX += frame[i].x;
			sumY += frame[i].y;
			sumZ += frame[i].z;
		}
		result.push({
			x: sumX / frames.length,
			y: sumY / frames.length,
			z: sumZ / frames.length,
		});
	}
	return result;
}

interface SkeletonOptions {
	color: string;
	lineWidth: number;
	pointRadius: number;
	alpha?: number;
	mirrored?: boolean;
	// Actual video stream dimensions (for object-cover offset correction)
	videoWidth?: number;
	videoHeight?: number;
}

// Draw skeleton on canvas
export function drawSkeleton(
	ctx: CanvasRenderingContext2D,
	landmarks: LandmarkPosition[],
	options: SkeletonOptions
): void {
	const {
		color,
		lineWidth,
		pointRadius,
		alpha = 1,
		mirrored = true,
		videoWidth = 640,
		videoHeight = 480,
	} = options;
	const { width: canvasWidth, height: canvasHeight } = ctx.canvas;

	ctx.save();
	ctx.globalAlpha = alpha;
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.lineWidth = lineWidth;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';

	// Calculate object-cover scaling and offset
	// object-cover scales the video to fill the container while maintaining aspect ratio,
	// then crops any overflow. We need to replicate this to map normalized coords correctly.
	const videoAspect = videoWidth / videoHeight;
	const canvasAspect = canvasWidth / canvasHeight;

	let scale: number;
	let offsetX = 0;
	let offsetY = 0;

	if (canvasAspect > videoAspect) {
		// Canvas is wider than video - video is scaled by width, top/bottom cropped
		scale = canvasWidth / videoWidth;
		const scaledVideoHeight = videoHeight * scale;
		offsetY = (scaledVideoHeight - canvasHeight) / 2;
	} else {
		// Canvas is taller than video - video is scaled by height, left/right cropped
		scale = canvasHeight / videoHeight;
		const scaledVideoWidth = videoWidth * scale;
		offsetX = (scaledVideoWidth - canvasWidth) / 2;
	}

	const getCoords = (lm: LandmarkPosition): [number, number] => {
		// Convert normalized coords to actual video pixels, then to canvas coords
		const videoX = lm.x * videoWidth;
		const videoY = lm.y * videoHeight;

		// Apply scale and offset
		let canvasX = videoX * scale - offsetX;
		const canvasY = videoY * scale - offsetY;

		// Mirror if needed
		if (mirrored) {
			canvasX = canvasWidth - canvasX;
		}

		return [canvasX, canvasY];
	};

	// Draw connections
	for (const [startIdx, endIdx] of UPPER_BODY_CONNECTIONS) {
		if (landmarks[startIdx] && landmarks[endIdx]) {
			const [x1, y1] = getCoords(landmarks[startIdx]);
			const [x2, y2] = getCoords(landmarks[endIdx]);

			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		}
	}

	// Draw landmark points
	const upperBodyIndices = Object.values(UPPER_BODY_LANDMARKS);
	for (const idx of upperBodyIndices) {
		if (landmarks[idx]) {
			const [x, y] = getCoords(landmarks[idx]);
			ctx.beginPath();
			ctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
			ctx.fill();
		}
	}

	ctx.restore();
}

// Calculate individual posture scores for display
export function calculateDetailedScores(
	current: PostureMetrics,
	calibration: CalibrationData
): { slump: number; lean: number; turtle: number } {
	return calculateIndividualScores(current, calibration.baseline);
}
