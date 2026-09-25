<script lang="ts">
  import { computeSkillStats, topSkills } from '$lib/utils/derive';

  const items = topSkills(computeSkillStats(), 18).map((s) => s.name);
</script>

<div class="marquee mono" aria-hidden="true">
  <div class="track">
    {#each [0, 1, 2, 3] as k (k)}
      <span class="set"
        >{#each items as m (m)}<span class="m">{m}</span><span class="dot">◆</span>{/each}</span
      >
    {/each}
  </div>
</div>

<style>
  .marquee {
    grid-row: 2;
    border-block: 1px solid var(--border);
    background: color-mix(in srgb, var(--bg) 55%, transparent);
    backdrop-filter: blur(6px);
    overflow: hidden;
    font-size: 0.8rem;
    color: var(--muted);
    -webkit-mask: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
    mask: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
  }
  /* 4 identical sets; sliding by exactly one set (25%) loops seamlessly on screens up to ~5000px wide */
  .track {
    display: flex;
    width: max-content;
    animation: scroll-x 45s linear infinite;
  }
  .marquee:hover .track {
    animation-play-state: paused;
  }
  .set {
    display: flex;
    align-items: center;
  }
  .m {
    padding: 0.7rem 1.1rem;
    transition: color 0.2s;
  }
  .m:hover {
    color: var(--accent-text);
  }
  .dot {
    font-size: 0.45rem;
    color: var(--accent-2-text);
  }
  @keyframes scroll-x {
    to {
      transform: translateX(-25%);
    }
  }
</style>
