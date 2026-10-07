/**
 * Web Audio API synthesizer for Norse UI sound effects & beat playback
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private musicOsc: OscillatorNode | null = null;
  private musicGain: GainNode | null = null;
  private isMusicPlaying = false;
  private beatInterval: number | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Heavy Nordic stone / drum menu select
  playSelect() {
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // High metallic runic equip chime
  playEquip() {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      // Base hit
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(520, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Frost shimmer harmonic
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1240, now);
      gain2.gain.setValueAtTime(0.15, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.45);
    } catch {
      // Audio fallback
    }
  }

  // Tab navigation bumper shift
  playBumper() {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio fallback
    }
  }

  // MAKE IT FIRE 🔥 War Horn & Runic Burst
  playMakeItFire() {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      // Deep war horn / brass drone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(92, now);
      osc.frequency.linearRampToValueAtTime(138, now + 0.4);
      osc.frequency.exponentialRampToValueAtTime(55, now + 1.2);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.4);

      // Bass impact kick
      const kickOsc = ctx.createOscillator();
      const kickGain = ctx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(180, now + 0.3);
      kickOsc.frequency.exponentialRampToValueAtTime(38, now + 0.7);
      kickGain.gain.setValueAtTime(0.5, now + 0.3);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      kickOsc.connect(kickGain);
      kickGain.connect(ctx.destination);
      kickOsc.start(now + 0.3);
      kickOsc.stop(now + 0.85);
    } catch {
      // Audio fallback
    }
  }

  // Toggle synthesized EDM / Cinematic rhythm track for beat synchronization
  toggleMusicBeat(bpm = 128, onBeat?: (beatNumber: number) => void): boolean {
    const ctx = this.initCtx();
    if (this.isMusicPlaying) {
      if (this.beatInterval) {
        window.clearInterval(this.beatInterval);
        this.beatInterval = null;
      }
      this.isMusicPlaying = false;
      return false;
    }

    this.isMusicPlaying = true;
    const intervalMs = (60 / bpm) * 1000;
    let beatCount = 0;

    const playClick = () => {
      if (!this.isMusicPlaying) return;
      try {
        const now = ctx.currentTime;
        const isDownbeat = beatCount % 4 === 0;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = isDownbeat ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(isDownbeat ? 150 : 800, now);
        osc.frequency.exponentialRampToValueAtTime(isDownbeat ? 40 : 200, now + 0.06);

        gain.gain.setValueAtTime(isDownbeat ? 0.35 : 0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);

        if (onBeat) onBeat(beatCount);
        beatCount++;
      } catch {
        // Fallback
      }
    };

    playClick();
    this.beatInterval = window.setInterval(playClick, intervalMs);
    return true;
  }

  stopMusic() {
    if (this.beatInterval) {
      window.clearInterval(this.beatInterval);
      this.beatInterval = null;
    }
    this.isMusicPlaying = false;
  }
}

export const sounds = new SoundController();
