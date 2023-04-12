<script>
	import { currentUser, pb } from '$lib/pocketbase';
	import FaAlignLeft from 'svelte-icons/fa/FaAlignLeft.svelte';
	import TiTime from 'svelte-icons/ti/TiTime.svelte';
	import TiArrowRepeat from 'svelte-icons/ti/TiArrowRepeat.svelte';
	import { getContext, onMount } from 'svelte';
	import SveltyPicker from 'svelty-picker';
	import { tooltip } from 'svooltip';
	import 'svooltip/styles.css';
	import { readableDateTime, setupDateTimeForPocketbase } from '$lib/script';
	import { Input } from 'flowbite-svelte';

	const { close } = getContext('simple-modal');

	export let taskTitle = undefined;
	export let taskDescription = undefined;
	export let date = undefined;
	export let id = undefined;
	let showingDescription = false;
	let showingTime = false;
	let showingRepeats = false;

	export async function saveTask() {
		let correctDate = undefined;
		console.log('date ', date);
		if (date != undefined) {
			correctDate = setupDateTimeForPocketbase(date);
		} else {
			correctDate = '';
		}
		try {
			const data = {
				title: taskTitle,
				description: taskDescription,
				done: false,
				duetime: correctDate,
				is_routine: false,
				user: $currentUser.id
			};
			console.log(data);
			const record = await pb.collection('tasks').update(id, data);
			close();
		} catch (err) {
			console.log(err);
		}
	}

	onMount(() => {
		if (date) {
			date = readableDateTime(date);
			showTime();
		} else {
			date = 'Date not selected';
		}
		if (taskDescription) {
			showDescription();
		}
		document.getElementById('taskTitle').focus();
	});

	function showDescription() {
		document.getElementById('btnAddDescription').blur();
		if (showingDescription) {
			showingDescription = false;
			document.getElementById('taskDescription').style.height = '0';
			document.getElementById('taskDescription').blur();
		} else {
			showingDescription = true;
			document.getElementById('taskDescription').style.height = '3rem';
			document.getElementById('taskDescription').focus();
		}
	}

	function showTime() {
		document.getElementById('btnAddTime').blur();
		if (showingTime) {
			showingTime = false;
			document.getElementById('taskTime').style.height = '0';
		} else {
			showingTime = true;
			document.getElementById('taskTime').style.height = '3rem';
		}
	}

	function showRepeats() {
		document.getElementById('btnAddRepeats').blur();
		if (showingRepeats) {
			showingRepeats = false;
			document.getElementById('wrapperAddRepeats').style.height = '0';
		} else {
			showingRepeats = true;
			document.getElementById('wrapperAddRepeats').style.height = '3rem';
		}
	}

	async function deleteTask() {
		var sure = window.confirm('Are you sure?');
		if (sure) {
			console.log('delete');
			await pb.collection('tasks').delete(id);
		}
		close();
	}
</script>

<div class="wrapperModal">
	<Input
		type="text"
		id="taskTitle"
		placeholder="New task"
		bind:value={taskTitle}
		autocomplete="off"
		autofocus
	/>
	<Input
		type="text"
		id="taskDescription"
		bind:value={taskDescription}
		placeholder="Description for the task"
		autocomplete="off"
	/>
	<SveltyPicker
		inputId="taskTime"
		inputClasses="form-control"
		format="dd/mm/yyyy hh:ii"
		bind:value={date}
	/>
	<div id="wrapperAddRepeats" />
	<div id="wrapperEditButtons">
		<button
			id="btnAddDescription"
			class="btnIcon"
			on:click={showDescription}
			use:tooltip={{
				content: 'Add a description',
				placement: 'top-start',
				delay: [300, 0],
				offset: 15,
				target: '#btnAddDescription'
			}}><div class="icon"><FaAlignLeft /></div></button
		>
		<button
			id="btnAddTime"
			class="btnIcon"
			use:tooltip={{
				content: 'Add a schedule',
				placement: 'top-start',
				delay: [300, 0],
				offset: 15,
				target: '#btnAddTime'
			}}
			on:click={showTime}><div class="icon"><TiTime /></div></button
		>
		<button
			id="btnAddRepeats"
			class="btnIcon"
			use:tooltip={{
				content: 'Add repeation',
				placement: 'top-start',
				delay: [300, 0],
				offset: 15,
				target: '#btnAddRepeats'
			}}
			on:click={showRepeats}><div class="icon"><TiArrowRepeat /></div></button
		>
	</div>
	<div class="wrapperFinalButton">
		<button on:click={saveTask} id="btnSave">Update</button>
		<button on:click={deleteTask} id="btnCancella">Delete</button>
	</div>
</div>

<style>
	.btnIcon {
		width: 3rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		padding-left: 0.8rem;
		padding-right: 0.8rem;
	}

	.wrapperModal {
		gap: 0.2rem;
	}

	#wrapperEditButtons {
		display: flex;
		gap: 2rem;
	}

	#wrapperAddRepeats {
		height: 0;
		line-height: 0;
		padding-top: 0;
		padding-bottom: 0;
		margin: 0;
		transition: height 0.25s ease;
	}

	.icon {
		width: 100%;
	}

	#btnSave {
		width: min-content;
	}

	.wrapperFinalButton {
		display: flex;
		gap: 1rem;
	}
</style>
