<script lang="ts">
  import '../app.css';
  import { ModeWatcher } from "mode-watcher";
  import { dev } from '$app/environment';
  let { children } = $props();
</script>

<ModeWatcher />
{#if !dev}
  <script defer src="https://analytics.srizan.dev/ua.js" data-website-id="02aba16d-f8eb-4363-973b-dab04db4de10"></script>
{/if}
{@render children()}
