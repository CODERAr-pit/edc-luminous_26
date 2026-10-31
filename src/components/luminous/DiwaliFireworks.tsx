import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  radius: number;
  gravity: number;
  friction: number;
  decay: number;
  flicker: boolean;
  trail: { x: number; y: number }[];
  trailLength: number;
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

function playBurstSound(type: "launch" | "burst") {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === "launch") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.28);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } else {
      const bufferSize = Math.floor(ctx.sampleRate * 0.16);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(650, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.22);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);
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

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle canvas dimensions with Retina DPR
    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    const createBurst = (
      x: number,
      y: number,
      palette: string[],
      type: "chrysanthemum" | "willow" | "crackle" | "ring" = "chrysanthemum",
    ) => {
      playBurstSound("burst");
      const count = type === "willow" ? 110 : type === "ring" ? 64 : 85;

      if (type === "ring") {
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const speed = 4.2 + (i % 2 === 0 ? 1.6 : 0);
          const color = palette[i % palette.length] ?? "#ffd700";
          particlesRef.current.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color,
            radius: 2.2,
            gravity: 0.04,
            friction: 0.96,
            decay: 0.015,
            flicker: true,
            trail: [],
            trailLength: 3,
          });
        }
        return;
      }

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = type === "willow" ? 1.5 + Math.random() * 5.2 : 2 + Math.random() * 6.5;

        const isWillow = type === "willow";
        const color = palette[Math.floor(Math.random() * palette.length)] ?? "#ffd700";
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          radius: isWillow ? 1.8 + Math.random() * 1.4 : 2 + Math.random() * 1.5,
          gravity: isWillow ? 0.05 : 0.07,
          friction: isWillow ? 0.955 : 0.94,
          decay: isWillow ? 0.009 + Math.random() * 0.005 : 0.014 + Math.random() * 0.008,
          flicker: type === "crackle" ? Math.random() > 0.4 : Math.random() > 0.7,
          trail: [],
          trailLength: isWillow ? 5 : 3,
        });
      }
    };

    const launchRocket = (startX: number, startY: number, targetY: number, targetX?: number) => {
      playBurstSound("launch");
      const destX = targetX ?? startX + (Math.random() * 120 - 60);
      const distanceY = startY - targetY;
      const vy = -Math.max(10, Math.min(18, Math.sqrt(distanceY * 0.7)));
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
      const fountainCount = 45;
      const fountainColors = ["#ffd700", "#ffb300", "#ff6b35", "#fff59d"];
      for (let i = 0; i < fountainCount; i++) {
        const spread = (Math.random() - 0.5) * 4.5;
        const upwardSpeed = -(4 + Math.random() * 7);
        const color = fountainColors[i % fountainColors.length] ?? "#ffd700";
        particlesRef.current.push({
          x: origin.x + (Math.random() - 0.5) * 20,
          y: origin.y,
          vx: spread,
          vy: upwardSpeed,
          alpha: 1,
          color,
          radius: 2 + Math.random() * 1.8,
          gravity: 0.12,
          friction: 0.97,
          decay: 0.016 + Math.random() * 0.01,
          flicker: true,
          trail: [],
          trailLength: 4,
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

    // Wave 1: Immediate bursts
    scheduleRocket(100, 0.35, 0.28);
    scheduleRocket(250, 0.65, 0.22);

    // Wave 2: Side salvo
    scheduleRocket(900, 0.2, 0.35);
    scheduleRocket(1200, 0.8, 0.3);

    // Wave 3: Center grand finale
    scheduleRocket(2100, 0.5, 0.18);
    scheduleRocket(2350, 0.38, 0.25);
    scheduleRocket(2500, 0.62, 0.24);

    // Wave 4: Twilight sparkle
    scheduleRocket(3400, 0.28, 0.32);
    scheduleRocket(3700, 0.72, 0.28);

    // End notification after fireworks finish
    const endTid = window.setTimeout(() => {
      if (onDone) onDone();
    }, 7500);
    timeoutsRef.current.push(endTid);

    // Main animation loop
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.67, 2);
      lastTime = now;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. Update & render rockets
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const r = rocketsRef.current[i];
        if (!r) continue;

        r.x += r.vx * dt;
        r.y += r.vy * dt;
        r.vy += 0.08 * dt; // gravity deceleration

        // Spark trail behind rocket
        for (let s = 0; s < 2; s++) {
          particlesRef.current.push({
            x: r.x + (Math.random() - 0.5) * 4,
            y: r.y + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 2 + 1,
            alpha: 0.9,
            color: r.trailColor,
            radius: 1.5,
            gravity: 0.04,
            friction: 0.92,
            decay: 0.05,
            flicker: false,
            trail: [],
            trailLength: 0,
          });
        }

        // Rocket head
        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();

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

      // 2. Update & render particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        if (!p) continue;

        if (p.trailLength > 0) {
          p.trail.unshift({ x: p.x, y: p.y });
          if (p.trail.length > p.trailLength) {
            p.trail.pop();
          }
        }

        p.vx *= Math.pow(p.friction, dt);
        p.vy = (p.vy + p.gravity * dt) * Math.pow(p.friction, dt);
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha -= p.decay * dt;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();

        // Draw particle trail if any
        if (p.trail.length > 1 && p.trail[0]) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let t = 1; t < p.trail.length; t++) {
            const point = p.trail[t];
            if (point) {
              ctx.lineTo(point.x, point.y);
            }
          }
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.45;
          ctx.lineWidth = p.radius * 0.9;
          ctx.stroke();
        }

        // Draw head
        const currentAlpha = p.flicker && Math.random() > 0.4 ? p.alpha * 0.35 : p.alpha;
        ctx.globalAlpha = Math.max(0, currentAlpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Keep running if there are active rockets or particles
      if (rocketsRef.current.length > 0 || particlesRef.current.length > 0) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
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
