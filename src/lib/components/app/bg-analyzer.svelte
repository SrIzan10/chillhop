<script lang="ts">
  import { onMount } from 'svelte';
  import { setMode } from 'mode-watcher';
  
  export let videoSelector: string = "#bg-video";
  export let updateInterval: number = 2000;
  console.log('update')

  function analyzeVideoBrightness(video: HTMLVideoElement, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    if (video.paused || video.ended) return;

    canvas.width = 32;
    canvas.height = 32;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let totalBrightness = 0;
    let pixelCount = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
      totalBrightness += brightness;
      pixelCount++;
    }

    const avgBrightness = totalBrightness / pixelCount;
    const isDark = avgBrightness < 0.5;

    setMode(isDark ? 'dark' : 'light');
  }

  onMount(() => {
    const video = document.querySelector(videoSelector) as HTMLVideoElement;
    if (!video) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function updateGlobalTextColor() {
      analyzeVideoBrightness(video, canvas, ctx!);
    }

    video.addEventListener('loadeddata', updateGlobalTextColor);

    const interval = setInterval(updateGlobalTextColor, updateInterval);

    return () => {
      clearInterval(interval);
      video.removeEventListener('loadeddata', updateGlobalTextColor);
    };
  });
</script>