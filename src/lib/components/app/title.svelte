<script>
  import Button from '@/components/ui/button/button.svelte';
  import Star from '@lucide/svelte/icons/star';
  import Heart from '@lucide/svelte/icons/heart';
</script>

<div
  class="flex absolute top-0 left-0 items-center p-4 bg-white/10 backdrop-blur-lg rounded-br-xl shadow-lg *:text-bold space-x-2"
>
  <h1 class="text-2xl font-bold">lofi.srizan.dev</h1>
  <a href="https://github.com/SrIzan10/lofi" target="_blank">
    <Button size="icon"><Star /></Button>
  </a>
  <a href="https://github.com/sponsors/SrIzan10" target="_blank">
    <Button size="icon"><Heart /></Button>
  </a>
</div>
