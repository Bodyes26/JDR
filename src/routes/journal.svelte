<script>
	import { onMount } from 'svelte';
	import Emotions from './emotions.svelte';
	import { pb } from '$lib/pocketbase';
	import { dateForPocketbase, readableDateTime } from '$lib/script';
	let journals = [];

	onMount(async () => {
		const day1 = dateForPocketbase('today');
		const day2 = dateForPocketbase('tomorrow');
		const filter = "created > '" + day1 + "' && created < '" + day2 + "'";
		const resultList = await pb.collection('journals').getList(1, 50, {
			filter: filter,
			sort: '-created'
		});
		journals = resultList.items;
		await pb.collection('journals').subscribe('*', async ({ action, record }) => {
			if (action === 'create') {
				journals = [...journals, record];
			}
			if (action === 'delete') {
				journals = journals.filter((m) => m.id !== record.id);
			}
		});
	});
</script>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" />
<link href="https://fonts.googleapis.com/css2?family=Itim&display=swap" rel="stylesheet" />

<div class="flex flex-row flex-wrap justify-center w-full gap-4 h-full mt-6">
	{#each journals as journal (journal.id)}
		<div
			class="relative bg-gray-100 h-fit rounded-lg pt-2 flex flex-wrap flex-col gap-0 w-full pb-2 dark:bg-neutral-900"
		>
			<p class="ml-4 mb-0 font-bold text-xs dark:text-white dark:opacity-70">
				{readableDateTime(journal.created)}
			</p>
			<div class="ml-4 flex flex-row justify-between items-center">
				<p class="italic text-lg dark:text-white">~ {journal.title}</p>
				<p class="vote dark:text-white">{journal.vote}</p>
			</div>
			<p class="ml-4 mb-2"><Emotions emotions={journal.emotion} /></p>
			<p
				class="ml-2 p-2 rounded-lg mr-2 bg-black bg-opacity-10 dark:bg-white dark:bg-opacity-10 dark:text-white"
			>
				{journal.description}
			</p>
		</div>
	{/each}
</div>
