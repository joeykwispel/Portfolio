<script lang="ts">
  import { app } from '$lib/app.svelte';

  let { data, children } = $props();

  // Set during render as well, so the prerendered HTML is already in the right language.
  const sync = () => {
    app.locale = data.locale;
  };
  sync();
  $effect.pre(sync);
</script>

{@render children()}
