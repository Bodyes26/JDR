<script>
	import { onMount, onDestroy } from 'svelte';
	import Emotions from './emotions.svelte';
	import { pb } from '$lib/pocketbase';
	import { dateForPocketbase, readableDateTime } from '$lib/script';
	let journals = [];
	let unsubscribe;

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

<div class="journals">
	{#each journals as journal (journal.id)}
		<div class="journal">
			<p class="datetime">{readableDateTime(journal.created)}</p>
			<div class="voteTitle">
				<p class="title">~ {journal.title}</p>
				<p class="vote">{journal.vote}</p>
			</div>
			<p class="emotions"><Emotions emotions={journal.emotion} /></p>
			<p class="description">{journal.description}</p>
		</div>
	{/each}
</div>

<style>
	.datetime {
		margin-left: 1rem;
		margin-bottom: 0;
		font-weight: 700;
		font-size: small;
	}

	.emotions {
		margin-left: 1rem;
	}

	.title {
		font-style: italic;
		font-size: 18px;
	}

	.voteTitle {
		margin-left: 1rem;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.journals {
		gap: 1rem;
		height: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		width: 100%;
	}
</style>
