<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Info from '@lucide/svelte/icons/info';
  import { Button } from '../ui/button';
</script>

<Dialog.Root>
  <Dialog.Trigger><Button size="icon"><Info /></Button></Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Info & disclaimer</Dialog.Title>
    </Dialog.Header>
    <p>
      This project was created as an alternative to Chillhop Radio's web player, by implementing a
      better, glassmorphic user interface paired with other utilities like Pomodoro timers and such,
      which will be added soon.
    </p>
    <p>
      I do not have the right to the songs played on this radio station, nor do I have any
      affiliation with Chillhop Music. <a href="https://github.com/SrIzan10/chillhop" class="underline">This project is open source</a> and not intended for
      commercial use.
    </p>
    <p>
      🄯 GNU GPL, <a href="https://srizan.dev" class="underline">Sr Izan</a>.
    </p>
    <p class="text-sm">
      Shoot me an email (izan *at* srizan *dot* dev) if you want this taken down.
    </p>
  </Dialog.Content>
</Dialog.Root>
