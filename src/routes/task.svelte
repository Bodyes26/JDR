<script>
	import { currentUser, pb } from '$lib/pocketbase';
	import { createEventDispatcher, onMount } from 'svelte';
	import FaRegEdit from 'svelte-icons/fa/FaRegEdit.svelte';
	export let title;
	export let id;
	export let dateTime = undefined;
	export let description = undefined;
	let time;
	const dispatch = createEventDispatcher();
	async function checkTask() {
		try {
			document.getElementById(id).classList.add('selected');
			const data = { done: true };
			const record = await pb.collection('tasks').update(id, data);
			dispatch('checkedTask', {
				id: id
			});
		} catch (err) {
			console.log(err);
		}
	}
	onMount(() => {
		document.getElementById(id).classList.remove('selected');
		if (dateTime) {
			time = dateTime.substring(11, 16);
		}
	});

	function modifyTask() {
		dispatch('modifyTask', {
			id: id,
			title: title,
			time: dateTime,
			description: description
		});
	}
	function showEdit() {
		document.getElementById('edit_' + id).style.opacity = '1';
	}
	function hideEdit() {
		document.getElementById('edit_' + id).style.opacity = '0';
	}
</script>

<div class="task">
	<div style="display: flex;">
		<div
			{id}
			class="checkbox"
			on:click={checkTask}
			on:keydown={checkTask}
			on:keyup={checkTask}
			on:keypress={checkTask}
		/>
		{#if time}
			<p class="time">{time}</p>
		{/if}
		<p
			on:click={modifyTask}
			on:keydown={modifyTask}
			on:keyup={modifyTask}
			on:keypress={modifyTask}
			on:mouseenter={showEdit}
			on:mouseleave={hideEdit}
			class="title"
		>
			{title}
		</p>
		<div class="modify" id="edit_{id}"><FaRegEdit /></div>
		<div class="selected" style="display: hidden;" />
	</div>
	{#if description}
		<div>
			<p class="taskDescription">{description}</p>
		</div>
	{/if}
</div>

<style>
	.modify {
		margin-left: 0.5rem;
		opacity: 0;
		width: 1.5rem;
		height: 1.5rem;
		transition: opacity 0.25s ease;
	}

	.modify:hover {
		opacity: 1;
		cursor: pointer;
	}

	.checkbox {
		margin-top: 2px;
		height: 20px;
		width: 20px;
		border-radius: 4px;
		margin-right: 0.5rem;
		transition: background-color 0.25s ease;
		border: 2px solid rgba(255, 255, 255, 0.2);
	}

	p {
		margin: 0;
		width: 80%;
		max-width: fit-content;
		font-size: large;
	}

	.checkbox:hover {
		cursor: pointer;
	}

	.title:hover {
		cursor: pointer;
	}

	.selected {
		background-color: aqua;
	}

	.task {
		display: flex;
		margin-bottom: 0.4rem;
		flex-direction: column;
	}

	.time {
		font-size: small;
		opacity: 0.8;
		margin-right: 0.5rem;
		margin-top: 4px;
	}

	.taskDescription {
		margin-left: 4rem;
		padding-left: 1rem;
		font-size: small;
	}
</style>
