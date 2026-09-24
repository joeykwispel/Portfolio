<script lang="ts">
  import { contact } from '$lib/data';
  import Socials from './Socials.svelte';
</script>

<div class="rail left" aria-label="Social links" role="complementary">
  <Socials vertical />
  <span class="line" aria-hidden="true"></span>
</div>
<div class="rail right">
  <a class="mail mono" href="mailto:{contact.email.value}">{contact.email.value}</a>
  <span class="line" aria-hidden="true"></span>
</div>

<style>
  .rail {
    position: fixed;
    bottom: 0;
    z-index: 40;
    display: none;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    animation: rise 1s var(--ease) 1.6s both;
  }
  .left {
    left: 1.6rem;
  }
  .right {
    right: 1.6rem;
  }
  .line {
    width: 1px;
    height: 90px;
    background: linear-gradient(var(--muted), transparent);
    opacity: 0.6;
  }
  .mail {
    writing-mode: vertical-rl;
    font-size: 0.74rem;
    letter-spacing: 0.12em;
    color: var(--muted);
    text-decoration: none;
    padding: 0.4rem 0;
    transition: color 0.2s, translate 0.25s var(--ease);
  }
  .mail:hover {
    color: var(--accent-text);
    translate: 0 -4px;
  }
  @keyframes rise {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
  }
  @media (min-width: 1280px) {
    .rail {
      display: flex;
    }
  }
</style>
