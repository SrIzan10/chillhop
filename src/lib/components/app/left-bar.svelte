<script lang="ts">
  import { state as appState } from '@/state.svelte';
  import Check from '@lucide/svelte/icons/check';
  import Button from '../ui/button/button.svelte';
  import Binoculars from '@lucide/svelte/icons/binoculars';
</script>

<div
  class="absolute left-2 top-1/2 transform -translate-y-1/2 p-4 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg flex flex-col space-y-2"
>
  <Button size="icon" onclick={() => (appState.showTodoList = !appState.showTodoList)}>
    <Check class="size-4" />
  </Button>
  <Button
    size="icon"
    onclick={() => (appState.show202020 = !appState.show202020)}
  >
    <Binoculars class="size-4" />
  </Button>
</div>
