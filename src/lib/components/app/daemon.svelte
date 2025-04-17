<script lang="ts">
    import { state } from "@/state.svelte";
    import { getGeneralData, getStationSongs } from "@/utils";
    import { onMount } from "svelte";
    
    // svelte-ignore non_reactive_update
    let audioElement: HTMLAudioElement;

    onMount(async () => {
        const data = await getGeneralData();
        if (data) {
            state.presets = data.presets;
            state.stations = data.stations;
            state.backgrounds = data.backgrounds;
            state.atmospheres = data.atmospheres;

            if (data.stations.length > 0 && state.currentStation === null) {
                state.currentStation = data.stations[0].id;
            }
            if (data.backgrounds.length > 0 && state.currentBackgroundId === null) {
                const firstActiveBg = data.backgrounds.find(bg => bg.isActive && !bg.parentId);
                state.currentBackgroundId = firstActiveBg ? firstActiveBg.id : (data.backgrounds[0]?.id || null);
            }
        } else {
            state.error = "Failed to load initial data (empty response).";
        }

        const stationSongs = await getStationSongs(state.currentStation!);
        if (stationSongs) {
            state.songQueue = stationSongs;
        } else {
            state.error = "Failed to load songs.";
        }

        if (state.songQueue.length > 0) {
            state.currentSong = state.songQueue[0];
            state.duration = state.currentSong.duration;
        } else {
            state.error = "No songs available.";
        }

        const currentTime = new Date().getTime() / 1000;
        const startTime = new Date(state.currentSong!.startTime).getTime() / 1000;
        const endTime = new Date(state.currentSong!.endTime).getTime() / 1000;
        const duration = endTime - startTime;
        const elapsed = currentTime - startTime;
        if (elapsed > 0 && elapsed < duration) {
            state.currentTime = elapsed;
        } else {
            state.currentTime = 0;
        }
        
        state.isLoading = false;
    });

    $effect(() => {
        if (!audioElement) return;

        if (state.isPlaying && state.hasInteracted) {
            audioElement.play().catch(() => {
                state.error = "Audio playback failed. Please interact with the page first.";
                state.isPlaying = false;
            });
        } else {
            audioElement.pause();
        }

        if (state.currentTime > 0) {
            audioElement.currentTime = state.currentTime;
        }
    });
</script>

{#if !state.hasInteracted}
  <button class="flex flex-col h-screen w-full items-center justify-center space-y-2 cursor-pointer" onclick={() => {
    state.hasInteracted = true;
    
    if (state.isPlaying && audioElement) {
        audioElement.play().catch(() => {
            state.error = "Audio playback failed after interaction.";
            state.isPlaying = false;
        });
    }
  }}>
    <p>Click anywhere on the screen</p>
  </button>
{/if}

{#if !state.isLoading}
<audio
    bind:this={audioElement}
    src={`https://stream.chillhop.com/mp3/${state.currentSong!.fileId}`}
    autoplay
    onended={() => {
        state.currentSong = null;
        state.currentTime = 0;
        state.isPlaying = false;
    }}
    ontimeupdate={() => {
        const audio = document.querySelector("audio");
        if (audio) {
            state.currentTime = audio.currentTime;
        }
    }}
    class="hidden"
></audio>
{/if}