<script lang="ts">
  import { state as appState } from '@/state.svelte';
  import Check from '@lucide/svelte/icons/check';
  import Button from '../ui/button/button.svelte';
  import Binoculars from '@lucide/svelte/icons/binoculars';
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
</script>

<div
  class="absolute left-2 top-1/2 transform -translate-y-1/2 p-4 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg flex flex-col space-y-2"
>
  <Tooltip.Root>
    <Tooltip.Trigger>
      <Button size="icon" onclick={() => (appState.showTodoList = !appState.showTodoList)}>
        <Check class="size-4" />
      </Button>
    </Tooltip.Trigger>
    <Tooltip.Content side="right" sideOffset={8} align="start">Todo List</Tooltip.Content>
  </Tooltip.Root>
  <Tooltip.Root>
    <Tooltip.Trigger>
      <Button
        size="icon"
        onclick={() => (appState.show202020 = !appState.show202020)}
      >
        <Binoculars class="size-4" />
      </Button>
    </Tooltip.Trigger>
    <Tooltip.Content side="right" sideOffset={8} align="start">20-20-20</Tooltip.Content>
  </Tooltip.Root>
</div>