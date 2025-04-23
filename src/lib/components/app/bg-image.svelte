<script lang="ts">
  import { state as appState } from '@/state.svelte';

  let video: HTMLVideoElement | null = null;
  
  $effect(() => {
    if (video) {
      (appState as any).backgroundElement = video;
    }
  });

  $effect(() => {
    const backgroundId = appState.currentBackgroundId;
    if (backgroundId && video) {
      const resolvedBg = appState.backgrounds.find((bg) => bg.id === backgroundId);
      // i may or may not have yoinked this cors proxy for other purposes
      video.src = `https://cors.notesnook.com/${resolvedBg?.landscapeUrl}` || '';
    }
  })
</script>

<video
  bind:this={video}
  src={"https://example.com"}
  autoplay
  loop
  muted
  playsinline
  class="absolute top-0 left-0 w-full h-full object-cover -z-10"
  id="bg-video"
  crossorigin="anonymous"
></video>