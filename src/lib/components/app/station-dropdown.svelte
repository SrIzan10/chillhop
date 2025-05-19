<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { buttonVariants } from '$lib/components/ui/button/index.js';
  import { state as appState } from '@/state.svelte';
  import Radio from '@lucide/svelte/icons/radio';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';

  let selectedStationId = $state(appState.currentStation!.toString());
  $effect(() => {
    if (selectedStationId) {
      appState.currentStation = parseInt(selectedStationId);
      window.localStorage.setItem('stationId', selectedStationId);
      console.log('Station changed to:', selectedStationId);
    }
  });
</script>

<DropdownMenu.Root>
  <Tooltip.Root>
    <Tooltip.Trigger>
      <DropdownMenu.Trigger class={buttonVariants({ variant: 'default', size: 'icon' })}>
        <Radio />
      </DropdownMenu.Trigger>
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p>Stations</p>
    </Tooltip.Content>
  </Tooltip.Root>
  <DropdownMenu.Content class="w-56">
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
