<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { app } from '$lib/app.svelte';
  import { contact, getContent, person } from '$lib/data';
  import { computeSkillStats, topSkills } from '$lib/utils/derive';
  import { magnetic } from '$lib/utils/actions';
  import Scramble from './ui/Scramble.svelte';
  import Socials from './ui/Socials.svelte';

  const c = $derived(getContent(app.locale));
  const [first, ...rest] = person.name.split(' ');
  const marquee = topSkills(computeSkillStats(), 18).map((s) => s.name);

  let hero: HTMLElement;
  let canvas: HTMLCanvasElement;

  /* ---------- typed code editor ---------- */
  type Tok = [string, string?];
  const q = (s: string): Tok => [`'${s}'`, 'str'];
  const code: Tok[][] = [
    [['// ', 'com'], ['developer.ts', 'com']],
    [['const ', 'kw'], ['joey', 'fn'], [' = {', 'punc']],
    [['  name', 'prop'], [': '], q(person.name), [',']],
    [['  role', 'prop'], [': '], q('Senior Front-end & Full-Stack'), [',']],
    [['  stack', 'prop'], [': ['], q('Angular'), [', '], q('React'), [', '], q('Next.js'), [', '], q('Vue'), ['],']],
    [['  backend', 'prop'], [': ['], q('NestJS'), [', '], q('Python'), [', '], q('FastAPI'), ['],']],
    [['  location', 'prop'], [': '], q('Druten, NL'), [',']],
    [['  status', 'prop'], [': '], q('on-project'), [', '], ['// Belastingdienst, from 1 Oct', 'com']],
    [['}', 'punc'], [';']],
    [],
    [['await ', 'kw'], ['joey', 'fn'], ['.'], ['build', 'fn'], ['('], q('your-next-product'), [');']]
  ];
  const lineLen = code.map((l) => l.reduce((n, t) => n + t[0].length, 0));
  const total = lineLen.reduce((a, b) => a + b, 0);
  const flat = code.flat().map((t) => t[0]).join('');
  let typed = $state(total);

  /** Slices the token lines so exactly `typed` characters are visible. */
  const view = $derived.by(() => {
    let left = typed;
    return code.map((line) =>
      line.map(([txt, cls]) => {
        const take = Math.max(0, Math.min(txt.length, left));
        left -= txt.length;
        return { txt: txt.slice(0, take), cls };
      })
    );
  });
  const cursor = $derived.by(() => {
    let left = typed;
    for (let i = 0; i < lineLen.length; i++) {
      if (left <= lineLen[i]) return { ln: i, col: left };
      left -= lineLen[i];
    }
    return { ln: code.length - 1, col: lineLen[lineLen.length - 1] };
  });
  const done = $derived(typed >= total);

  /* ---------- cursor spotlight (hero only) ---------- */
  let spotOn = $state(false);
  function onMove(e: PointerEvent) {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--x', `${e.clientX - r.left}px`);
    hero.style.setProperty('--y', `${e.clientY - r.top}px`);
    spotOn = true;
  }

  onMount(() => {
    const cleanups: (() => void)[] = [];
    if (!app.reduced) {
      typed = 0;
      let timer: ReturnType<typeof setTimeout>;
      const step = () => {
        typed++;
        if (typed < total) {
          const ch = flat[typed - 1] ?? '';
          timer = setTimeout(step, ch === ',' || ch === '{' ? 90 : 14 + Math.random() * 22);
        }
      };
      timer = setTimeout(step, 900);
      cleanups.push(() => clearTimeout(timer));
    }

    if (app.reduced) return () => cleanups.forEach((f) => f());
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
      cleanups.forEach((f) => f());
    };
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section id="hero" data-section class="hero" class:spot-on={spotOn} bind:this={hero} onpointermove={onMove} onpointerleave={() => (spotOn = false)}>
  <div class="blobs" aria-hidden="true"><span></span><span></span><span></span></div>
  <div class="grid-reveal" aria-hidden="true"></div>
  <canvas bind:this={canvas} aria-hidden="true"></canvas>
  <div class="spot" aria-hidden="true"></div>

  <div class="container inner">
    <p class="prompt mono step" style="--i:0">
      <span class="user">joey@portfolio</span><span class="sep">:</span><span class="dir">~</span><span class="sep">$</span>
      <span class="cmd">Coffee break</span>
    </p>

    <h1 class="step" style="--i:1">
      <span class="first"><Scramble text={first} trigger="mount" delay={250} duration={700} /></span>
      <span class="last" data-text={rest.join(' ')}><Scramble text={rest.join(' ')} trigger="mount" delay={450} duration={900} /></span>
    </h1>

    <p class="role mono step" style="--i:2"><span class="com">/**</span> {c.profile.title} <span class="com">*/</span></p>
    <p class="tagline step" style="--i:3">{c.profile.tagline}</p>

    <div class="editor glass step" style="--i:4">
      <div class="chrome">
        <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
        <div class="tabs mono" aria-hidden="true">
          <span class="tab active"><b class="ts">TS</b>developer.ts</span>
          <span class="tab"><b class="md">MD</b>README.md</span>
        </div>
      </div>
      <pre class="code mono" aria-label="developer.ts"><code>{#each view as line, i (i)}<span class="ln" class:cur={cursor.ln === i}><span class="no">{i + 1}</span><span class="src">{#each line as tok, j (j)}{#if tok.cls}<span class={tok.cls}>{tok.txt}</span>{:else}{tok.txt}{/if}{/each}{#if cursor.ln === i}<span class="caret" class:typing={!done}></span>{/if}</span></span>{/each}</code></pre>
      <div class="status mono" aria-hidden="true">
        <span class="branch">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="8" r="2.5" /><path d="M6 8.5v7M18 10.5c0 4-6 3-10 6" /></svg>
          main
        </span>
        <span class:ok={done}>{done ? '✓ compiled' : '◌ compiling…'}</span>
        <span class="grow"></span>
        <span>Ln {cursor.ln + 1}, Col {cursor.col + 1}</span>
        <span>UTF-8</span>
        <span class="live"><i></i>{app.locale === 'nl' ? 'op project · Belastingdienst vanaf 1 okt' : 'on project · Belastingdienst from 1 Oct'}</span>
      </div>
    </div>

    <div class="cta step" style="--i:5">
      <a class="btn btn-primary" href="#projects" use:magnetic><span aria-hidden="true">&gt;</span> {c.ui.hero.work}</a>
      <a class="btn" href="#contact" use:magnetic>{c.ui.hero.contact}<span class="punc" aria-hidden="true">()</span></a>
      <a class="btn" href="{base}/cv/" use:magnetic>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5" /></svg>
        {c.ui.hero.cv}
      </a>
    </div>

    <div class="hero-socials step" style="--i:6"><Socials /></div>
    <a class="mail hero-socials mono step" style="--i:7" href="mailto:{contact.email.value}">{contact.email.value}</a>
  </div>

  <div class="marquee mono" aria-hidden="true">
    <div class="track">
      {#each [0, 1, 2, 3] as k (k)}
        <span class="set">{#each marquee as m (m)}<span class="m">{m}</span><span class="dot">◆</span>{/each}</span>
      {/each}
    </div>
  </div>
</section>

<style>
  .hero {
    --x: 50%;
    --y: 30%;
    position: relative;
    min-height: 100svh;
    display: grid;
    grid-template-rows: 1fr auto;
    padding-top: calc(var(--nav-h) + clamp(1.25rem, 6vh, 6rem));
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

  /* Cursor highlight, lives only inside the hero with the dots */
  .spot {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background: radial-gradient(420px circle at var(--x) var(--y), var(--glow), transparent 65%);
    opacity: 0;
    transition: opacity 0.5s;
  }
  .grid-reveal {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background:
      linear-gradient(color-mix(in srgb, var(--accent) 35%, transparent) 1px, transparent 1px) 0 0 / 48px 48px,
      linear-gradient(90deg, color-mix(in srgb, var(--accent) 35%, transparent) 1px, transparent 1px) 0 0 / 48px 48px;
    -webkit-mask: radial-gradient(260px circle at var(--x) var(--y), #000, transparent 70%);
    mask: radial-gradient(260px circle at var(--x) var(--y), #000, transparent 70%);
    opacity: 0;
    transition: opacity 0.5s;
  }
  .spot-on .spot,
  .spot-on .grid-reveal {
    opacity: 1;
  }

  /* Decorative layers must stay out of the grid flow, or they eat the 1fr row and push content down. */
  .blobs {
    position: absolute;
    inset: 0;
    z-index: -2;
    overflow: hidden;
    pointer-events: none;
  }
  .blobs span {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.4;
    z-index: -2;
    animation: drift 22s ease-in-out infinite alternate;
  }
  .blobs span:nth-child(1) {
    width: 42vmax;
    height: 42vmax;
    left: -14vmax;
    top: -14vmax;
    background: color-mix(in srgb, var(--accent) 45%, transparent);
  }
  .blobs span:nth-child(2) {
    width: 38vmax;
    height: 38vmax;
    right: -12vmax;
    top: 6vmax;
    background: color-mix(in srgb, var(--accent-2) 45%, transparent);
    animation-duration: 28s;
    animation-delay: -6s;
  }
  .blobs span:nth-child(3) {
    width: 28vmax;
    height: 28vmax;
    left: 30%;
    bottom: -16vmax;
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
    grid-row: 1;
    display: grid;
    justify-items: center;
    /* centered in the free space, weighted towards the top by the larger bottom padding */
    align-content: safe center;
    text-align: center;
    gap: 0.85rem;
    padding-bottom: clamp(2.5rem, 9vh, 8rem);
  }
  .prompt {
    font-size: 0.9rem;
    color: var(--muted);
    padding: 0.3rem 0.8rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--surface);
    backdrop-filter: blur(8px);
  }
  .user {
    color: var(--accent-text);
  }
  .dir {
    color: var(--accent-2-text);
  }
  .sep {
    color: var(--muted);
  }
  .cmd {
    color: var(--text);
    margin-left: 0.35rem;
  }
  .cmd::after {
    content: '';
    display: inline-block;
    width: 0.5em;
    height: 1em;
    margin-left: 0.15em;
    vertical-align: -0.12em;
    background: var(--accent);
    animation: blink 1.05s steps(1) infinite;
  }

  h1 {
    font-family: var(--mono);
    font-size: clamp(2.6rem, min(9vw, 11vh), 6.2rem);
    font-weight: 800;
    letter-spacing: -0.06em;
    line-height: 0.95;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    column-gap: 0.28em;
  }
  .first {
    color: var(--text);
  }
  .last {
    position: relative;
    /* gradient text only paints inside the box; the extra bottom padding keeps the descender of the "g" visible */
    display: inline-block;
    padding-bottom: 0.14em;
    margin-bottom: -0.14em;
    background: linear-gradient(100deg, var(--accent) 0%, var(--accent-2) 45%, var(--accent) 90%);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: shimmer 6s linear infinite;
  }
  /* occasional glitch slices */
  .last::before,
  .last::after {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    color: var(--accent);
    -webkit-text-fill-color: currentColor;
    opacity: 0;
    pointer-events: none;
  }
  .last::before {
    color: var(--accent-2);
    animation: glitch-a 7s steps(1) infinite 2s;
  }
  .last::after {
    animation: glitch-b 7s steps(1) infinite 2s;
  }
  @keyframes shimmer {
    to {
      background-position: -200% 0;
    }
  }
  @keyframes glitch-a {
    0%,
    91%,
    100% {
      opacity: 0;
      transform: none;
    }
    92% {
      opacity: 0.85;
      clip-path: inset(10% 0 55% 0);
      transform: translate(-4px, -1px);
    }
    94% {
      opacity: 0.85;
      clip-path: inset(60% 0 8% 0);
      transform: translate(3px, 2px);
    }
    96% {
      opacity: 0.85;
      clip-path: inset(35% 0 40% 0);
      transform: translate(-2px, 0);
    }
  }
  @keyframes glitch-b {
    0%,
    92%,
    100% {
      opacity: 0;
      transform: none;
    }
    93% {
      opacity: 0.7;
      clip-path: inset(50% 0 20% 0);
      transform: translate(4px, 1px);
    }
    95% {
      opacity: 0.7;
      clip-path: inset(5% 0 70% 0);
      transform: translate(-3px, -2px);
    }
  }

  .role {
    font-size: clamp(0.9rem, 1.8vw, 1.1rem);
    color: var(--text);
    font-weight: 500;
  }
  .role .com {
    font-style: normal;
  }
  .tagline {
    color: var(--muted);
    font-size: clamp(0.98rem, 1.6vw, 1.1rem);
    max-width: 56ch;
  }

  /* ---------- editor ---------- */
  .editor {
    width: min(680px, 100%);
    margin-top: 0.4rem;
    text-align: left;
    overflow: hidden;
    background: color-mix(in srgb, var(--bg) 72%, transparent);
    box-shadow: var(--shadow), 0 0 0 1px color-mix(in srgb, var(--accent) 12%, transparent), 0 30px 80px -30px var(--glow);
  }
  .chrome {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 0 0.8rem;
    height: 38px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .dots {
    display: flex;
    gap: 6px;
  }
  .dots i {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: #ff5f57;
  }
  .dots i:nth-child(2) {
    background: #febc2e;
  }
  .dots i:nth-child(3) {
    background: #28c840;
  }
  .tabs {
    display: flex;
    height: 100%;
    font-size: 0.76rem;
  }
  .tab {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0 0.85rem;
    color: var(--muted);
    border-right: 1px solid var(--border);
  }
  .tab.active {
    color: var(--text);
    background: color-mix(in srgb, var(--bg) 60%, transparent);
    box-shadow: inset 0 -2px 0 var(--accent);
  }
  .tab b {
    font-size: 0.6rem;
    font-weight: 800;
    padding: 0 3px;
    border-radius: 3px;
  }
  .ts {
    color: #fff;
    background: #3178c6;
  }
  .md {
    color: var(--bg);
    background: var(--muted);
  }
  .code {
    font-variant-ligatures: none;
    margin: 0;
    padding: 0.8rem 0;
    font-size: clamp(0.72rem, 1.55vw, 0.85rem);
    line-height: 1.65;
    overflow-x: auto;
  }
  .ln {
    display: flex;
    padding-right: 1rem;
    min-height: 1.65em;
  }
  .ln.cur {
    background: color-mix(in srgb, var(--accent) 7%, transparent);
  }
  .no {
    flex: none;
    width: 3.2em;
    padding-right: 1.1em;
    text-align: right;
    color: color-mix(in srgb, var(--muted) 55%, transparent);
    user-select: none;
  }
  .ln.cur .no {
    color: var(--text);
  }
  .src {
    white-space: pre;
  }
  .code .caret {
    width: 2px;
    height: 1.15em;
    margin-left: 1px;
  }
  .code .caret.typing {
    animation: none;
  }
  .status {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.3rem 0.8rem;
    font-size: 0.68rem;
    color: var(--muted);
    border-top: 1px solid var(--border);
    background: var(--surface);
    white-space: nowrap;
    overflow: hidden;
  }
  .branch {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    color: var(--accent-text);
  }
  .ok {
    color: var(--syn-str);
  }
  .grow {
    flex: 1;
  }
  .live {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: var(--syn-num);
  }
  .live i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 0 0 currentColor;
    animation: ping 1.8s ease-out infinite;
  }
  @keyframes ping {
    0% {
      box-shadow: 0 0 0 0 color-mix(in srgb, currentColor 60%, transparent);
    }
    100% {
      box-shadow: 0 0 0 7px transparent;
    }
  }

  .cta {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.6rem;
    margin-top: 0.5rem;
  }
  .mail {
    font-size: 0.8rem;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.2s;
  }
  .mail:hover {
    color: var(--accent-text);
  }

  /* ---------- tech marquee ---------- */
  .marquee {
    grid-row: 2;
    border-block: 1px solid var(--border);
    background: color-mix(in srgb, var(--bg) 55%, transparent);
    backdrop-filter: blur(6px);
    overflow: hidden;
    font-size: 0.8rem;
    color: var(--muted);
    -webkit-mask: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
    mask: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
  }
  /* 4 identical sets; sliding by exactly one set (25%) loops seamlessly on screens up to ~5000px wide */
  .track {
    display: flex;
    width: max-content;
    animation: scroll-x 45s linear infinite;
  }
  .marquee:hover .track {
    animation-play-state: paused;
  }
  .set {
    display: flex;
    align-items: center;
  }
  .m {
    padding: 0.7rem 1.1rem;
    transition: color 0.2s;
  }
  .m:hover {
    color: var(--accent-text);
  }
  .dot {
    font-size: 0.45rem;
    color: var(--accent-2-text);
  }
  @keyframes scroll-x {
    to {
      transform: translateX(-25%);
    }
  }

  .step {
    animation: fade-up 0.9s var(--ease) both;
    animation-delay: calc(var(--i) * 110ms + 100ms);
  }

  @media (min-width: 1280px) {
    .hero-socials {
      display: none;
    }
  }
  /* Large monitors: scale the whole hero up so it fills the screen instead of floating small. */
  @media (min-width: 1700px) and (min-height: 1000px) {
    .inner {
      gap: 1.1rem;
    }
    h1 {
      font-size: clamp(6.2rem, min(7vw, 11vh), 9rem);
    }
    .prompt {
      font-size: 1rem;
    }
    .role {
      font-size: 1.3rem;
    }
    .tagline {
      font-size: 1.3rem;
    }
    .editor {
      width: min(860px, 100%);
    }
    .code {
      font-size: 1.02rem;
    }
    .tabs,
    .status {
      font-size: 0.8rem;
    }
    .chrome {
      height: 44px;
    }
    .cta :global(.btn) {
      font-size: 1rem;
      --pad: 0.8rem 1.4rem;
    }
  }
  @media (max-width: 560px) {
    .status span:nth-child(4),
    .status span:nth-child(5) {
      display: none;
    }
    .tab:not(.active) {
      display: none;
    }
  }
</style>
