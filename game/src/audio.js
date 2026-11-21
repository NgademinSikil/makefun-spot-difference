// Synthesised sound effects with the Web Audio API — no audio files.
// Every effect is a few oscillators with an envelope, built on first use.

export function createAudio() {
  let ctx = null;
  let muted = false;

  function ensure() {
    if (!ctx) {
      try {
        const AudioContext = window.AudioContext ?? window.webkitAudioContext;
        ctx = new AudioContext();
      } catch {
        ctx = null;
      }
    }
    if (ctx && ctx.state === 'suspended') void ctx.resume();
    return ctx;
  }

  function tone(freq, at, dur, type, gain) {
    const audio = ensure();
    if (!audio || muted) return;
    const osc = audio.createOscillator();
    const amp = audio.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    amp.gain.setValueAtTime(0, audio.currentTime + at);
    amp.gain.linearRampToValueAtTime(gain, audio.currentTime + at + 0.01);
    amp.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + at + dur);
    osc.connect(amp);
    amp.connect(audio.destination);
    osc.start(audio.currentTime + at);
    osc.stop(audio.currentTime + at + dur + 0.05);
  }

  return {
    get muted() {
      return muted;
    },
    toggleMute() {
      muted = !muted;
      return muted;
    },
    unlock() {
      ensure();
    },
    found() {
      tone(660, 0, 0.18, 'sine', 0.22);
      tone(880, 0.09, 0.25, 'sine', 0.22);
    },
    wrong() {
      tone(160, 0, 0.22, 'sawtooth', 0.12);
      tone(110, 0.05, 0.25, 'sawtooth', 0.1);
    },
    hint() {
      tone(520, 0, 0.12, 'triangle', 0.18);
      tone(780, 0.08, 0.16, 'triangle', 0.18);
    },
    level() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.2));
    },
    win() {
      [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.13, 0.35, 'triangle', 0.2));
    },
    timeout() {
      [392, 330, 262].forEach((f, i) => tone(f, i * 0.16, 0.3, 'sine', 0.18));
    },
    tick() {
      tone(980, 0, 0.06, 'square', 0.06);
    },
  };
}
