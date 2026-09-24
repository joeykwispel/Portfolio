<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { getContent, person } from '$lib/data';
  import Socials from './ui/Socials.svelte';
  import Typer from './ui/Typer.svelte';
  const ui = $derived(getContent(app.locale).ui);
</script>

<footer>
  <div class="container">
    <div class="quip">
      {#key app.locale}<Typer lines={ui.footer.quips} />{/key}
    </div>
    <div class="row">
      <div class="left mono">
        <p><span class="com">// </span>© {new Date().getFullYear()} {person.name}</p>
        <p class="built">{ui.footer.built}</p>
      </div>
      <button type="button" class="hint mono" onclick={() => (app.palette = true)}><kbd>Ctrl</kbd><kbd>K</kbd> {ui.footer.palette}</button>
      <div class="right">
        <Socials />
        <a class="top mono" href="#hero">{ui.footer.top} ↑</a>
      </div>
    </div>
  </div>
</footer>

<style>
  footer {
    border-top: 1px solid var(--border);
    padding-block: 1.25rem 1.5rem;
    color: var(--muted);
    font-size: 0.8rem;
    background: color-mix(in srgb, var(--bg) 70%, transparent);
  }
  .quip {
    display: flex;
    justify-content: center;
    padding: 0.55rem 0.9rem;
    margin-bottom: 1.1rem;
    border: 1px dashed var(--border);
    border-radius: var(--radius-sm);
    font-size: 0.82rem;
    color: var(--text);
    background: var(--surface);
    min-height: 2.4rem;
  }
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .left {
    display: grid;
    gap: 0.15rem;
  }
  .built {
    font-size: 0.72rem;
    opacity: 0.8;
  }
  .hint {
    border: 0;
    background: none;
    color: var(--muted);
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    transition: color 0.2s;
  }
  .hint:hover {
    color: var(--accent-text);
  }
  kbd {
    font-family: var(--mono);
    font-size: 0.68rem;
    padding: 0.05rem 0.35rem;
    border-radius: 5px;
    border: 1px solid var(--border);
    background: var(--surface);
  }
  .right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .top {
    font-size: 0.78rem;
    text-decoration: none;
  }
</style>
