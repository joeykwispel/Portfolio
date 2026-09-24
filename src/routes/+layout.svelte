<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { app } from '$lib/app.svelte';
  import { contact, getContent } from '$lib/data';
  import CommandPalette from '$lib/components/ui/CommandPalette.svelte';
  import SideRails from '$lib/components/ui/SideRails.svelte';
  import Easter from '$lib/components/ui/Easter.svelte';

  let { children } = $props();

  onMount(() => {
    app.init();
    const ui = getContent(app.locale).ui;
    console.log(
      '%c<JO/>%c\n' + ui.quips.console + ' ' + contact.email.value,
      'font: 800 28px monospace; color: #7dd3c0; text-shadow: 2px 2px 0 #b49cff;',
      'font: 13px monospace; color: inherit;'
    );

    // Swap the tab title while the visitor is away.
    let saved = '';
    const onVis = () => {
      if (document.hidden) {
        saved = document.title;
        document.title = getContent(app.locale).ui.footer.away;
      } else if (saved) {
        document.title = saved;
        saved = '';
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  });

  $effect(() => {
    document.documentElement.dataset.theme = app.theme;
    document.documentElement.lang = app.locale;
  });
</script>

{@render children()}
<SideRails />
<CommandPalette />
<Easter />
