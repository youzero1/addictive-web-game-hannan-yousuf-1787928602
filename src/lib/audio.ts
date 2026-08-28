type SoundName = 'move' | 'merge' | 'power' | 'win' | 'lose' | 'unlock';

let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(next: boolean) {
  muted = next;
}

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!ctx) {
      const Ctor: typeof AudioContext =
        window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function blip(freq: number, duration: number, type: OscillatorType, gain = 0.06, delay = 0) {
  const audio = ensureContext();
  if (!audio) return;
  const start = audio.currentTime + delay;
  const osc = audio.createOscillator();
  const vol = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  vol.gain.setValueAtTime(0.0001, start);
  vol.gain.exponentialRampToValueAtTime(gain, start + 0.012);
  vol.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(vol).connect(audio.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export function play(name: SoundName, intensity = 1) {
  if (muted) return;
  switch (name) {
    case 'move':
      blip(180, 0.06, 'triangle', 0.03);
      break;
    case 'merge':
      blip(320 + Math.min(intensity, 8) * 55, 0.12, 'square', 0.05);
      blip(640 + Math.min(intensity, 8) * 60, 0.09, 'sine', 0.03, 0.03);
      break;
    case 'power':
      blip(520, 0.09, 'sawtooth', 0.04);
      blip(760, 0.1, 'sine', 0.035, 0.06);
      break;
    case 'win':
      [523, 659, 784, 1046].forEach((f, i) => blip(f, 0.18, 'triangle', 0.05, i * 0.1));
      break;
    case 'lose':
      [392, 330, 262].forEach((f, i) => blip(f, 0.22, 'sawtooth', 0.04, i * 0.12));
      break;
    case 'unlock':
      [784, 988, 1318].forEach((f, i) => blip(f, 0.14, 'sine', 0.045, i * 0.08));
      break;
  }
}
