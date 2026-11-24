// Procedural Web Audio API sound effects (zero external asset dependencies)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;
  private lastCarSoundAt = 0;

  public setEnabled(value: boolean) {
    this.enabled = value;
  }

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainLevel = 0.06,
    delay = 0,
    endFreq?: number,
  ) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), now + duration);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainLevel, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public playSelect() {
    this.playTone(540, 0.08, 'triangle', 0.045, 0, 720);
  }

  public playScan() {
    this.playTone(420, 0.14, 'sine', 0.04, 0, 680);
    this.playTone(680, 0.16, 'sine', 0.035, 0.09, 920);
  }

  public playSuccess() {
    this.playTone(523.25, 0.14, 'triangle', 0.055, 0);
    this.playTone(659.25, 0.14, 'triangle', 0.055, 0.08);
    this.playTone(783.99, 0.24, 'triangle', 0.06, 0.16);
  }

  public playPartial() {
    this.playTone(440, 0.14, 'triangle', 0.05, 0);
    this.playTone(554.37, 0.2, 'triangle', 0.045, 0.1);
  }

  public playError() {
    this.playTone(260, 0.16, 'sawtooth', 0.035, 0, 190);
    this.playTone(190, 0.2, 'sawtooth', 0.03, 0.12, 145);
  }

  public playComplete() {
    this.playTone(523.25, 0.14, 'triangle', 0.05, 0);
    this.playTone(659.25, 0.14, 'triangle', 0.05, 0.09);
    this.playTone(783.99, 0.14, 'triangle', 0.05, 0.18);
    this.playTone(1046.5, 0.34, 'triangle', 0.065, 0.27);
  }

  // Subtle passing vehicle Doppler whoosh when focused on the public street
  public playPassingCar() {
    const nowMs = performance.now();
    if (nowMs - this.lastCarSoundAt < 4500) return;
    const ctx = this.getContext();
    if (!ctx || ctx.state !== 'running') return;
    this.lastCarSoundAt = nowMs;

    const duration = 1.25;
    const sampleCount = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.35;
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.6;
    const now = ctx.currentTime;
    filter.frequency.setValueAtTime(340, now);
    filter.frequency.exponentialRampToValueAtTime(160, now + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.025, now + duration * 0.42);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(now);
    src.stop(now + duration);
  }
}

export const soundEngine = new SoundEngine();
