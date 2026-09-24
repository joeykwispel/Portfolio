<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { app } from '$lib/app.svelte';
  import CursorGlow from '$lib/components/ui/CursorGlow.svelte';
  import Easter from '$lib/components/ui/Easter.svelte';

  let { children } = $props();

  onMount(() => app.init());

  $effect(() => {
    document.documentElement.dataset.theme = app.theme;
    document.documentElement.lang = app.locale;
  });
</script>

{@render children()}
<CursorGlow />
<Easter />
