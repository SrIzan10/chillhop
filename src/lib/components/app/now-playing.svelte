<script lang="ts">
  import { Button } from "@/components/ui/button";
  import { state } from "@/state.svelte";
  import Pause from "@lucide/svelte/icons/pause";
  import Play from "@lucide/svelte/icons/play";

  function togglePlay() {
    state.isPlaying = !state.isPlaying;
  }
</script>

<Button size="icon" onclick={togglePlay} class="w-10 h-10 *:text-white">
  {#if state.isPlaying}
    <Pause />
  {:else}
    <Play />
  {/if}
</Button>