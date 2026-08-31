import React, { useEffect, useRef } from 'react';

export function WaveformVisualizer({ isRecording, isPaused, audioStream }) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (isRecording && !isPaused && audioStream) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
          analyserRef.current = audioContextRef.current.createAnalyser();
          const source = audioContextRef.current.createMediaStreamSource(audioStream);
          source.connect(analyserRef.current);
          analyserRef.current.fftSize = 64;
          const bufferLength = analyserRef.current.frequencyBinCount;
          dataArrayRef.current = new Uint8Array(bufferLength);
        }

        const draw = () => {
          animationFrameRef.current = requestAnimationFrame(draw);
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const barWidth = (canvas.width / dataArrayRef.current.length) * 1.5;
          let barHeight;
          let x = 0;

          for (let i = 0; i < dataArrayRef.current.length; i++) {
            barHeight = (dataArrayRef.current[i] / 255) * (canvas.height * 0.8) + 4;

            // Gradient from emerald to teal
            const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
            gradient.addColorStop(0, '#10b981');
            gradient.addColorStop(1, '#059669');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(x, (canvas.height - barHeight) / 2, barWidth - 3, barHeight, 3);
            ctx.fill();

            x += barWidth + 2;
          }
        };

        draw();
      } catch (e) {
        console.warn('Web Audio API analyser error, using simulated wave:', e);
      }
    } else {
      // Idle / Paused wave drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 24;
      const barWidth = canvas.width / bars;
      for (let i = 0; i < bars; i++) {
        const barHeight = isPaused ? 6 : 4;
        ctx.fillStyle = isPaused ? '#f59e0b' : '#cbd5e1';
        ctx.beginPath();
        ctx.roundRect(i * barWidth + 2, (canvas.height - barHeight) / 2, barWidth - 4, barHeight, 2);
        ctx.fill();
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && (!isRecording || isPaused)) {
        // audioContext clean-up if stopped
      }
    };
  }, [isRecording, isPaused, audioStream]);

  return (
    <div className="w-full h-24 bg-slate-900/5 rounded-2xl flex items-center justify-center p-4 border border-slate-200/60 overflow-hidden">
      <canvas
        ref={canvasRef}
        width={400}
        height={80}
        className="w-full h-full max-w-lg"
      />
    </div>
  );
}
