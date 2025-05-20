<script lang="ts">
  import '../app.css';
  import { ModeWatcher } from "mode-watcher";
  import { dev } from '$app/environment';
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  let { children } = $props();
</script>

<ModeWatcher />
<Toaster />
{#if !dev}
  <script defer src="https://analytics.srizan.dev/ua.js" data-website-id="02aba16d-f8eb-4363-973b-dab04db4de10"></script>
{/if}
{@render children()}
