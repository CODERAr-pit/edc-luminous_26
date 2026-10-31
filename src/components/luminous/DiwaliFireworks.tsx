import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  radius: number;
  gravity: number;
  friction: number;
  decay: number;
  flicker: boolean;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  trailColor: string;
  type: "chrysanthemum" | "willow" | "crackle" | "ring";
}

interface DiwaliFireworksProps {
  isActive: boolean;
  triggerKey: number;
  origin?: { x: number; y: number } | null;
  onDone?: () => void;
}

const FESTIVE_PALETTES: string[][] = [
  // Golden Diya
  ["#ffe082", "#ffd54f", "#ffb300", "#ff8f00", "#fff8e1"],
  // Royal Diwali Vermilion & Gold
  ["#ff5252", "#ff1744", "#ffd700", "#ff6b35", "#ffb703"],
  // Peacock Blue & Gold
  ["#00e5ff", "#00b0ff", "#ffd700", "#326d9c", "#80d8ff"],
  // Emerald & Ruby
  ["#00e676", "#1de9b6", "#ff1744", "#ffd700", "#b9f6ca"],
  // Festive Magenta & Amber
  ["#f50057", "#ff4081", "#ffab00", "#ffd700", "#ea80fc"],
];

// Singleton AudioContext and cached noise buffer for 0 audio-thread hiccups
let sharedAudioCtx: AudioContext | null = null;
let cachedNoiseBuffer: AudioBuffer | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!sharedAudioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        sharedAudioCtx = new AudioContextClass();
      }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

function getNoiseBuffer(ctx: AudioContext): AudioBuffer | null {
  try {
    if (!cachedNoiseBuffer || cachedNoiseBuffer.sampleRate !== ctx.sampleRate) {
      const bufferSize = Math.floor(ctx.sampleRate * 0.16);
      cachedNoiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = cachedNoiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
      }
    }
    return cachedNoiseBuffer;
  } catch {
    return null;
  }
}

function playBurstSound(type: "launch" | "burst") {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (type === "launch") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } else {
      const buffer = getNoiseBuffer(ctx);
      if (!buffer) return;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(620, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.2);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.045, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    }
  } catch {
    // Audio is optional enhancement — safely ignore if blocked
  }
}

