<script lang="ts">
  import { reveal } from '$lib/utils/actions';
  let { title, intro = '' }: { title: string; intro?: string } = $props();
</script>

<header class="section-head" use:reveal>
  <h2>{title}</h2>
  {#if intro}<p>{intro}</p>{/if}
</header>
