<script>
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';

	export let emotions = [];
	export let emotionsListed = [];

	onMount(async () => {
		const filter = "'" + emotions + "' ~ id";
		const temp = await pb.collection('emotions').getList(1, 30, {
			filter: filter,
			sort: 'value'
		});
		emotionsListed = temp.items;
	});
</script>

<div class="emotionsWrapper">
	{#each emotionsListed as emotion}
		{#if emotion.value == 0}
			<div class="singleEmotion is-0">{emotion.text}</div>
		{:else if emotion.value == 1}
			<div class="singleEmotion is-1">{emotion.text}</div>
		{:else if emotion.value == 2}
			<div class="singleEmotion is-2">{emotion.text}</div>
		{/if}
	{/each}
</div>

<style>
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
</style>
