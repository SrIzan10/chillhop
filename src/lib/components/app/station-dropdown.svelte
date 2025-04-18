<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { buttonVariants } from '$lib/components/ui/button/index.js';
  import { state as appState } from '@/state.svelte';
  import Radio from '@lucide/svelte/icons/radio';

  let selectedStationId = $state(appState.currentStation!.toString());
  $effect(() => {
    if (selectedStationId) {
      appState.currentStation = parseInt(selectedStationId);
    }
  });
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class={buttonVariants({ variant: 'default', size: 'icon' })}>
    <Radio />
  </DropdownMenu.Trigger>
  <DropdownMenu.Content
    class="w-56 bg-white/10 backdrop-blur-md transition hover:bg-white/20 text-foreground border border-white/20 shadow-lg"
  >
    <DropdownMenu.Group>
      <DropdownMenu.GroupHeading>Select station</DropdownMenu.GroupHeading>
      <DropdownMenu.Separator />
      <DropdownMenu.RadioGroup bind:value={selectedStationId}>
        {#each appState.stations as station}
          <DropdownMenu.RadioItem value={station.id.toString()}>
            {station.name}
          </DropdownMenu.RadioItem>
        {/each}
      </DropdownMenu.RadioGroup>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
