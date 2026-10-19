// Procedural Web Audio Engine for Mood Garden AI
// Generates soothing nature ambient sounds and reward chimes without external mp3 files

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentAmbientNodes: { stop: () => void } | null = null;
  private currentTheme: string = 'none';
  private masterGain: GainNode | null = null;
  private volume: number = 0.5;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  // Celebratory flower bloom chime / Tibetan singing bowl chime
  public playBloomChime() {
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      // Pentatonic celebratory arpeggio: C5, E5, G5, B5, C6
      const freqs = [523.25, 659.25, 783.99, 987.77, 1046.5];
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.09 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 1.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 1.3);
      });
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  // Micro-task check chime (delicate crystal bell)
  public playStepCompleteChime() {
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      [880, 1174.66].forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.8);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.85);
      });
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  // Gentle water drop sound for garden watering
  public playWaterDrop() {
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.1);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {
      // ignore
    }
  }

  // Ambient Sound Generator: Rain, Birds, Breeze, Stream
  public startAmbient(theme: 'gentle_rain' | 'forest_birds' | 'zen_stream' | 'summer_breeze' | 'none') {
    this.stopAmbient();
    if (theme === 'none') {
      this.currentTheme = 'none';
      return;
    }

    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;
      this.currentTheme = theme;

      if (theme === 'gentle_rain') {
        // Pink/brown noise filtered for rain
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99 * b0 + white * 0.05;
          b1 = 0.95 * b1 + white * 0.1;
          b2 = 0.85 * b2 + white * 0.2;
          data[i] = (b0 + b1 + b2) * 0.25;
        }

        const rainSource = this.ctx.createBufferSource();
        rainSource.buffer = buffer;
        rainSource.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);

        rainSource.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        rainSource.start();
        this.currentAmbientNodes = {
          stop: () => {
            try {
              rainSource.stop();
              rainSource.disconnect();
            } catch (err) {}
          },
        };
      } else if (theme === 'zen_stream') {
        // Trickling water stream: filtered noise with subtle modulation
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.3;
        }

        const streamSource = this.ctx.createBufferSource();
        streamSource.buffer = buffer;
        streamSource.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(650, this.ctx.currentTime);
        filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);

        streamSource.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        streamSource.start();
        this.currentAmbientNodes = {
          stop: () => {
            try {
              streamSource.stop();
              streamSource.disconnect();
            } catch (err) {}
          },
        };
      } else if (theme === 'summer_breeze') {
        // Soft whispering wind
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.2;
        }

        const windSource = this.ctx.createBufferSource();
        windSource.buffer = buffer;
        windSource.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, this.ctx.currentTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

        windSource.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        windSource.start();
        this.currentAmbientNodes = {
          stop: () => {
            try {
              windSource.stop();
              windSource.disconnect();
            } catch (err) {}
          },
        };
      } else if (theme === 'forest_birds') {
        // Gentle intermittent singing birds + soft rustling background
        let isRunning = true;
        let birdTimer: any = null;

        const playBirdChirp = () => {
          if (!isRunning || !this.ctx || !this.masterGain) return;
          try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            const baseFreq = 2600 + Math.random() * 800;
            osc.frequency.setValueAtTime(baseFreq, now);
            osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, now + 0.08);
            osc.frequency.exponentialRampToValueAtTime(baseFreq - 200, now + 0.16);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.06, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now);
            osc.stop(now + 0.22);
          } catch (e) {}

          const nextInterval = 2500 + Math.random() * 3500;
          birdTimer = setTimeout(playBirdChirp, nextInterval);
        };

        playBirdChirp();

        this.currentAmbientNodes = {
          stop: () => {
            isRunning = false;
            if (birdTimer) clearTimeout(birdTimer);
          },
        };
      }
    } catch (err) {
      console.warn('Ambient play failed', err);
    }
  }

  public stopAmbient() {
    if (this.currentAmbientNodes) {
      try {
        this.currentAmbientNodes.stop();
      } catch (e) {}
      this.currentAmbientNodes = null;
    }
  }
}

export const soundEngine = new SoundEngine();
