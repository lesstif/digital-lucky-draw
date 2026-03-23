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
 * 당첨 팡파르
 * 상승 아르페지오(C5→E5→G5→C6) 후 화음으로 마무리
 */
export function playFanfare() {
  try {
    const ctx   = getCtx();
    const arpeg = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6

    // 빠른 상승 아르페지오
    arpeg.forEach((freq, i) => {
      playNote(ctx, freq, 'triangle', 0.35, ctx.currentTime + i * 0.1, 0.3);
    });

    // 풀 화음 (지속)
    const chordStart = ctx.currentTime + 0.48;
    arpeg.forEach((freq) => {
      playNote(ctx, freq, 'triangle', 0.22, chordStart, 1.1);
    });
    // 베이스 보강
    playNote(ctx, 261.63, 'sine', 0.3, chordStart, 1.1); // C4
  } catch (_) { /* ignore */ }
}
