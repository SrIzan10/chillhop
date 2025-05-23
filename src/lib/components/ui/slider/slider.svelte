<script lang="ts">
	import { Slider as SliderPrimitive, type WithoutChildrenOrChild } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		value = $bindable(),
		orientation = "horizontal",
		class: className,
		...restProps
	}: WithoutChildrenOrChild<SliderPrimitive.RootProps> = $props();
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<SliderPrimitive.Root
	bind:ref
	bind:value={value as never}
	{orientation}
	class={cn(
		"relative flex touch-none select-none items-center data-[orientation='vertical']:h-full data-[orientation='horizontal']:w-full data-[orientation='vertical']:w-auto data-[orientation='vertical']:flex-col",
		className
	)}
	{...restProps}
>
	{#snippet children({ thumbs })}
    <span
      data-orientation={orientation}
      class="bg-primary/20 relative grow overflow-hidden rounded-full data-[orientation='horizontal']:h-1.5 data-[orientation='vertical']:h-full data-[orientation='horizontal']:w-full data-[orientation='vertical']:w-1.5 z-10"
    >
      <SliderPrimitive.Range
        class="bg-primary absolute data-[orientation='horizontal']:h-full data-[orientation='vertical']:w-full"
      />
    </span>
		{#each thumbs as thumb (thumb)}
      <SliderPrimitive.Thumb
        index={thumb}
        class={cn(
          "border-primary/50 bg-background focus-visible:ring-ring block size-4 rounded-full border shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
          "bg-white/10 backdrop-blur-md hover:bg-white/15 text-foreground border border-white/20 shadow-lg translate-z-0 relative z-20",
        )}
      />
    {/each}
	{/snippet}
</SliderPrimitive.Root>
