<script>
	import { currentUser, pb } from '$lib/pocketbase';
	import { createEventDispatcher, onMount } from 'svelte';
	import SveltyPicker from 'svelty-picker';
	import { readableDateTime, setupDateTimeForPocketbase } from '$lib/script';
	import { Input, Tooltip, Button } from 'flowbite-svelte';
	const dispatch = createEventDispatcher();

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
			dispatch('updatedTask', {});
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
			document.getElementById('taskTime').style.height = '0';
			document.getElementById('taskTime').blur();
		}

		if (taskDescription) {
			showDescription();
		} else {
			document.getElementById('taskDescription').style.height = '0';
			document.getElementById('taskDescription').blur();
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
			document.getElementById('taskDescription').style.height = 'auto';
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
			document.getElementById('taskTime').style.height = 'auto';
		}
	}

	function showRepeats() {
		document.getElementById('btnAddRepeats').blur();
		if (showingRepeats) {
			showingRepeats = false;
			document.getElementById('wrapperAddRepeats').style.height = '0';
		} else {
			showingRepeats = true;
			document.getElementById('wrapperAddRepeats').style.height = 'auto';
		}
	}

	async function deleteTask() {
		var sure = window.confirm('Are you sure?');
		if (sure) {
			console.log('delete');
			await pb.collection('tasks').delete(id);
		}
	}
</script>

<div class="h-full flex flex-col gap-2 items-center p-8 outline-none pb-0">
	<Input
		type="text"
		id="taskTitle"
		placeholder="New task"
		bind:value={taskTitle}
		autocomplete="off"
		autofocus
	/>
	<div id="taskDescription" class="w-full overflow-hidden transition-height duration-200 ease-in">
		<Input
			type="text"
			bind:value={taskDescription}
			placeholder="Description for the task"
			autocomplete="off"
		/>
	</div>
	<div id="taskTime" class="w-full overflow-hidden transition-height duration-200 ease-in">
		<SveltyPicker inputClasses="form-control" format="dd/mm/yyyy hh:ii" bind:value={date} />
	</div>

	<div
		id="wrapperAddRepeats"
		class="w-full overflow-hidden transition-height duration-200 ease-in"
	/>

	<div class="flex gap-8">
		<Button color="alternative" class="!p-2" id="btnAddDescription" on:click={showDescription}>
			<svg
				width="24px"
				height="24px"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g id="Edit / Text_Align_Left">
					<path
						id="Vector"
						d="M4 18H14M4 14H20M4 10H14M4 6H20"
						stroke="#000000"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</g>
			</svg>
		</Button>
		<Tooltip>Add a description</Tooltip>
		<Button color="alternative" class="!p-2" id="btnAddTime" on:click={showTime}>
			<svg
				width="24px"
				height="24px"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M12 8V12L15 15" stroke="#000000" stroke-width="2" stroke-linecap="round" />
				<circle cx="12" cy="12" r="9" stroke="#000000" stroke-width="2" />
			</svg>
		</Button>
		<Tooltip>Add a schedule</Tooltip>
		<Button color="alternative" class="!p-2" id="btnAddRepeats" on:click={showRepeats}>
			<svg width="24px" height="24px" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
				<g fill-rule="evenodd">
					<path
						d="M109.533 197.602a1.887 1.887 0 0 1-.034 2.76l-7.583 7.066a4.095 4.095 0 0 1-5.714-.152l-32.918-34.095c-1.537-1.592-1.54-4.162-.002-5.746l33.1-34.092c1.536-1.581 4.11-1.658 5.74-.18l7.655 6.94c.82.743.833 1.952.02 2.708l-21.11 19.659s53.036.129 71.708.064c18.672-.064 33.437-16.973 33.437-34.7 0-7.214-5.578-17.64-5.578-17.64-.498-.99-.273-2.444.483-3.229l8.61-8.94c.764-.794 1.772-.632 2.242.364 0 0 9.212 18.651 9.212 28.562 0 28.035-21.765 50.882-48.533 50.882-26.769 0-70.921.201-70.921.201l20.186 19.568z"
					/>
					<path
						d="M144.398 58.435a1.887 1.887 0 0 1 .034-2.76l7.583-7.066a4.095 4.095 0 0 1 5.714.152l32.918 34.095c1.537 1.592 1.54 4.162.002 5.746l-33.1 34.092c-1.536 1.581-4.11 1.658-5.74.18l-7.656-6.94c-.819-.743-.832-1.952-.02-2.708l21.111-19.659s-53.036-.129-71.708-.064c-18.672.064-33.437 16.973-33.437 34.7 0 7.214 5.578 17.64 5.578 17.64.498.99.273 2.444-.483 3.229l-8.61 8.94c-.764.794-1.772.632-2.242-.364 0 0-9.212-18.65-9.212-28.562 0-28.035 21.765-50.882 48.533-50.882 26.769 0 70.921-.201 70.921-.201l-20.186-19.568z"
					/>
				</g>
			</svg>
		</Button>
		<Tooltip>Add repeation</Tooltip>
	</div>
	<div class="flex gap-4">
		<Button on:click={saveTask} id="btnSave">Update</Button>
		<Button color="red" outline={true} on:click={deleteTask} id="btnCancella">Delete</Button>
	</div>
</div>
