<script lang="ts">
  import { onMount } from 'svelte';
  import { app } from '$lib/app.svelte';

  /** Drifting dots that connect to each other and to the cursor. Skipped when reduced motion is on. */
  let canvas: HTMLCanvasElement;

  onMount(() => {
    if (app.reduced) return;
    const hero = canvas.parentElement!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999 };
    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let pts: P[] = [];
    let color = '125,211,192';

    const readColor = () => {
      const hex = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      const m = /^#([0-9a-f]{6})$/i.exec(hex);
      if (m) color = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)).join(',');
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(95, (w * h) / 15000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 1 + Math.random() * 1.6
      }));
    };

    let frame = 0;
    const tick = () => {
      if (!running) return;
      if (frame++ % 90 === 0) readColor();
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22500) {
          const d = Math.sqrt(d2) || 1;
          const f = (150 - d) / 150;
          p.vx += (dx / d) * f * 0.5;
          p.vy += (dy / d) * f * 0.5;
        }
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx + (Math.random() - 0.5) * 0.02;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color},0.7)`;
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fill();
      }
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const d2 = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
          if (d2 < 9000) {
            ctx.strokeStyle = `rgba(${color},${0.16 * (1 - d2 / 9000)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      // lines from the cursor to nearby dots
      for (const p of pts) {
        const d2 = (p.x - mouse.x) ** 2 + (p.y - mouse.y) ** 2;
        if (d2 < 40000) {
          ctx.strokeStyle = `rgba(${color},${0.35 * (1 - d2 / 40000)})`;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const leave = () => (mouse.x = mouse.y = -9999);
    const vis = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      if (running) tick();
      else cancelAnimationFrame(raf);
    });

    resize();
    readColor();
    tick();
    vis.observe(canvas);
    addEventListener('resize', resize);
    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', leave);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      vis.disconnect();
      removeEventListener('resize', resize);
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', leave);
    };
  });
</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>

<style>
  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
</style>
