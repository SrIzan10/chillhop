<script lang="ts">
  import { state as appState } from '@/state.svelte'
  import Button from '../ui/button/button.svelte';
  import Plus from '@lucide/svelte/icons/plus';
  import X from '@lucide/svelte/icons/x';
  import { useIsMobile } from '@/isMobile.svelte';
  
  let newTodoText = '';
  let mobile = useIsMobile();
  
  function addTodo() {
    if (newTodoText.trim()) {
      appState.todoList = [...appState.todoList, newTodoText];
      newTodoText = '';
    }
  }
  
  function removeTodo(index: number) {
    appState.todoList = appState.todoList.filter((_, i) => i !== index);
  }
</script>

<div class="flex gap-2 mb-6">
  <input
    bind:value={newTodoText}
    placeholder="Add a new task..."
    class="flex-1 pl-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-40"
    on:keypress={(e) => e.key === 'Enter' && addTodo()}
  />
  <Button onclick={addTodo} class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg" size="icon"><Plus /></Button>
</div>

{#if appState.todoList.length === 0}
  <p class="text-white text-opacity-70 text-center py-4">No tasks yet. Add one above!</p>
{:else}
  <ul class="space-y-2">
    {#each appState.todoList as todo, index}
      <li class="flex items-center justify-between p-3 bg-white bg-opacity-10 rounded-lg group hover:bg-opacity-15 transition-all">
        <span class="text-white">{todo}</span>
        <button 
          on:click={() => removeTodo(index)}
          class="text-white hover:text-red-300 focus:outline-none"
          aria-label="Remove todo"
        >
          <X class="size-5" />
        </button>
      </li>
    {/each}
  </ul>
{/if}