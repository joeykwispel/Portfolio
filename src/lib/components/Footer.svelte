<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { getContent, person } from '$lib/data';
  const ui = $derived(getContent(app.locale).ui);
</script>

<footer>
  <div class="container row">
    <p>© {new Date().getFullYear()} {person.name}. {ui.footer.built}</p>
    <a href="#hero">{ui.footer.top}</a>
  </div>
</footer>

<style>
  footer {
    border-top: 1px solid var(--border);
    padding-block: 2rem;
    color: var(--muted);
    font-size: 0.92rem;
  }
  .row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }
</style>
