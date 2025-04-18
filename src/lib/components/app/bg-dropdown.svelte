<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { buttonVariants } from '$lib/components/ui/button/index.js';
  import { state as appState } from '@/state.svelte';
  import Image from '@lucide/svelte/icons/image';

  let selectedBackgroundId = $state(appState.currentBackgroundId!.toString());
  $effect(() => {
    appState.currentBackgroundId = selectedBackgroundId;
  })
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class={buttonVariants({ variant: 'default', size: 'icon' })}>
    <Image />
  </DropdownMenu.Trigger>
  <DropdownMenu.Content
    class="max-h-[50vh] overflow-y-auto"
  >
    <DropdownMenu.Group>
      <DropdownMenu.GroupHeading>Select background</DropdownMenu.GroupHeading>
      <DropdownMenu.Separator />
      <DropdownMenu.RadioGroup bind:value={selectedBackgroundId} class="grid grid-cols-2 md:grid-cols-4">
        {#each appState.backgrounds as background}
          <DropdownMenu.RadioItem value={background.id.toString()} hideRadio>
            <div class="relative flex items-center flex-col">
              <div class="absolute bottom-0 left-0 w-full bg-black/50 text-white text-sm text-center p-1">
                {background.name}
              </div>
              <img
                src={background.thumbnailUrl}
                alt={background.name}
                class="size-32 object-cover rounded-sm"
              />
            </div>
          </DropdownMenu.RadioItem>
        {/each}
      </DropdownMenu.RadioGroup>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
