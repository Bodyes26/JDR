<script>
	import { onDestroy, onMount } from 'svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { Dropdown, DropdownItem, MenuButton, Input, Radio, Button } from 'flowbite-svelte';

	export let emotionsListed = [];
	let unsubscribe;
	onMount(async () => {
		let filter = "user = '" + $currentUser.id + "'";
		const temp = await pb.collection('emotions').getList(1, 50, {
			filter: filter,
			sort: 'value'
		});
		emotionsListed = temp.items;
		unsubscribe = await pb.collection('emotions').subscribe('*', async ({ action, record }) => {
			if (action === 'create') {
				emotionsListed = [...emotionsListed, record];
			}
			if (action === 'delete') {
				emotionsListed = emotionsListed.filter((m) => m.id !== record.id);
			}
		});
	});

	onDestroy(async () => {
		unsubscribe();
	});

	let newEmotion;
	let emotionType = 0;

	async function saveNewEmotion() {
		try {
			const data = {
				text: newEmotion,
				value: emotionType,
				user: $currentUser.id
			};
			const record = await pb.collection('emotions').create(data);
		} catch (err) {
			console.log(err);
		}
		newEmotion = '';
	}

	async function resetEmotions() {
		let response = confirm('Are you sure?');
		if (response) {
			const filter = '"Thankful, Relaxed, Excited, Mah, Sad, Depressed, Good" !~ text';
			const records = await pb.collection('emotions').getFullList({
				filter: filter
			});
			console.log('records', records);
			console.log('record 1', records[0].id);
			records.forEach(async (record) => {
				await pb.collection('emotions').delete(record.id);
			});
		}
	}
</script>

<div class="flex flex-col items-start gap-0 p-0">
	<div class="flex flex-col gap-1 mb-4">
		<div class="flex flex-row flex-wrap gap-1">
			{#each emotionsListed as emotion}
				{#if emotion.value == 0}
					<div
						class="px-2 py-1 border-2 border-solid rounded-lg bg-transparent transition-colors duration-200 ease-in border-lime-500"
					>
						{emotion.text}
					</div>
				{/if}
			{/each}
		</div>
		<div class="flex flex-row flex-wrap gap-1">
			{#each emotionsListed as emotion}
				{#if emotion.value == 1}
					<div
						class="px-2 py-1 border-2 border-solid rounded-lg bg-transparent transition-colors duration-200 ease-in border-gray-400"
					>
						{emotion.text}
					</div>
				{/if}
			{/each}
		</div>
		<div class="flex flex-row flex-wrap gap-1">
			{#each emotionsListed as emotion}
				{#if emotion.value == 2}
					<div
						class="px-2 py-1 border-2 border-solid rounded-lg bg-transparent transition-colors duration-200 ease-in border-orange-400"
					>
						{emotion.text}
					</div>
				{/if}
			{/each}
		</div>
	</div>
	<div class="flex flex-row w-full gap-4 items-center">
		<Input
			type="text"
			name="newEmotion"
			id="newEmotion"
			placeholder="New emotion"
			bind:value={newEmotion}
			autocomplete="off"
		/>
		<div class="flex flex-col">
			<Radio bind:group={emotionType} name="type" value={0}>Good</Radio>
			<Radio bind:group={emotionType} name="type" value={1}>Middle</Radio>
			<Radio bind:group={emotionType} name="type" value={2}>Bad</Radio>
		</div>
		<Button outline on:click={saveNewEmotion} id="btnSave">Save</Button>
		<MenuButton class="dots-menu dark:text-white" id="btnResetEmotions" />
		<Dropdown triggeredBy=".dots-menu">
			<DropdownItem on:click={resetEmotions}>Reset emotions</DropdownItem>
		</Dropdown>
	</div>
</div>
