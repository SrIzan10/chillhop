<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Info from '@lucide/svelte/icons/info';
  import { Button } from '../ui/button';
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
</script>

<Dialog.Root>
  <Tooltip.Root>
    <Tooltip.Trigger>
      <Dialog.Trigger>
        <Button size="icon"><Info /></Button>
      </Dialog.Trigger>
    </Tooltip.Trigger>
    <Tooltip.Content>Info</Tooltip.Content>
  </Tooltip.Root>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Info & disclaimer</Dialog.Title>
    </Dialog.Header>
    <p>
      Thanks for using my lofi player! There are way more features in the works, so stay tuned!
    </p>
    <p>
      Star over at <a href="https://github.com/SrIzan10/lofi" class="underline" target="_blank">Github</a> and <a href="https://github.com/sponsors/SrIzan10" class="underline" target="_blank">donate</a> if you like my work!
    <p>
      I do not have the right to the songs played on this radio station, nor do I have any
      affiliation with Chillhop Music. <a href="https://github.com/SrIzan10/lofi" class="underline" target="_blank">This project is open source</a> and not intended for
      commercial use.
    </p>
    <p>
      🄯 GNU GPL, <a href="https://srizan.dev" class="underline">Sr Izan</a>.
    </p>
    <p class="text-sm">
      Shoot me an email (izan *at* srizan *dot* dev) if you (chillhop) want this taken down.
    </p>
  </Dialog.Content>
</Dialog.Root>
