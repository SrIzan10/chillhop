<script lang="ts">
  import { Button } from '@/components/ui/button';
  import { state } from '@/state.svelte';
  import Pause from '@lucide/svelte/icons/pause';
  import Play from '@lucide/svelte/icons/play';
  import Volume from './volume.svelte';

  function togglePlay() {
    state.togglePlay();
  }
</script>

<div class="flex items-center w-full sm:w-auto">
  <img src={state.currentSong?.image} alt="Cover Art" class="size-16 rounded-lg shadow-lg" />
  <div class="flex flex-col ml-4">
    <h2 class="text-lg font-semibold">{state.currentSong?.title}</h2>
    <p class="text-sm">{state.currentSong?.artists}</p>
  </div>
  <div class="flex-1"></div>
  <div class="gap-4 flex">
    <Button size="icon" onclick={togglePlay} class="size-10 md:ml-4">
      {#if state.isPlaying}
        <Pause />
      {:else}
        <Play />
      {/if}
    </Button>
    <div class="hidden sm:block">
      <Volume />
    </div>
  </div>
</div>