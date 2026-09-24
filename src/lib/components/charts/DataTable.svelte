<script lang="ts">
  /** Screen-reader version of a chart: the same numbers as a plain table. */
  let { caption, rows }: { caption: string; rows: [string, string][] } = $props();
</script>

<table class="sr-only">
  <caption>{caption}</caption>
  <tbody>
    {#each rows as [k, v], i (i)}
      <tr><th scope="row">{k}</th><td>{v}</td></tr>
    {/each}
  </tbody>
</table>
