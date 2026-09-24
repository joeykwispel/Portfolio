<script lang="ts">
  import { contact } from '$lib/data';
  import { magnetic } from '$lib/utils/actions';

  let { vertical = false }: { vertical?: boolean } = $props();

  const links = [
    { label: 'GitHub', href: contact.github.value, path: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.51 2-5-2-7-2' },
    { label: 'LinkedIn', href: contact.linkedin.value, path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z' },
    { label: 'Email', href: `mailto:${contact.email.value}`, path: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' }
  ];
</script>

<ul class="socials" class:vertical>
  {#each links as l (l.label)}
    <li>
      <a href={l.href} aria-label={l.label} data-tip={l.label} target={l.href.startsWith('http') ? '_blank' : undefined} rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined} use:magnetic={0.35}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d={l.path} /></svg>
      </a>
    </li>
  {/each}
</ul>

<style>
  .socials {
    display: flex;
    gap: 0.5rem;
  }
  .vertical {
    flex-direction: column;
  }
  a {
    position: relative;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    color: var(--muted);
    border: 1px solid var(--border);
    background: var(--surface);
    backdrop-filter: blur(8px);
    transition: color 0.2s, border-color 0.2s, box-shadow 0.25s, translate 0.2s;
  }
  a:hover {
    color: var(--accent-text);
    border-color: color-mix(in srgb, var(--accent) 60%, var(--border));
    box-shadow: 0 0 0 4px var(--glow), 0 0 24px var(--glow);
  }
  a:hover svg {
    animation: wiggle 0.5s var(--spring);
  }
  a::after {
    content: attr(data-tip);
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    translate: -50% 4px;
    padding: 0.15rem 0.5rem;
    border-radius: 6px;
    font-family: var(--mono);
    font-size: 0.7rem;
    white-space: nowrap;
    color: var(--accent-ink);
    background: var(--accent);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s, translate 0.2s var(--ease);
  }
  .vertical a::after {
    bottom: auto;
    top: 50%;
    left: calc(100% + 10px);
    translate: -4px -50%;
  }
  a:hover::after {
    opacity: 1;
    translate: -50% 0;
  }
  .vertical a:hover::after {
    translate: 0 -50%;
  }
  @keyframes wiggle {
    30% {
      transform: rotate(-12deg) scale(1.15);
    }
    60% {
      transform: rotate(8deg) scale(1.1);
    }
  }
</style>
