<script>
  import MusicPlayer from '@/components/app/now-playing.svelte';
  import StationDropdown from '@/components/app/station-dropdown.svelte';
</script>

<div
  class="fixed bottom-5 left-2 right-2 z-50 flex items-center p-4 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg"
>
  <MusicPlayer />
  <div class="flex-1"></div>
  <StationDropdown />
</div>
