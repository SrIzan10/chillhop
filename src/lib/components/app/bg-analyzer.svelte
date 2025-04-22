<script lang="ts">
  import { setMode } from 'mode-watcher';
  import { state as appState } from '@/state.svelte';
  
  let { videoSelector }: { videoSelector: string } = $props();

  function analyzeVideoBrightness(video: HTMLVideoElement, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const perf = window.performance.now();
    if (video.ended || video.readyState < 3) return;
    
    canvas.width = 32;
    canvas.height = 32;
    
    // prettier-ignore
    ctx.drawImage(
      video,
      0, 0, video.videoWidth, video.videoHeight,
      0, 0, canvas.width, canvas.height
    );

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
    const isDark = avgBrightness < 0.4; 

    setMode(isDark ? 'dark' : 'light');

    const now = window.performance.now();
    console.log(`brightness: ${avgBrightness}, time taken: ${now - perf}ms`);
  }

  $effect(() => {
    const videoId = appState.currentBackgroundId;
    if (!videoId) return;
    
    const video = document.querySelector(videoSelector) as HTMLVideoElement;
    if (!video) return;

    const analyzeWhenReady = () => {
      if (video.readyState >= 3) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        analyzeVideoBrightness(video, canvas, ctx);
        video.removeEventListener('loadeddata', analyzeWhenReady);
      }
    };

    if (video.readyState >= 3) {
      analyzeWhenReady();
    }
    
    video.addEventListener('loadeddata', analyzeWhenReady);
    
    return () => {
      video.removeEventListener('loadeddata', analyzeWhenReady);
    };
  });
</script>