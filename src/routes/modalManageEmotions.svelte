<script>
	import { onDestroy, onMount } from 'svelte';
	import { currentUser, pb } from '$lib/pocketbase';
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
</script>

<div class="wrapperModal">
	<h3>Manage emotions list</h3>
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
		<input
			type="text"
			name="newEmotion"
			id="newEmotion"
			placeholder="New emotion"
			bind:value={newEmotion}
			autocomplete="off"
		/>
		<div class="wrapperRadio">
			<label>
				<input type="radio" bind:group={emotionType} name="type" class="radio" value={0} />
				Good
			</label>
			<label>
				<input type="radio" bind:group={emotionType} name="type" class="radio" value={1} />
				Middle
			</label>
			<label>
				<input type="radio" bind:group={emotionType} name="type" class="radio" value={2} />
				Bad
			</label>
		</div>
		<button on:click={saveNewEmotion} id="btnSave">Save</button>
	</div>
</div>

<style>
	.wrapperRadio {
		display: flex;
		flex-direction: column;
	}

	label {
		width: max-content;
	}

	.radio {
		height: auto;
		width: auto;
	}

	h3 {
		margin: 0;
		margin-bottom: 0.5rem;
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
