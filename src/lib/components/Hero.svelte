<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { app } from '$lib/app.svelte';
  import { getContent, person } from '$lib/data';
  import { magnetic } from '$lib/utils/actions';

  const c = $derived(getContent(app.locale));
  const words = person.name.split(' ');
  let canvas: HTMLCanvasElement;

  onMount(() => {
    if (app.reduced) return;
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
      const n = Math.round(Math.min(90, (w * h) / 16000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: 1 + Math.random() * 1.6 }));
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
    addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      vis.disconnect();
      removeEventListener('resize', resize);
      removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
    };
  });
</script>

<section id="hero" data-section class="hero">
  <div class="blobs" aria-hidden="true"><span></span><span></span><span></span></div>
  <canvas bind:this={canvas} aria-hidden="true"></canvas>

  <div class="container inner">
    <p class="hello step" style="--i:0">{c.ui.hero.hello}</p>
    <h1>
      {#each words as word, i (i)}
        <span class="word step" style="--i:{i + 1}">{word}</span>{' '}
      {/each}
    </h1>
    <p class="role step" style="--i:3">{c.profile.title}</p>
    <p class="tagline step" style="--i:4">{c.profile.tagline}</p>
    <div class="cta step" style="--i:5">
      <a class="btn btn-primary" href="#projects" use:magnetic>{c.ui.hero.work}</a>
      <a class="btn" href="#contact" use:magnetic>{c.ui.hero.contact}</a>
      <a class="btn" href="{base}/{person.cvFiles[app.locale]}" download use:magnetic>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" /></svg>
        {c.ui.hero.cv}
      </a>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 100svh;
    display: grid;
    align-items: center;
    padding-top: var(--nav-h);
    overflow: hidden;
    isolation: isolate;
  }
  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  .blobs span {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    opacity: 0.5;
    z-index: -2;
    animation: drift 22s ease-in-out infinite alternate;
  }
  .blobs span:nth-child(1) {
    width: 46vmax;
    height: 46vmax;
    left: -12vmax;
    top: -10vmax;
    background: color-mix(in srgb, var(--accent) 45%, transparent);
  }
  .blobs span:nth-child(2) {
    width: 40vmax;
    height: 40vmax;
    right: -10vmax;
    top: 10vmax;
    background: color-mix(in srgb, var(--accent-2) 45%, transparent);
    animation-duration: 28s;
    animation-delay: -6s;
  }
  .blobs span:nth-child(3) {
    width: 30vmax;
    height: 30vmax;
    left: 30%;
    bottom: -14vmax;
    background: color-mix(in srgb, var(--accent-2) 30%, var(--accent) 20%);
    animation-duration: 34s;
    animation-delay: -12s;
  }
  @keyframes drift {
    to {
      transform: translate3d(6vmax, 5vmax, 0) scale(1.15);
    }
  }
  .inner {
    display: grid;
    gap: 1.1rem;
    padding-block: 4rem;
  }
  h1 {
    font-size: clamp(3.2rem, 11vw, 7.5rem);
    letter-spacing: -0.045em;
    line-height: 0.98;
  }
  .word {
    display: inline-block;
  }
  .hello {
    font-size: 1.15rem;
    color: var(--accent-text);
    font-weight: 600;
  }
  .role {
    font-size: clamp(1.15rem, 2.6vw, 1.6rem);
    font-weight: 600;
    color: var(--text);
  }
  .tagline {
    color: var(--muted);
    font-size: clamp(1.05rem, 2vw, 1.25rem);
    max-width: 54ch;
  }
  .cta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-top: 0.8rem;
  }
  .step {
    animation: fade-up 0.9s var(--ease) both;
    animation-delay: calc(var(--i) * 110ms + 150ms);
  }
</style>
