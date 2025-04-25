<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { buttonVariants } from '$lib/components/ui/button/index.js';
  import AudioLines from '@lucide/svelte/icons/audio-lines';
  import { state as appState } from '@/state.svelte';
  import { Slider } from '../ui/slider/index.js';
  import VolumeX from '@lucide/svelte/icons/volume-x';
  import VolumeZero from '@lucide/svelte/icons/volume';
  import VolumeOne from '@lucide/svelte/icons/volume-1';
  import VolumeTwo from '@lucide/svelte/icons/volume-2';

  function sliderChange(name: string, volume: number) {
    if (volume === 0) {
      delete appState.activeAtmospheres[name];
    } else {
      appState.activeAtmospheres[name] = volume;
    }
  }

  function getVolumeValue(name: string) {
    return appState.activeAtmospheres[name] || 0;
  }
  console.log(appState.atmospheres)
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class={buttonVariants({ variant: 'default', size: 'icon' })}>
    <AudioLines />
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56 max-h-[50vh] overflow-y-auto">
    <DropdownMenu.Group>
      <DropdownMenu.GroupHeading>Atmospheres</DropdownMenu.GroupHeading>
      <DropdownMenu.Separator />
      <div class="grid gap-4">
        {#each appState.atmospheres as atmosphere}
          <div class="p-2 rounded-md hover:bg-white/5 transition-colors">
            <div class="flex items-center justify-between mb-1">
              <label for={atmosphere.id} class="text-sm font-medium">{atmosphere.name}</label>
              <span class="text-xs opacity-70">
                {#if getVolumeValue(atmosphere.name) > 0}
                  {#if getVolumeValue(atmosphere.name) > 0 && getVolumeValue(atmosphere.name) <= 0.4}
                    <VolumeZero class="inline size-3 mr-1" />
                  {:else if getVolumeValue(atmosphere.name) > 0.4 && getVolumeValue(atmosphere.name) <= 0.8}
                    <VolumeOne class="inline size-3 mr-1" />
                  {:else}
                    <VolumeTwo class="inline size-3 mr-1" />
                  {/if}
                  {Math.round(getVolumeValue(atmosphere.name) * 100)}%
                {:else}
                  <VolumeX class="inline size-3 mr-1" />
                  Off
                {/if}
              </span>
            </div>
            <Slider
              type="single"
              value={getVolumeValue(atmosphere.name)}
              id={atmosphere.id}
              max={1}
              step={0.01}
              onValueChange={(value) => {
                sliderChange(atmosphere.name, value);
              }}
            />
          </div>
        {/each}
      </div>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
