import { useEffect, useRef } from 'react';

export default function MatrixRain({ opacity = 0.18 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()アイウエオカキクケコサシスセソ';
    const fontSize = 13;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const brightness = Math.random();

        if (brightness > 0.97) {
          ctx.fillStyle = '#ffffff';
        } else if (brightness > 0.85) {
          ctx.fillStyle = '#7fff00';
        } else {
          ctx.fillStyle = '#00ff41';
        }

        ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;
        ctx.globalAlpha = opacity;
        ctx.fillText(char, i * fontSize, y * fontSize);
        ctx.globalAlpha = 1;

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    };

    const interval = setInterval(draw, 45);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  );
}