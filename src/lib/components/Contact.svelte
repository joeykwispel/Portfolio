<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { contact, getContent, testimonials } from '$lib/data';
  import { reveal, tilt } from '$lib/utils/actions';
  import SectionHead from './ui/SectionHead.svelte';
  import Scramble from './ui/Scramble.svelte';

  const c = $derived(getContent(app.locale));
  let copied = $state(false);

  const cards = $derived([
    {
      id: 'github',
      name: 'GitHub',
      handle: '@joeykwispel',
      cmd: 'git remote -v',
      desc: c.ui.contact.github,
      action: c.ui.contact.githubAction,
      href: contact.github.value,
      hue: 'var(--text)',
      path: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.51 2-5-2-7-2'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      handle: 'in/joey-oosenbrug',
      cmd: 'ssh joey@linkedin',
      desc: c.ui.contact.linkedin,
      action: c.ui.contact.linkedinAction,
      href: contact.linkedin.value,
      hue: '#3b8fe6',
      path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z'
    },
    {
      id: 'email',
      name: 'Email',
      handle: contact.email.value,
      cmd: 'mail -s "hi" joey',
      desc: c.ui.contact.email,
      action: c.ui.contact.emailAction,
      href: `mailto:${contact.email.value}`,
      hue: 'var(--accent)',
      path: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'
    }
  ]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email.value);
      copied = true;
      setTimeout(() => (copied = false), 1800);
    } catch {
      location.href = `mailto:${contact.email.value}`;
    }
  }
</script>

<section class="section">
  <div class="container">
    <SectionHead num={testimonials.length ? '07' : '06'} slug="contact" title={c.ui.contact.title} intro={c.ui.contact.intro} />

    <p class="cta mono" use:reveal><span class="kw">await</span> <span class="grad"><Scramble text={c.ui.contact.cta} /></span><span class="caret" aria-hidden="true"></span></p>

    <ul class="cards">
      {#each cards as card, i (card.id)}
        <li use:reveal={{ delay: i * 110 }}>
          <article class="card glass ring" style="--hue:{card.hue}" use:tilt={6}>
            <p class="cmd mono" aria-hidden="true"><span class="ps">$</span> {card.cmd}</p>
            <div class="icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d={card.path} /></svg>
            </div>
            <h3>
              <a class="main" href={card.href} target={card.id === 'email' ? undefined : '_blank'} rel={card.id === 'email' ? undefined : 'noopener noreferrer'}>{card.name}</a>
            </h3>
            <p class="handle mono">{card.handle}</p>
            <p class="desc">{card.desc}</p>
            <div class="foot">
              <span class="action mono">{card.action} <span class="arrow" aria-hidden="true">{card.id === 'email' ? '→' : '↗'}</span></span>
              {#if card.id === 'email'}
                <button type="button" class="copy mono" class:done={copied} onclick={copyEmail} aria-label="{c.ui.contact.copy} {contact.email.value}">
                  {#if copied}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                    {c.ui.contact.copied}
                  {:else}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" /></svg>
                    {c.ui.contact.copy}
                  {/if}
                </button>
              {/if}
            </div>
          </article>
        </li>
      {/each}
    </ul>

    <p class="loc mono" use:reveal><span class="live" aria-hidden="true"><i></i></span><span class="com">// </span>{c.ui.contact.location}</p>
  </div>
</section>

<style>
  .cta {
    font-size: clamp(1.3rem, 3.4vw, 2.1rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1.2;
    margin-bottom: 1.4rem;
    max-width: none;
  }
  .grad {
    background: linear-gradient(100deg, var(--accent), var(--accent-2), var(--accent));
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: shimmer 6s linear infinite;
  }
  @keyframes shimmer {
    to {
      background-position: -200% 0;
    }
  }
  .cta .caret {
    width: 0.5em;
    height: 0.95em;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }
  .cards > li {
    display: grid;
  }
  .card {
    --mx: 50%;
    --my: 0%;
    position: relative;
    display: grid;
    align-content: start;
    gap: 0.55rem;
    padding: 1.2rem 1.25rem 1.1rem;
    overflow: hidden;
    transition: transform 0.25s ease-out, border-color 0.3s;
    will-change: transform;
  }
  /* cursor spotlight, tinted per channel */
  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(300px circle at var(--mx) var(--my), color-mix(in srgb, var(--hue) 18%, transparent), transparent 70%);
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }
  .card:hover::before {
    opacity: 1;
  }
  .cmd {
    font-size: 0.72rem;
    color: var(--muted);
    padding-bottom: 0.6rem;
    margin-bottom: 0.2rem;
    border-bottom: 1px dashed var(--border);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ps {
    color: var(--accent-text);
  }
  .icon {
    width: 54px;
    height: 54px;
    display: grid;
    place-items: center;
    border-radius: 14px;
    color: var(--hue);
    background: color-mix(in srgb, var(--hue) 12%, transparent);
    border: 1px solid color-mix(in srgb, var(--hue) 30%, var(--border));
    transition: transform 0.45s var(--spring), box-shadow 0.3s;
  }
  .card:hover .icon {
    transform: rotate(-8deg) scale(1.08);
    box-shadow: 0 0 28px color-mix(in srgb, var(--hue) 35%, transparent);
  }
  h3 {
    font-family: var(--mono);
    font-size: 1.25rem;
    letter-spacing: -0.03em;
    margin-top: 0.2rem;
  }
  /* the name link covers the whole card, so the card is one big click target */
  .main {
    color: var(--text);
    text-decoration: none;
  }
  .main::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    border-radius: inherit;
  }
  .main:focus-visible {
    outline: none;
  }
  .card:has(.main:focus-visible) {
    outline: 2px solid var(--accent-text);
    outline-offset: 3px;
  }
  .handle {
    font-size: 0.8rem;
    color: var(--hue);
    overflow-wrap: anywhere;
  }
  .desc {
    color: var(--muted);
    font-size: 0.88rem;
  }
  .foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 0.5rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border);
  }
  .action {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--accent-text);
  }
  .arrow {
    display: inline-block;
    transition: transform 0.3s var(--spring);
  }
  .card:hover .arrow {
    transform: translate(3px, -2px);
  }
  .copy {
    position: relative;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.72rem;
    padding: 0.3rem 0.65rem;
    border-radius: 7px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--muted);
    transition: color 0.2s, border-color 0.2s, background 0.2s, transform 0.15s;
  }
  .copy:hover {
    color: var(--accent-text);
    border-color: var(--accent);
  }
  .copy:active {
    transform: scale(0.94);
  }
  .copy.done {
    color: var(--accent-ink);
    background: var(--accent);
    border-color: var(--accent);
  }

  .loc {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin: 1.4rem auto 0;
    font-size: 0.8rem;
    color: var(--muted);
  }
  .live i {
    display: block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--syn-str);
    animation: pulse 1.8s ease-out infinite;
  }
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 color-mix(in srgb, var(--syn-str) 60%, transparent);
    }
    100% {
      box-shadow: 0 0 0 7px transparent;
    }
  }

  @media (max-width: 860px) {
    .cards {
      grid-template-columns: 1fr;
    }
  }
</style>
