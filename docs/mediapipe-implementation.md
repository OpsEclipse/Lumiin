# MediaPipe Implementation

## Overview

Lumiin uses MediaPipe Pose Landmarker for client-side posture detection. All inference runs in the browser—no video data is uploaded.

**Implementation:** `src/lib/mediapipe-utils.ts`

## Model Configuration

```typescript
PoseLandmarker.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: 'pose_landmarker_lite.task',
    delegate: 'GPU',
  },
  runningMode: 'VIDEO',
  numPoses: 1,
  minPoseDetectionConfidence: 0.5,
  minPosePresenceConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
```

## Key Landmarks Used

| Index | Landmark        | Purpose                    |
| ----- | --------------- | -------------------------- |
| 0     | Nose            | Forward head detection (Z) |
| 7     | Left Ear        | Eye line calculation       |
| 8     | Right Ear       | Eye line calculation       |
| 11    | Left Shoulder   | Shoulder midpoint, lean    |
| 12    | Right Shoulder  | Shoulder midpoint, lean    |

## Metrics Tracked

```typescript
interface PostureMetrics {
  noseY: number;              // Nose vertical position
  noseZ: number;              // Nose depth (forward/back)
  shoulderMidY: number;       // Shoulder midpoint Y
  shoulderMidZ: number;       // Shoulder midpoint Z
  eyeToShoulderDistance: number;  // Vertical distance
  shoulderAlignment: number;  // Left-right shoulder diff (lean)
}
```

## Calibration

During setup, 3 seconds of "good posture" frames are captured to establish baseline:

```typescript
interface CalibrationData {
  baseline: PostureMetrics;
  thresholds: {
    slump: number;
    lean: number;
    turtle: number;
  };
}
```

Stored in `sessionStorage['pendingCalibration']` and passed to active session.

## Posture Score Calculation

Score ranges from 0.0 (poor) to 1.0 (perfect). Calculated by comparing current metrics to calibrated baseline.

### 1. Slump Detection (50% weight)
Vertical compression—if eye-to-shoulder distance decreases significantly.

```typescript
const distanceRatio = current.eyeToShoulderDistance / baseline.eyeToShoulderDistance;
// Penalize if ratio < 0.85 (head dropped 15%+ closer to shoulders)
```

### 2. Lean Detection (20% weight)
Shoulder tilt—if shoulders are not level.

```typescript
const leanDiff = Math.abs(current.shoulderAlignment - baseline.shoulderAlignment);
// Penalize if diff > 0.05 (5% screen height)
```

### 3. Turtle Neck Detection (30% weight)
Forward head posture—nose moving forward relative to shoulders.

```typescript
const baseZDiff = baseline.noseZ - baseline.shoulderMidZ;
const currZDiff = current.noseZ - current.shoulderMidZ;
const zShift = baseZDiff - currZDiff;
// Penalize if zShift > 0.1
```

### Final Score

```typescript
score = slumpScore * 0.5 + leanScore * 0.2 + turtleScore * 0.3;
// Clamped to [0.0, 1.0]
```

## Detection Loop

In `/focus/active`, posture is processed at 200ms intervals:

```typescript
const processInterval = 200; // ms

const loop = (timestamp) => {
  if (timestamp - lastProcessTime < processInterval) {
    requestAnimationFrame(loop);
    return;
  }

  const results = landmarker.detectForVideo(video, timestamp);
  const metrics = calculateMetrics(results.landmarks[0]);
  const score = calculatePostureScore(metrics, calibration);

  // Smooth with EMA
  smoothedScore = prevScore * 0.2 + score * 0.8;

  requestAnimationFrame(loop);
};
```

## Data Persistence

- **Every 5 seconds:** Log `{ timestamp, score }` to local state
- **Every 30 seconds:** Sync pending logs to Supabase via PUT `/api/sessions`
- **Session end:** Final sync of remaining logs

## Visual Feedback

Posture status displayed based on score:
- `≥ 0.8`: EXCELLENT (emerald)
- `≥ 0.6`: GOOD (green)
- `≥ 0.4`: FAIR (yellow)
- `< 0.4`: NEEDS ATTENTION (red)

## Future: Fatigue Detection

MediaPipe Face Mesh can add fatigue detection:
- Eye Aspect Ratio (EAR) for drowsiness
- Blink rate analysis
- Yawn detection via mouth landmarks
- Head droop via pose estimation

Would be stored as `type: 'fatigue'` in `biometric_logs`.
