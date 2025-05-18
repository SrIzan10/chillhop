<script lang="ts">
  import Button from '@/components/ui/button/button.svelte';
  import { state as appState } from '@/state.svelte';
  import { onMount } from 'svelte';

  let workPhase = $state(true);
  let timeLeft = $state(0);
  let intervalHandle: ReturnType<typeof setInterval> | null = null;

  let startSoundElement: HTMLAudioElement;
  let endSoundElement: HTMLAudioElement;

  let minutes = $derived(Math.floor(timeLeft / 60));
  let seconds = $derived(timeLeft % 60);

  onMount(() => {
    const defaultFirst = 20 * 60;
    const defaultSecond = 20;

    if (!appState.workRuleTimer) appState.workRuleTimer = defaultFirst;
    if (!appState.restRuleTimer) appState.restRuleTimer = defaultSecond;

    timeLeft = appState.workRuleTimer;
  });

  function playSound(element: HTMLAudioElement) {
    if (!element) return;

    element.currentTime = 0;

    const playPromise = element.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error('Audio play error:', error);
        if (error.name === 'NotAllowedError') {
          console.warn('Audio playback blocked by browser. User interaction required.');
        }
      });
    }
  }

  function startCountdown() {
    if (intervalHandle) {
      clearInterval(intervalHandle);
      intervalHandle = null;
    }

    intervalHandle = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
      } else {
        if (workPhase) {
          workPhase = false;
          timeLeft = appState.restRuleTimer;
          playSound(startSoundElement);
        } else {
          workPhase = true;
          timeLeft = appState.workRuleTimer;
          playSound(endSoundElement);
          appState.is202020Active = false;
        }
      }
    }, 1000);
  }

  $effect(() => {
    if (appState.is202020Active) {
      startCountdown();
    } else if (intervalHandle) {
      clearInterval(intervalHandle);
      intervalHandle = null;
    }

    return () => {
      if (intervalHandle) {
        clearInterval(intervalHandle);
        intervalHandle = null;
        appState.is202020Active = false;
      }
    };
  });

  function startTimer() {
    reset();
    timeLeft = appState.workRuleTimer;
    workPhase = true;
    appState.is202020Active = true;
  }

  function stopTimer() {
    reset();
    appState.is202020Active = false;
  }

  function reset() {
    appState.workRuleTimer = 20 * 60; // 20 * 60 on prod
    appState.restRuleTimer = 20; // 20 on prod
  }
</script>

<audio
  bind:this={startSoundElement}
  src="https://lofi-cdn.srizan.dev/assets/202020/start.mp3"
  preload="auto"
></audio>

<audio
  bind:this={endSoundElement}
  src="https://lofi-cdn.srizan.dev/assets/202020/done.mp3"
  preload="auto"
></audio>

<div class="flex flex-col p-4">
  <div class="mb-6">
    <div class="text-2xl font-bold">
      {workPhase ? 'Work Time' : 'Eye Rest'}
    </div>
    <div class="text-3xl font-bold mt-2">
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
  </div>

  <div class="mb-6">
    <ol class="list-decimal list-inside">
      <li>Every 20 minutes of screen time</li>
      <li>Look at something 20 feet away</li>
      <li>For 20 seconds</li>
    </ol>
  </div>

  <div class="flex gap-2">
    {#if appState.is202020Active}
      <Button variant="destructive" onclick={stopTimer}>Stop</Button>
    {:else}
      <Button onclick={startTimer}>Start</Button>
    {/if}
  </div>
</div>
