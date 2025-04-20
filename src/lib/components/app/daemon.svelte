<script lang="ts">
  import { state as appState } from '@/state.svelte';
  import { getGeneralData, getStationSongs, setSongTime } from '@/utils';
  import { onMount } from 'svelte';

  // svelte-ignore non_reactive_update
  let audioElement: HTMLAudioElement;
  let isTransitioning = $state(false);

  function togglePlayback(play: boolean) {
    if (!audioElement) return;

    if (play && appState.hasInteracted) {
      audioElement.currentTime = appState.currentTime;
      audioElement.play().catch(() => {
        appState.error = 'Audio playback failed. Please interact with the page first.';
        appState.isPlaying = false;
      });
    } else {
      appState.currentTime = audioElement.currentTime;
      audioElement.pause();
    }
  }

  appState.togglePlay = () => {
    appState.isPlaying = !appState.isPlaying;
    togglePlayback(appState.isPlaying);
  };

  // ios safari requires a user gesture to play audio
  // please send help
  function handleSongEnd() {
    if (isTransitioning) return;
    
    isTransitioning = true;
    appState.currentSong = null;
    appState.currentTime = 0;

    appState.songQueue.shift();
    if (appState.songQueue.length > 0) {
      appState.currentSong = appState.songQueue[0];
      appState.duration = appState.currentSong.duration;

      setTimeout(() => { isTransitioning = false; }, 500);
    } else {
      getStationSongs(appState.currentStation!).then((songs) => {
        if (songs) {
          appState.songQueue = songs;
          appState.currentSong = appState.songQueue[0];
          appState.duration = appState.currentSong.duration;
        } else {
          appState.error = 'Failed to load songs.';
        }

        setTimeout(() => { isTransitioning = false; }, 500);
      });
    }
  }

  function checkTimeAndPrepareNextSong() {
    if (!audioElement || !appState.currentSong || isTransitioning) return;
    
    // if near the end, prepare for next song
    if (audioElement.duration > 0 && 
        audioElement.currentTime > 0 && 
        audioElement.duration - audioElement.currentTime < 1.5) {
      handleSongEnd();
    }
  }

  onMount(async () => {
    const data = await getGeneralData();
    appState.presets = data.presets;
    appState.stations = data.stations;
    // TODO: support parent backgrounds
    appState.backgrounds = data.backgrounds.filter(bg => bg.isActive === 1 && !bg.parentId);
    appState.atmospheres = data.atmospheres;

    const storedVolume = window.localStorage.getItem('volume');
    if (storedVolume) {
      appState.volume = parseFloat(storedVolume);
    }

    if (data.stations.length > 0 && appState.currentStation === null) {
      appState.currentStation = data.stations[0].id;
    }
    if (appState.backgrounds.length > 0 && appState.currentBackgroundId === null) {
      appState.currentBackgroundId = appState.backgrounds[0].id;
      console.log('asdf', appState.currentBackgroundId);
    } else {
      appState.error = 'Failed to load initial data (empty response).';
    }

    const stationSongs = await getStationSongs(appState.currentStation!);
    if (stationSongs) {
      appState.songQueue = stationSongs;
    } else {
      appState.error = 'Failed to load songs.';
    }

    if (appState.songQueue.length > 0) {
      appState.currentSong = appState.songQueue[0];
      appState.duration = appState.currentSong.duration;
    } else {
      appState.error = 'No songs available.';
    }

    setSongTime()

    appState.isLoading = false;
  });

  $effect(() => {
    if (!audioElement) return;
    togglePlayback(appState.isPlaying);
  });

  $effect(() => {
    const currentTime = appState.currentTime;
    const currentSong = appState.currentSong;
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
    if (appState.currentStation) {
      getStationSongs(appState.currentStation).then((songs) => {
        if (songs) {
          appState.songQueue = songs;
          appState.currentSong = appState.songQueue[0];
          appState.duration = appState.currentSong.duration;
          setSongTime();
        } else {
          appState.error = 'Failed to load songs.';
        }
      });
    }
  })
</script>

{#if !appState.hasInteracted}
  <button
    class="flex flex-col h-screen w-full items-center justify-center space-y-2 cursor-pointer"
    onclick={() => {
      appState.hasInteracted = true;
      togglePlayback(true);
    }}
  >
    <p>Click anywhere on the screen</p>
  </button>
{/if}

{#if !appState.isLoading}
  <audio
    bind:this={audioElement}
    src={`https://stream.chillhop.com/mp3/${appState.currentSong!.fileId}`}
    autoplay
    volume={appState.volume}
    ontimeupdate={checkTimeAndPrepareNextSong}
    onended={handleSongEnd}
    class="hidden"
  ></audio>
{/if}
