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
		console.log(selected);
	}
</script>

<div class="emotionsWrapper">
	{#each emotionsListed as emotion}
		{#if emotion.value == 0}
			<button
				class="singleEmotion is-0"
				on:click|preventDefault={() => updateSelected(emotion.id)}
				id={emotion.id}
			>
				{emotion.text}
			</button>
		{:else if emotion.value == 1}
			<button
				class="singleEmotion is-1"
				on:click|preventDefault={() => updateSelected(emotion.id)}
				id={emotion.id}
			>
				{emotion.text}
			</button>
		{:else if emotion.value == 2}
			<button
				class="singleEmotion is-2"
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
	button:focus,
	button:focus-visible {
		outline: 0;
	}

	.emotionsWrapper {
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem;
	}

	.singleEmotion {
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		border: 2px solid;
		border-radius: 8px;
		background-color: transparent;
		transition: background-color 0.25s ease;
	}

	.is-0 {
		border-color: greenyellow;
	}
	.is-1 {
		border-color: gray;
	}
	.is-2 {
		border-color: orange;
	}

	.selected {
		background-color: lightgray;
	}
</style>
