<script>
	import { onMount } from 'svelte';
	import { currentUser, pb } from '$lib/pocketbase';

	export let emotionsListed = [];
	export let selected = [];

	onMount(async () => {
		let filter = "user = '" + $currentUser.id + "'";
		const temp = await pb.collection('emotions').getList(1, 50, {
			filter: filter,
			sort: 'value'
		});
		emotionsListed = temp.items;
	});

	/**
	 * @param {any} id
	 */
	function updateSelected(id) {
		if (!selected.includes(id)) {
			selected = [...selected, id];
			document.getElementById(id).classList.add('selected');
		} else {
			let temp = selected.filter((m) => m !== id);
			selected = temp;
			document.getElementById(id).classList.remove('selected');
		}
		document.getElementById(id).blur();
	}
</script>

<div class="flex flex-wrap gap-1">
	{#each emotionsListed as emotion}
		{#if emotion.value == 0}
			<button
				class="px-2 py-1 border-2 border-solid rounded-lg bg-transparent transition-colors duration-200 ease-in border-lime-500"
				on:click|preventDefault={() => updateSelected(emotion.id)}
				id={emotion.id}
			>
				{emotion.text}
			</button>
		{:else if emotion.value == 1}
			<button
				class="px-2 py-1 border-2 border-solid rounded-lg bg-transparent transition-colors duration-200 ease-in border-gray-500"
				on:click|preventDefault={() => updateSelected(emotion.id)}
				id={emotion.id}
			>
				{emotion.text}
			</button>
		{:else if emotion.value == 2}
			<button
				class="px-2 py-1 border-2 border-solid rounded-lg bg-transparent transition-colors duration-200 ease-in border-orange-400"
				on:click|preventDefault={() => updateSelected(emotion.id)}
				id={emotion.id}
			>
				{emotion.text}
			</button>
		{/if}
	{/each}
	<div class="selected" style="display: hidden" />
</div>

<style>
	.selected {
		background-color: lightgray;
	}
</style>
