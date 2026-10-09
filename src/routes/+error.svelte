<script lang="ts">
  import { page } from '$app/state';
  import Teapot from '$lib/components/Teapot.svelte';
</script>

<!-- Whatever went wrong (404, 500, ...), the visitor gets a 418. -->
<Teapot status={page.status} />
