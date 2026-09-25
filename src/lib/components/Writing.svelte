<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { getContent, visiblePosts } from '$lib/data';
  import { reveal } from '$lib/utils/actions';
  import SectionHead from './ui/SectionHead.svelte';
  import PostList from './ui/PostList.svelte';

  const c = $derived(getContent(app.locale));
  const LIMIT = 3;
</script>

<section class="section">
  <div class="container">
    <SectionHead section="writing" slug="writing" title={c.ui.writing.title} intro={c.ui.writing.intro} />
    <div use:reveal><PostList limit={LIMIT} /></div>
    {#if visiblePosts.length > LIMIT}
      <a class="all mono" href={app.href('/writing/')}>{c.ui.writing.all}</a>
    {/if}
  </div>
</section>

<style>
  .all {
    display: inline-block;
    margin-top: 1.2rem;
    font-size: 0.88rem;
    font-weight: 600;
  }
</style>
