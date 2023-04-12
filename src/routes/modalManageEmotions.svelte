<script>
	import { onDestroy, onMount } from 'svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { Dropdown, DropdownItem, MenuButton, Input, Radio } from 'flowbite-svelte';

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

<div class="wrapperModal">
	<div style="display: flex; margin-bottom:0.5rem; gap:0.8rem; align-items: center;">
		<MenuButton class="dots-menu dark:text-white" id="btnResetEmotions" />
		<Dropdown triggeredBy=".dots-menu">
			<DropdownItem on:click={resetEmotions}>Reset emotions</DropdownItem>
		</Dropdown>
		<h2>Manage emotions list</h2>
	</div>
	<div class="emotionsWrapper">
		<div class="emotionsGroup">
			{#each emotionsListed as emotion}
				{#if emotion.value == 0}
					<div class="singleEmotion is-0">{emotion.text}</div>
				{/if}
			{/each}
		</div>
		<div class="emotionsGroup">
			{#each emotionsListed as emotion}
				{#if emotion.value == 1}
					<div class="singleEmotion is-1">{emotion.text}</div>
				{/if}
			{/each}
		</div>
		<div class="emotionsGroup">
			{#each emotionsListed as emotion}
				{#if emotion.value == 2}
					<div class="singleEmotion is-2">{emotion.text}</div>
				{/if}
			{/each}
		</div>
	</div>
	<div class="wrapperNewEmotion">
		<Input
			type="text"
			name="newEmotion"
			id="newEmotion"
			placeholder="New emotion"
			bind:value={newEmotion}
			autocomplete="off"
		/>
		<div class="wrapperRadio">
			<Radio bind:group={emotionType} name="type" value={0}>Good</Radio>
			<Radio bind:group={emotionType} name="type" value={1}>Middle</Radio>
			<Radio bind:group={emotionType} name="type" value={2}>Bad</Radio>
		</div>
		<button on:click={saveNewEmotion} id="btnSave">Save</button>
	</div>
</div>

<style>
	.wrapperRadio {
		display: flex;
		flex-direction: column;
	}

	.wrapperModal {
		align-items: flex-start;
		flex-direction: column;
		gap: 0;
	}

	.wrapperNewEmotion {
		display: flex;
		flex-direction: row;
		width: 100%;
		gap: 1rem;
		align-items: center;
	}

	.emotionsWrapper {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		margin-bottom: 1rem;
	}

	.emotionsGroup {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.2rem;
	}

	.singleEmotion {
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		border: 2px solid;
		border-radius: 8px;
		width: min-content;
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
