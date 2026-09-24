<script lang="ts">
  import { onMount } from 'svelte';
  import { app } from '$lib/app.svelte';

  /** Types each line, holds it, deletes it, then moves on to the next (shuffled) line. */
  let { lines, hold = 2600 }: { lines: string[]; hold?: number } = $props();

  let order = $state<number[]>([]);
  let idx = $state(0);
  let shown = $state('');

  const current = $derived(lines[order[idx] ?? 0] ?? '');

  onMount(() => {
    order = lines.map((_, i) => i).sort(() => Math.random() - 0.5);
    if (app.reduced) {
      shown = current;
      const id = setInterval(() => {
        idx = (idx + 1) % order.length;
        shown = current;
      }, hold + 2000);
      return () => clearInterval(id);
    }
    let timer: ReturnType<typeof setTimeout>;
    let deleting = false;
    const step = () => {
      const full = current;
      if (!deleting) {
        shown = full.slice(0, shown.length + 1);
        if (shown === full) {
          deleting = true;
          timer = setTimeout(step, hold);
          return;
        }
        timer = setTimeout(step, 35 + Math.random() * 45);
      } else {
        shown = full.slice(0, shown.length - 1);
        if (!shown) {
          deleting = false;
          idx = (idx + 1) % order.length;
          timer = setTimeout(step, 350);
          return;
        }
        timer = setTimeout(step, 18);
      }
    };
    timer = setTimeout(step, 600);
    return () => clearTimeout(timer);
  });
</script>

<!-- The invisible copy of the full line reserves its space, so long lines wrap instead of getting cut off
     and the box doesn't grow line by line while typing. The visible text (and caret) types over it. -->
<span class="typer mono" aria-live="off"
  ><span class="gt" aria-hidden="true">&gt;</span><span class="box"
    ><span class="ghost" aria-hidden="true">{current}<span class="caret"></span></span><span class="txt"
      >{shown}<span class="caret" aria-hidden="true"></span></span
    ></span
  ></span
>

<style>
  .typer {
    display: inline-flex;
    align-items: baseline;
    min-width: 0;
    max-width: 100%;
  }
  .gt {
    color: var(--accent-text);
    margin-right: 0.45rem;
    flex: none;
  }
  .box {
    display: grid;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .ghost,
  .txt {
    grid-area: 1 / 1;
  }
  .ghost {
    visibility: hidden;
  }
  .caret {
    width: 0.5em;
    height: 1em;
  }
</style>