export function DiwaliFireworks({ isActive, triggerKey, origin, onDone }: DiwaliFireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rocketsRef = useRef<Rocket[]>([]);
  const timeoutsRef = useRef<number[]>([]);
  const frameCounterRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Detect mobile device to apply lightweight, smooth graphics profile
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 ||
        (typeof navigator !== "undefined" &&
          navigator.maxTouchPoints > 0 &&
          window.innerWidth < 1024));

    // Cap DPR on mobile to 1 to reduce canvas pixel-fill overhead by 75-89%
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    const maxParticles = isMobile ? 120 : 340;

    const createBurst = (
      x: number,
      y: number,
      palette: string[],
      type: "chrysanthemum" | "willow" | "crackle" | "ring" = "chrysanthemum",
    ) => {
      playBurstSound("burst");

      // Adaptive particle counts tuned for high visual quality without frame drops
      let count: number;
      if (type === "ring") {
        count = isMobile ? 24 : 54;
      } else if (type === "willow") {
        count = isMobile ? 38 : 76;
      } else {
        count = isMobile ? 30 : 64;
      }

      // If particle buffer is full on mobile, gracefully clamp to keep 60 FPS
      const availableSlots = Math.max(8, maxParticles - particlesRef.current.length);
      const actualCount = Math.min(count, availableSlots);

      if (type === "ring") {
        for (let i = 0; i < actualCount; i++) {
          const angle = (i / actualCount) * Math.PI * 2;
          const speed = (isMobile ? 3.4 : 4.0) + (i % 2 === 0 ? 1.4 : 0);
          const color = palette[i % palette.length] ?? "#ffd700";
          particlesRef.current.push({
            x,
            y,
            prevX: x,
            prevY: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color,
            radius: isMobile ? 1.8 : 2.2,
            gravity: 0.04,
            friction: 0.96,
            decay: isMobile ? 0.022 : 0.016,
            flicker: true,
          });
        }
        return;
      }

      const isWillow = type === "willow";
      for (let i = 0; i < actualCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = isWillow
          ? (isMobile ? 1.2 : 1.5) + Math.random() * (isMobile ? 3.8 : 5.0)
          : (isMobile ? 1.8 : 2.0) + Math.random() * (isMobile ? 4.8 : 6.2);

        const color = palette[Math.floor(Math.random() * palette.length)] ?? "#ffd700";
        particlesRef.current.push({
          x,
          y,
          prevX: x,
          prevY: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          radius: isWillow
            ? isMobile
              ? 1.4 + Math.random() * 0.8
              : 1.8 + Math.random() * 1.2
            : isMobile
              ? 1.6 + Math.random() * 1.0
              : 2.0 + Math.random() * 1.4,
          gravity: isWillow ? 0.05 : 0.07,
          friction: isWillow ? 0.955 : 0.94,
          decay: isWillow
            ? (isMobile ? 0.013 : 0.009) + Math.random() * 0.006
            : (isMobile ? 0.018 : 0.014) + Math.random() * 0.009,
          flicker: type === "crackle" ? Math.random() > 0.4 : Math.random() > 0.7,
        });
      }
    };

    const launchRocket = (startX: number, startY: number, targetY: number, targetX?: number) => {
      playBurstSound("launch");
      const destX = targetX ?? startX + (Math.random() * 100 - 50);
      const distanceY = startY - targetY;
      const vy = -Math.max(9, Math.min(17, Math.sqrt(distanceY * 0.68)));
      const steps = Math.abs(distanceY / vy);
      const vx = (destX - startX) / steps;

      const types: Array<"chrysanthemum" | "willow" | "crackle" | "ring"> = [
        "chrysanthemum",
        "willow",
        "crackle",
        "ring",
      ];
      const randomType = types[Math.floor(Math.random() * types.length)] ?? "chrysanthemum";

      rocketsRef.current.push({
        x: startX,
        y: startY,
        targetY,
        vx,
        vy,
        color: "#ffe082",
        trailColor: "#ff9100",
        type: randomType,
      });
    };

    // Trigger anar (fountain) from rangoli center if available
    if (origin) {
      const fountainCount = isMobile ? 20 : 38;
      const fountainColors = ["#ffd700", "#ffb300", "#ff6b35", "#fff59d"];
      for (let i = 0; i < fountainCount; i++) {
        const spread = (Math.random() - 0.5) * (isMobile ? 3.5 : 4.5);
        const upwardSpeed = -(isMobile ? 3.5 + Math.random() * 5.5 : 4 + Math.random() * 7);
        const color = fountainColors[i % fountainColors.length] ?? "#ffd700";
        particlesRef.current.push({
          x: origin.x + (Math.random() - 0.5) * 16,
          y: origin.y,
          prevX: origin.x,
          prevY: origin.y,
          vx: spread,
          vy: upwardSpeed,
          alpha: 1,
          color,
          radius: isMobile ? 1.6 + Math.random() * 1.0 : 2.0 + Math.random() * 1.5,
          gravity: 0.12,
          friction: 0.97,
          decay: isMobile ? 0.022 + Math.random() * 0.01 : 0.016 + Math.random() * 0.01,
          flicker: true,
        });
      }
    }

    // Schedule fireworks choreography
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    const scheduleRocket = (delayMs: number, xRatio: number, targetYRatio: number) => {
      const tid = window.setTimeout(() => {
        const startX = viewportW * xRatio;
        const startY = viewportH + 20;
        const targetY = viewportH * targetYRatio;
        launchRocket(startX, startY, targetY);
      }, delayMs);
      timeoutsRef.current.push(tid);
    };

    if (isMobile) {
      // Mobile choreography: 5 focused, punchy bursts spaced nicely to protect frame rates
      scheduleRocket(100, 0.45, 0.28);
      scheduleRocket(950, 0.28, 0.32);
      scheduleRocket(1700, 0.72, 0.26);
      scheduleRocket(2500, 0.5, 0.2);
      scheduleRocket(3200, 0.38, 0.3);
    } else {
      // Desktop choreography: full festive celebration
      scheduleRocket(100, 0.35, 0.28);
      scheduleRocket(250, 0.65, 0.22);
      scheduleRocket(900, 0.2, 0.35);
      scheduleRocket(1200, 0.8, 0.3);
      scheduleRocket(2100, 0.5, 0.18);
      scheduleRocket(2350, 0.38, 0.25);
      scheduleRocket(2500, 0.62, 0.24);
      scheduleRocket(3400, 0.28, 0.32);
      scheduleRocket(3700, 0.72, 0.28);
    }

    // End notification after fireworks finish
    const endTid = window.setTimeout(() => {
      if (onDone) onDone();
    }, isMobile ? 5500 : 7500);
    timeoutsRef.current.push(endTid);

    // Main animation loop
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.67, 2);
      lastTime = now;
      frameCounterRef.current++;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. Update & render rockets
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const r = rocketsRef.current[i];
        if (!r) continue;

        r.x += r.vx * dt;
        r.y += r.vy * dt;
        r.vy += 0.08 * dt; // gravity deceleration

        // Emit rocket sparks only periodically to save particle overhead
        const emitInterval = isMobile ? 3 : 2;
        if (
          frameCounterRef.current % emitInterval === 0 &&
          particlesRef.current.length < maxParticles
        ) {
          particlesRef.current.push({
            x: r.x + (Math.random() - 0.5) * 3,
            y: r.y + (Math.random() - 0.5) * 3,
            prevX: r.x,
            prevY: r.y,
            vx: (Math.random() - 0.5) * 1.2,
            vy: Math.random() * 1.5 + 0.8,
            alpha: 0.85,
            color: r.trailColor,
            radius: isMobile ? 1.2 : 1.5,
            gravity: 0.04,
            friction: 0.92,
            decay: 0.05,
            flicker: false,
          });
        }

        // Draw rocket head (hardware-accelerated, zero shadowBlur Gaussian overhead)
        ctx.beginPath();
        ctx.arc(r.x, r.y, isMobile ? 2.0 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.fill();

        // Check if rocket reached apex
        if (r.y <= r.targetY || r.vy >= -1) {
          rocketsRef.current.splice(i, 1);
          const palette = FESTIVE_PALETTES[Math.floor(Math.random() * FESTIVE_PALETTES.length)] ?? [
            "#ffd700",
            "#ffb300",
            "#ff6b35",
          ];
          createBurst(r.x, r.y, palette, r.type);
        }
      }

      // 2. Update & render particles with GPU additive blending (no costly shadowBlur passes)
      ctx.globalCompositeOperation = "lighter";

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        if (!p) continue;

        p.prevX = p.x;
        p.prevY = p.y;

        p.vx *= Math.pow(p.friction, dt);
        p.vy = (p.vy + p.gravity * dt) * Math.pow(p.friction, dt);
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha -= p.decay * dt;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        const currentAlpha = p.flicker && Math.random() > 0.4 ? p.alpha * 0.35 : p.alpha;
        ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));

        // Draw spark motion streak from previous position (0 memory allocations!)
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.radius * (isMobile ? 1.1 : 1.3);
        ctx.beginPath();
        ctx.moveTo(p.prevX, p.prevY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // Draw spark luminous core
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Reset canvas composite state
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      // Keep running if there are active rockets or particles
      if (rocketsRef.current.length > 0 || particlesRef.current.length > 0) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        if (onDone) onDone();
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", updateSize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      timeoutsRef.current.forEach((id) => clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, [isActive, triggerKey, origin, onDone]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[120]"
      aria-hidden="true"
    />
  );
}
