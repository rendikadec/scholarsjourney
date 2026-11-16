
let ctx = null;
let musicTimer = null;
let externalMusic = null;
let musicEnabled = true;
let sfxEnabled = true;

function setAudioSettings({ music, sfx }) {
  musicEnabled = music;
  sfxEnabled = sfx;
  if (!musicEnabled) stopMusic();
}

async function unlockAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') await ctx.resume();
}

function tone(freq, duration = 0.08, type = 'square', volume = 0.05, delay = 0) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const start = ctx.currentTime + delay;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.001, volume), start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.03);
}

function sfx(name) {
  if (!sfxEnabled || !ctx) return;
  const v = GAME_CONFIG.audio.sfxVolume * 0.08;
  if (name === 'click') tone(420, 0.05, 'square', v);
  if (name === 'pickup') { tone(660, 0.07, 'square', v); tone(880, 0.09, 'square', v, 0.06); }
  if (name === 'damage') { tone(105, 0.22, 'sawtooth', v * 1.7); tone(72, 0.24, 'square', v * 1.35, 0.035); tone(54, 0.16, 'sawtooth', v, 0.11); }
  if (name === 'correct') { tone(523, 0.08, 'square', v); tone(659, 0.08, 'square', v, 0.08); tone(784, 0.12, 'square', v, 0.16); }
  if (name === 'wrong') { tone(220, 0.12, 'sawtooth', v); tone(165, 0.18, 'sawtooth', v, 0.1); }
  if (name === 'skill') { tone(440, 0.08, 'triangle', v); tone(880, 0.16, 'triangle', v, 0.07); }
  if (name === 'attack') { tone(330, 0.04, 'square', v * 1.15); tone(660, 0.08, 'sawtooth', v, 0.035); }
  if (name === 'hit') { tone(185, 0.045, 'square', v * 1.15); tone(95, 0.07, 'sawtooth', v * 0.85, 0.015); }
  if (name === 'empty') { tone(145, 0.06, 'square', v * 0.8); }
  if (name === 'acc') [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', v * 1.5, i * 0.12));
}

function stopMusic({ resetExternal = true } = {}) {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
  if (externalMusic) {
    externalMusic.pause();
    if (resetExternal) {
      externalMusic.currentTime = 0;
      externalMusic = null;
    }
  }
}

function graduationMusicStatus() {
  if (!externalMusic) return 'stopped';
  return externalMusic.paused ? 'paused' : 'playing';
}

async function playGraduationTrack() {
  if (!GAME_CONFIG.audio.customGraduationMusic) return 'unavailable';
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
  if (!externalMusic) {
    externalMusic = new Audio(GAME_CONFIG.audio.customGraduationMusic);
    externalMusic.loop = true;
    externalMusic.preload = 'auto';
    externalMusic.volume = GAME_CONFIG.audio.musicVolume;
  }
  try {
    await externalMusic.play();
    return 'playing';
  } catch {
    return 'paused';
  }
}

async function toggleGraduationTrack() {
  if (externalMusic && !externalMusic.paused) {
    externalMusic.pause();
    return 'paused';
  }
  return playGraduationTrack();
}

function playSynthMusic(mode) {
  const patterns = {
    menu: [261.6, 329.6, 392, 329.6],
    campus: [293.7, 349.2, 440, 349.2],
    gameplay: [329.6, 392, 493.9, 392, 349.2, 440, 523.3, 440],
    boss: [220, 261.6, 293.7, 329.6, 293.7, 261.6],
    graduation: [392, 493.9, 587.3, 784]
  };
  const pattern = patterns[mode] || patterns.menu;
  let step = 0;
  const beat = mode === 'boss' ? 240 : mode === 'gameplay' ? 280 : 460;
  const playStep = () => {
    if (!musicEnabled || !ctx) return;
    const f = pattern[step % pattern.length];
    tone(f, beat / 1000 * 0.45, 'triangle', GAME_CONFIG.audio.musicVolume * 0.025);
    if (mode !== 'boss') tone(f / 2, beat / 1000 * 0.65, 'sine', GAME_CONFIG.audio.musicVolume * 0.015);
    step++;
  };
  playStep();
  musicTimer = setInterval(playStep, beat);
}

function playMusic(mode = 'menu') {
  stopMusic();
  if (!musicEnabled || !ctx) return;

  if (mode === 'graduation' && GAME_CONFIG.audio.customGraduationMusic) {
    playGraduationTrack();
    return;
  }

  playSynthMusic(mode);
}
