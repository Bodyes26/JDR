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

<div class="flex flex-wrap gap-1">
	{#each emotionsListed as emotion}
		{#if emotion.value == 0}
			<div class="px-2 border-2 border-solid rounded-lg border-lime-500">{emotion.text}</div>
		{:else if emotion.value == 1}
			<div class="px-2 border-2 border-solid rounded-lg border-gray-400">{emotion.text}</div>
		{:else if emotion.value == 2}
			<div class="px-2 border-2 border-solid rounded-lg is-2 border-orange-400">{emotion.text}</div>
		{/if}
	{/each}
</div>
