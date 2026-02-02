// Sound effects utility using Web Audio API
class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled = true;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
    if (!this.enabled) return;
    
    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context not available
    }
  }

  correct() {
    this.playTone(523.25, 0.1, 'sine', 0.2); // C5
    setTimeout(() => this.playTone(659.25, 0.15, 'sine', 0.2), 100); // E5
  }

  incorrect() {
    this.playTone(200, 0.2, 'sawtooth', 0.15);
  }

  click() {
    this.playTone(800, 0.05, 'sine', 0.1);
  }

  combo() {
    this.playTone(440, 0.1, 'sine', 0.2); // A4
    setTimeout(() => this.playTone(554.37, 0.1, 'sine', 0.2), 80); // C#5
    setTimeout(() => this.playTone(659.25, 0.15, 'sine', 0.2), 160); // E5
  }

  fever() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.2), i * 100);
    });
  }

  gameOver() {
    this.playTone(392, 0.3, 'sine', 0.2); // G4
    setTimeout(() => this.playTone(349.23, 0.3, 'sine', 0.2), 300); // F4
    setTimeout(() => this.playTone(329.63, 0.5, 'sine', 0.2), 600); // E4
  }

  tick() {
    this.playTone(1000, 0.02, 'sine', 0.05);
  }
}

export const sound = new SoundManager();
