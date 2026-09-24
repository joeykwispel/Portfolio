<script lang="ts">
  let { x, y, text, sub = '' }: { x: number; y: number; text: string; sub?: string } = $props();
</script>

<div class="tip" style:left="{x}px" style:top="{y}px" role="status">
  <strong>{text}</strong>
  {#if sub}<span>{sub}</span>{/if}
</div>

<style>
  .tip {
    position: absolute;
    z-index: 5;
    transform: translate(-50%, calc(-100% - 12px));
    pointer-events: none;
    padding: 0.4rem 0.7rem;
    border-radius: 10px;
    background: var(--bg-2);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    font-size: 0.85rem;
    line-height: 1.35;
    white-space: nowrap;
    display: grid;
  }
  span {
    color: var(--muted);
  }
</style>
