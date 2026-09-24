<script lang="ts">
  import { onMount } from 'svelte';
  import { app } from '$lib/app.svelte';

  /** A one-line code joke between sections; types itself out when scrolled into view. */
  let { text }: { text: string } = $props();

  let el: HTMLDivElement;
  let n = $state(-1);
  const shown = $derived(n < 0 ? text : text.slice(0, n));

  /** Tiny highlighter: comments, strings, keywords, tags. */
  const tokens = $derived.by(() => {
    const out: { t: string; c?: string }[] = [];
    const re = /(\/\/.*$)|("[^"]*"?|'[^']*'?)|(<\/?[A-Za-z]+|\/?>)|\b(if|else|while|const|return|throw|new|await|git|npm|sudo)\b/g;
    let last = 0;
    for (const m of shown.matchAll(re)) {
      if (m.index! > last) out.push({ t: shown.slice(last, m.index) });
      out.push({ t: m[0], c: m[1] ? 'com' : m[2] ? 'str' : m[3] ? 'punc' : 'kw' });
      last = m.index! + m[0].length;
    }
    if (last < shown.length) out.push({ t: shown.slice(last) });
    return out;
  });

  onMount(() => {
    if (app.reduced) return;
    n = 0;
    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const step = () => {
          n++;
          if (n < text.length) timer = setTimeout(step, 22 + Math.random() * 30);
        };
        timer = setTimeout(step, 250);
      },
      { threshold: 1 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  });
</script>

<div class="quip container" bind:this={el} aria-hidden="true">
  <span class="line"></span>
  <code class="mono"><span class="gt">&gt;</span> {#each tokens as tok, i (i)}{#if tok.c}<span class={tok.c}>{tok.t}</span>{:else}{tok.t}{/if}{/each}<span class="caret"></span></code>
  <span class="line"></span>
</div>

<style>
  .quip {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-block: 0.25rem;
  }
  .line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border));
  }
  .line:last-child {
    background: linear-gradient(90deg, var(--border), transparent);
  }
  code {
    font-size: 0.76rem;
    color: var(--muted);
    padding: 0.35rem 0.8rem;
    border: 1px dashed var(--border);
    border-radius: 999px;
    background: var(--surface);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100% - 2rem);
  }
  .gt {
    color: var(--accent-text);
  }
  .caret {
    width: 0.45em;
    height: 0.95em;
  }
  code :global(.com) {
    font-style: italic;
  }
  @media (max-width: 560px) {
    .line {
      display: none;
    }
    .quip {
      justify-content: center;
    }
  }
</style>
