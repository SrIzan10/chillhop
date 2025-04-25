<script lang="ts">
  // *atmospheres* sounds corny but cool i guess :sob:
  // TODO: make max volume configurable
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { Button } from '../ui/button';
  import AudioLines from '@lucide/svelte/icons/audio-lines';
  import { state as appState } from '@/state.svelte';
  import Slider from '../ui/slider/slider.svelte';
  console.log(appState.atmospheres)

  function sliderChange(name: string, volume: number) {
    if (appState.activeAtmospheres.hasOwnProperty(name) && volume === 0) {
      delete appState.activeAtmospheres[name];
    } else {
      appState.activeAtmospheres[name] = volume;
    }
  }
</script>

<Popover.Root>
  <Popover.Trigger><Button size="icon"><AudioLines /></Button></Popover.Trigger>
  <Popover.Content>
    <h3 class="text-sm font-semibold">Atmospheres</h3>
    {#each appState.atmospheres as atmosphere}
      <div class="flex items-center space-x-2">
        <Slider
          type="single"
          max={0.25}
          step={0.01}
          class="w-32"
          onValueChange={(value) => {
            sliderChange(atmosphere.name, value);
          }}
        />
        <label for={atmosphere.id}>{atmosphere.name}</label>
      </div>
    {/each}
  </Popover.Content>
</Popover.Root>
