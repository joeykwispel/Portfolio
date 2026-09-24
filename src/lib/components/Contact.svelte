<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { contact, getContent, person } from '$lib/data';
  import { magnetic, reveal } from '$lib/utils/actions';
  import SectionHead from './ui/SectionHead.svelte';

  const c = $derived(getContent(app.locale));
  let name = $state('');
  let email = $state('');
  let message = $state('');
  let status = $state<'idle' | 'sent' | 'error' | 'mail'>('idle');

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    if (contact.formEndpoint) {
      try {
        const res = await fetch(contact.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name, email, message })
        });
        status = res.ok ? 'sent' : 'error';
        if (res.ok) name = email = message = '';
      } catch {
        status = 'error';
      }
      return;
    }
    const body = `${message}\n\n${name} (${email})`;
    location.href = `mailto:${contact.email.value}?subject=${encodeURIComponent(`${c.ui.contact.subject} ${name}`)}&body=${encodeURIComponent(body)}`;
    status = 'mail';
  }
</script>

<section class="section">
  <div class="container">
    <SectionHead title={c.ui.contact.title} intro={c.ui.contact.intro} />
    <div class="grid">
      <form class="glass" onsubmit={submit} use:reveal>
        <label>
          <span>{c.ui.contact.name}</span>
          <input type="text" bind:value={name} required autocomplete="name" />
        </label>
        <label>
          <span>{c.ui.contact.email}</span>
          <input type="email" bind:value={email} required autocomplete="email" />
        </label>
        <label>
          <span>{c.ui.contact.message}</span>
          <textarea rows="5" bind:value={message} required></textarea>
        </label>
        <button class="btn btn-primary" type="submit" use:magnetic>{c.ui.contact.send}</button>
        <p class="status" role="status">
          {#if status === 'sent'}{c.ui.contact.sent}{:else if status === 'error'}{c.ui.contact.error}{:else if status === 'mail' || !contact.formEndpoint}{c.ui.contact.mailHint}{/if}
        </p>
      </form>

      <div class="links glass" use:reveal={{ delay: 120 }}>
        <h3>{c.ui.contact.links}</h3>
        <ul>
          <li>
            <a class="ic" href="mailto:{contact.email.value}">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2" pathLength="1" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" pathLength="1" /></svg>
              <span>{contact.email.value}</span>
              {#if contact.email.placeholder}<em class="badge-placeholder">{c.ui.contact.placeholder}</em>{/if}
            </a>
          </li>
          <li>
            <a class="ic" href={contact.linkedin.value} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" pathLength="1" /><rect x="2" y="9" width="4" height="12" pathLength="1" /><circle cx="4" cy="4" r="2" pathLength="1" /></svg>
              <span>LinkedIn</span>
            </a>
          </li>
          <li>
            <a class="ic" href={contact.github.value} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" pathLength="1" /><path d="M9 18c-4.51 2-5-2-7-2" pathLength="1" /></svg>
              <span>GitHub</span>
              {#if contact.github.placeholder}<em class="badge-placeholder">{c.ui.contact.placeholder}</em>{/if}
            </a>
          </li>
          <li class="loc">{person.location}</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<style>
  .grid {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 1.25rem;
  }
  form,
  .links {
    padding: clamp(1.2rem, 3vw, 2rem);
    display: grid;
    gap: 1rem;
    align-content: start;
  }
  label {
    display: grid;
    gap: 0.35rem;
    font-size: 0.92rem;
    color: var(--muted);
  }
  input,
  textarea {
    font: inherit;
    color: var(--text);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.75rem 0.9rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    resize: vertical;
  }
  input:focus,
  textarea:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 4px var(--glow);
  }
  form .btn {
    justify-self: start;
  }
  .status {
    color: var(--muted);
    font-size: 0.88rem;
    min-height: 1.4em;
  }
  .links ul {
    display: grid;
    gap: 0.6rem;
  }
  .ic {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    flex-wrap: wrap;
    padding: 0.7rem 0.9rem;
    border-radius: var(--radius-sm);
    text-decoration: none;
    color: var(--text);
    border: 1px solid transparent;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
    overflow-wrap: anywhere;
  }
  .ic:hover {
    background: var(--surface-2);
    border-color: var(--border);
    transform: translateX(4px);
  }
  .ic svg {
    color: var(--accent-text);
    flex: none;
  }
  .ic:hover svg :global(path),
  .ic:hover svg :global(rect),
  .ic:hover svg :global(circle) {
    stroke-dasharray: 1;
    animation: draw 0.9s var(--ease);
  }
  @keyframes draw {
    from {
      stroke-dashoffset: 1;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
  .loc {
    color: var(--muted);
    padding: 0 0.9rem;
  }
  @media (max-width: 860px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
