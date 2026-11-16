
function vibrate(type) {
  if (!GAME_CONFIG.haptic.enabled || !navigator.vibrate) return;
  const value = GAME_CONFIG.haptic[type];
  if (value) {
    navigator.vibrate(0);
    navigator.vibrate(value);
  }
}
