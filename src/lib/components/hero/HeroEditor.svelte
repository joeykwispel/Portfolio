<script lang="ts">
  import { onMount } from 'svelte';
  import { app } from '$lib/app.svelte';
  import { getContent, now, person } from '$lib/data';

  /** The typed-out developer.ts editor in the hero, with a status bar showing the current assignment. */
  const c = $derived(getContent(app.locale));
  // Evaluated at build time; the weekly rebuild flips "from <date>" to the plain client name.
  const upcoming = new Date(now.start) > new Date();
  const startLabel = $derived(new Date(now.start).toLocaleDateString(app.locale === 'nl' ? 'nl-NL' : 'en-GB', { day: 'numeric', month: 'short' }));
  const status = $derived(`${c.ui.hero.now} · ${now.client}${upcoming ? ` ${c.ui.hero.from} ${startLabel}` : ''}`);

  type Tok = [string, string?];
  const q = (s: string): Tok => [`'${s}'`, 'str'];
  const code: Tok[][] = [
    [
      ['// ', 'com'],
      ['developer.ts', 'com']
    ],
    [
      ['const ', 'kw'],
      ['joey', 'fn'],
      [' = {', 'punc']
    ],
    [['  name', 'prop'], [': '], q(person.name), [',']],
    [['  role', 'prop'], [': '], q('Senior Front-end & Full-Stack'), [',']],
    [['  stack', 'prop'], [': ['], q('Angular'), [', '], q('React'), [', '], q('Next.js'), [', '], q('Vue'), ['],']],
    [['  backend', 'prop'], [': ['], q('NestJS'), [', '], q('Python'), [', '], q('FastAPI'), ['],']],
    [['  location', 'prop'], [': '], q('Druten, NL'), [',']],
    [
      ['  status', 'prop'],
      [': '],
      q('on-project'),
      [', '],
      [`// ${now.client}${upcoming ? `, from ${new Date(now.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : ''}`, 'com']
    ],
    [['}', 'punc'], [';']],
    [],
    [['await ', 'kw'], ['joey', 'fn'], ['.'], ['build', 'fn'], ['('], q('your-next-product'), [');']]
  ];
  const lineLen = code.map((l) => l.reduce((n, t) => n + t[0].length, 0));
  const total = lineLen.reduce((a, b) => a + b, 0);
  const flat = code
    .flat()
    .map((t) => t[0])
    .join('');
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

  onMount(() => {
    if (app.reduced) return;
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
    return () => clearTimeout(timer);
  });
</script>

<div class="editor glass">
  <div class="chrome">
    <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
    <div class="tabs mono" aria-hidden="true">
      <span class="tab active"><b class="ts">TS</b>developer.ts</span>
      <span class="tab"><b class="md">MD</b>README.md</span>
    </div>
  </div>
  <pre class="code mono" aria-label="developer.ts"><code
      >{#each view as line, i (i)}<span class="ln" class:cur={cursor.ln === i}
          ><span class="no">{i + 1}</span><span class="src"
            >{#each line as tok, j (j)}{#if tok.cls}<span class={tok.cls}>{tok.txt}</span>{:else}{tok.txt}{/if}{/each}{#if cursor.ln === i}<span
                class="caret"
                class:typing={!done}></span>{/if}</span
          ></span
        >{/each}</code
    ></pre>
  <div class="status mono" aria-hidden="true">
    <span class="branch">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
        ><circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="8" r="2.5" /><path d="M6 8.5v7M18 10.5c0 4-6 3-10 6" /></svg
      >
      main
    </span>
    <span class:ok={done}>{done ? '✓ compiled' : '◌ compiling…'}</span>
    <span class="grow"></span>
    <span>Ln {cursor.ln + 1}, Col {cursor.col + 1}</span>
    <span>UTF-8</span>
    <span class="live"><i></i>{status}</span>
  </div>
</div>

<style>
  .editor {
    width: 100%;
    text-align: left;
    overflow: hidden;
    background: color-mix(in srgb, var(--bg) 72%, transparent);
    box-shadow:
      var(--shadow),
      0 0 0 1px color-mix(in srgb, var(--accent) 12%, transparent),
      0 30px 80px -30px var(--glow);
  }
  .chrome {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 0 0.8rem;
    height: 34px;
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
    padding: 0.5rem 0;
    font-size: clamp(0.7rem, 1.4vw, 0.8rem);
    line-height: 1.5;
    overflow-x: auto;
  }
  .ln {
    display: flex;
    padding-right: 1rem;
    min-height: 1.5em;
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

  /* Short screens: a denser editor keeps the hero within one screen. */
  @media (min-width: 700px) and (max-height: 820px) {
    .code {
      padding: 0.35rem 0;
      font-size: 0.7rem;
      line-height: 1.4;
    }
    .ln {
      min-height: 1.4em;
    }
  }
  @media (min-width: 700px) and (max-height: 740px) {
    .code {
      padding: 0.25rem 0;
      font-size: 0.66rem;
      line-height: 1.35;
    }
    .ln {
      min-height: 1.35em;
    }
  }
  @media (min-width: 1700px) and (min-height: 1000px) {
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
