<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import MessageSquare from '@lucide/svelte/icons/message-square';
  import { Button } from '../ui/button';
  import { toast } from 'svelte-sonner';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  let feedback = $state('');
  let open = $state(false);
</script>

<Dialog.Root bind:open>
  <Tooltip.Root>
    <Tooltip.Trigger>
      <Dialog.Trigger>
        <Button size="icon"><MessageSquare /></Button>
      </Dialog.Trigger>
    </Tooltip.Trigger>
    <Tooltip.Content>Send Feedback</Tooltip.Content>
  </Tooltip.Root>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Send Feedback</Dialog.Title>
    </Dialog.Header>
    <p>Have suggestions or found a bug? Let me know!</p>
    <form
      class="mt-4 space-y-4"
      onsubmit={(e) => {
        e.preventDefault();
        fetch(
          'https://cors.notesnook.com/https://echospace.dev/api/feedback/cma9juarn0000m40sko0qqt2t',
          {
            method: 'POST',
            body: JSON.stringify({
              message: feedback,
            }),
          }
        ).then(() => {
          open = false;
          feedback = '';
          toast('Thanks for your feedback!');
        });
      }}
    >
      <div class="grid w-full items-center gap-1.5">
        <textarea
          id="feedback"
          class="p-2 rounded-md bg-white/10 border border-white/20"
          rows="4"
          bind:value={feedback}
        ></textarea>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
