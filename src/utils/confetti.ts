import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  try {
    // Warm Sunrise & Lagoon themed colors: #FF5F45, #FF8A3D, #FFC04D, #0EA5A0, #22C3B5
    const colors = ['#FF5F45', '#FF8A3D', '#FFC04D', '#0EA5A0', '#22C3B5'];
    
    // First burst
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors,
      disableForReducedMotion: true,
    });

    // Secondary subtle celebratory shower
    setTimeout(() => {
      confetti({
        particleCount: 35,
        angle: 60,
        spread: 55,
        origin: { x: 0.2, y: 0.65 },
        colors,
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 35,
        angle: 120,
        spread: 55,
        origin: { x: 0.8, y: 0.65 },
        colors,
        disableForReducedMotion: true,
      });
    }, 200);
  } catch (e) {
    // Graceful no-op in headless or reduced motion environments
    console.debug('Confetti suppressed:', e);
  }
}
