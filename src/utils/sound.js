let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // iOS Safari는 suspended 상태로 시작할 수 있어 resume 필요
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playNote(ctx, freq, type, volume, startTime, duration) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.01);
}

/** 추첨 중 슬롯 틱 소리 */
export function playTick() {
  try {
    const ctx = getCtx();
    const t   = ctx.currentTime;
    playNote(ctx, 880, 'square', 0.12, t, 0.04);
  } catch (_) { /* ignore */ }
}

/**
 * 일반 당첨 팡파르 (2등 이하)
 * 상승 아르페지오(C5→E5→G5→C6) 후 화음으로 마무리
 */
export function playFanfare() {
  try {
    const ctx   = getCtx();
    const arpeg = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6

    arpeg.forEach((freq, i) => {
      playNote(ctx, freq, 'triangle', 0.35, ctx.currentTime + i * 0.1, 0.3);
    });

    const chordStart = ctx.currentTime + 0.48;
    arpeg.forEach((freq) => {
      playNote(ctx, freq, 'triangle', 0.22, chordStart, 1.1);
    });
    playNote(ctx, 261.63, 'sine', 0.3, chordStart, 1.1); // C4 베이스
  } catch (_) { /* ignore */ }
}

/**
 * 킥드럼 효과 (150Hz → 40Hz 피치 드롭)
 */
function playKick(ctx, startTime, volume = 0.7) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(160, startTime);
  osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.12);
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);
  osc.start(startTime);
  osc.stop(startTime + 0.2);
}

/**
 * 1등 그랜드 팡파르
 * 드럼롤 → 트럼펫 상승 → 클라이맥스 화음
 * 총 재생 시간: 약 3.5초
 */
export function playGrandFanfare() {
  try {
    const ctx = getCtx();
    const t   = ctx.currentTime;

    // ── 1. 드럼롤 (0.0 ~ 0.55s) ──────────────────────────────
    // 점점 빨라지는 킥 드럼 8연타
    const rollBeats = [0, 0.12, 0.22, 0.31, 0.39, 0.46, 0.51, 0.55];
    rollBeats.forEach((offset) => playKick(ctx, t + offset, 0.6));

    // ── 2. 트럼펫 스타일 팡파르 멜로디 (0.65s~) ──────────────
    // "솔-도-미-솔(길게)-도(클라이맥스)" 패턴
    const melody = [
      { freq: 392.00, start: 0.65, dur: 0.18 }, // G4
      { freq: 523.25, start: 0.86, dur: 0.18 }, // C5
      { freq: 659.25, start: 1.07, dur: 0.18 }, // E5
      { freq: 783.99, start: 1.28, dur: 0.45 }, // G5 (held)
      { freq: 1046.5, start: 1.80, dur: 1.20 }, // C6 (triumphant)
    ];

    melody.forEach(({ freq, start, dur }) => {
      // square + 옥타브 배음으로 트럼펫 질감 강화
      playNote(ctx, freq,      'square',   0.28, t + start, dur);
      playNote(ctx, freq * 2,  'sine',     0.07, t + start, dur);
    });

    // ── 3. 클라이맥스 직전 킥 악센트 ────────────────────────
    playKick(ctx, t + 1.75, 0.9);

    // ── 4. 풀 오케스트라 화음 (1.82s~) ─────────────────────
    // C2(베이스) + C3 + G3 + C4 + E4 + G4 + C5 + E5 + G5 + C6
    const chordStart = t + 1.82;
    const chordNotes = [
      { freq:  65.41, type: 'sine',     vol: 0.45 }, // C2 베이스
      { freq: 130.81, type: 'sine',     vol: 0.35 }, // C3
      { freq: 196.00, type: 'triangle', vol: 0.25 }, // G3
      { freq: 261.63, type: 'triangle', vol: 0.28 }, // C4
      { freq: 329.63, type: 'triangle', vol: 0.22 }, // E4
      { freq: 392.00, type: 'triangle', vol: 0.20 }, // G4
      { freq: 523.25, type: 'triangle', vol: 0.20 }, // C5
      { freq: 659.25, type: 'triangle', vol: 0.16 }, // E5
      { freq: 783.99, type: 'triangle', vol: 0.14 }, // G5
      { freq: 1046.5, type: 'triangle', vol: 0.12 }, // C6
    ];
    chordNotes.forEach(({ freq, type, vol }) => {
      playNote(ctx, freq, type, vol, chordStart, 1.8);
    });

    // ── 5. 마지막 킥 2연타로 마무리 ────────────────────────
    playKick(ctx, t + 1.82, 1.0);
    playKick(ctx, t + 2.05, 0.7);
  } catch (_) { /* ignore */ }
}
