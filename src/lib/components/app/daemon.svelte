<script lang="ts">
  import { state } from '@/state.svelte';
  import { getGeneralData, getStationSongs, setSongTime } from '@/utils';
  import { onMount } from 'svelte';

  // svelte-ignore non_reactive_update
  let audioElement: HTMLAudioElement;

  function togglePlayback(play: boolean) {
    if (!audioElement) return;

    if (play && state.hasInteracted) {
      audioElement.currentTime = state.currentTime;
      audioElement.play().catch(() => {
        state.error = 'Audio playback failed. Please interact with the page first.';
        state.isPlaying = false;
      });
    } else {
      state.currentTime = audioElement.currentTime;
      audioElement.pause();
    }
  }

  state.togglePlay = () => {
    state.isPlaying = !state.isPlaying;
    togglePlayback(state.isPlaying);
  };

  onMount(async () => {
    const data = await getGeneralData();
    state.presets = data.presets;
    state.stations = data.stations;
    // TODO: support parent backgrounds
    state.backgrounds = data.backgrounds.filter(bg => bg.isActive === 1 && !bg.parentId);
    state.atmospheres = data.atmospheres;

    const storedVolume = window.localStorage.getItem('volume');
    if (storedVolume) {
      state.volume = parseFloat(storedVolume);
    }

    if (data.stations.length > 0 && state.currentStation === null) {
      state.currentStation = data.stations[0].id;
    }
    if (state.backgrounds.length > 0 && state.currentBackgroundId === null) {
      state.currentBackgroundId = state.backgrounds[0].id;
      console.log('asdf', state.currentBackgroundId);
    } else {
      state.error = 'Failed to load initial data (empty response).';
    }

    const stationSongs = await getStationSongs(state.currentStation!);
    if (stationSongs) {
      state.songQueue = stationSongs;
    } else {
      state.error = 'Failed to load songs.';
    }

    if (state.songQueue.length > 0) {
      state.currentSong = state.songQueue[0];
      state.duration = state.currentSong.duration;
    } else {
      state.error = 'No songs available.';
    }

    setSongTime()

    state.isLoading = false;
  });

  $effect(() => {
    if (!audioElement) return;
    togglePlayback(state.isPlaying);
  });

  $effect(() => {
    const currentTime = state.currentTime;
    const currentSong = state.currentSong;
    console.log(`setting time to ${currentTime}`);
    
    if (!audioElement || !currentSong) return;
    const handleTimeSet = () => {
      if (audioElement.readyState >= 2) {
        audioElement.currentTime = currentTime;
      }
    };
    
    audioElement.removeEventListener('loadedmetadata', handleTimeSet);
    
    if (audioElement.readyState >= 2) {
      audioElement.currentTime = currentTime;
    } else {
      audioElement.addEventListener('loadedmetadata', handleTimeSet, { once: true });
    }
  })

  $effect(() => {
    if (state.currentStation) {
      getStationSongs(state.currentStation).then((songs) => {
        if (songs) {
          state.songQueue = songs;
          state.currentSong = state.songQueue[0];
          state.duration = state.currentSong.duration;
          setSongTime();
        } else {
          state.error = 'Failed to load songs.';
        }
      });
    }
  })
</script>

{#if !state.hasInteracted}
  <button
    class="flex flex-col h-screen w-full items-center justify-center space-y-2 cursor-pointer"
    onclick={() => {
      state.hasInteracted = true;
      togglePlayback(true);
    }}
  >
    <p>Click anywhere on the screen</p>
  </button>
{/if}

{#if !state.isLoading}
  <audio
    bind:this={audioElement}
    src={`https://stream.chillhop.com/mp3/${state.currentSong!.fileId}`}
    autoplay
    volume={state.volume}
    onended={async () => {
      state.currentSong = null;
      state.currentTime = 0;

      state.songQueue.shift();
      if (state.songQueue.length > 0) {
        state.currentSong = state.songQueue[0];
        state.duration = state.currentSong.duration;
      } else {
        const stationSongs = await getStationSongs(state.currentStation!);
        if (stationSongs) {
          state.songQueue = stationSongs;
          state.currentSong = state.songQueue[0];
          state.duration = state.currentSong.duration;
        } else {
          state.error = 'Failed to load songs.';
        }
      }
    }}
    class="hidden"
  ></audio>
{/if}
