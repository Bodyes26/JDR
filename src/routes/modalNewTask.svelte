<script>
	import { currentUser, pb } from '$lib/pocketbase';
	import { createEventDispatcher, onMount } from 'svelte';
	import SveltyPicker from 'svelty-picker';
	import { todayReadableFullDate, setupDateTimeForPocketbase } from '$lib/script';
	import { Input, Button, Tooltip } from 'flowbite-svelte';

	export let taskTitle = undefined;
	export let taskDescription = undefined;
	const dispatch = createEventDispatcher();
	let showingDescription = false;
	let showingTime = false;
	let showingRepeats = false;
	let date = undefined;

	export async function saveTask() {
		let correctDate = undefined;
		if (date != undefined) {
			correctDate = setupDateTimeForPocketbase(date);
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
			const record = await pb.collection('tasks').create(data);
			dispatch('createdTask', {
				date: correctDate
			});
		} catch (err) {
			console.log(err);
		}
	}

	onMount(() => {
		document.getElementById('taskTitle').focus();
		document.getElementById('taskDescription').style.height = '0';
		document.getElementById('taskDescription').blur();
		document.getElementById('modalNew').addEventListener('keydown', function (e) {
			if (e.keyCode === 13) {
				if (e.repeat) return;
				console.log('keydown');
				e.preventDefault();
				saveTask();
			}
		});
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
			document.getElementById('taskTime').blur();
			date = undefined;
		} else {
			showingTime = true;
			document.getElementById('taskTime').style.height = '3rem';
			setTimeout(() => {
				document.getElementById('taskTime').focus();
			}, 200);

			date = todayReadableFullDate();
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
</script>

<div class="h-full flex flex-col gap-2 items-center p-8 outline-none pb-0" id="modalNew">
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
			placeholder="Task description"
			autocomplete="off"
		/>
	</div>
	<div id="taskTime" class="h-0 py-0 w-full overflow-hidden transition-height duration-200 ease-in">
		{#if document.documentElement.classList.contains('dark')}
			<SveltyPicker
				format="dd/mm/yyyy hh:ii"
				bind:value={date}
				theme="picker-dark"
				inputClasses="dark:bg-gray-600 rounded-lg dark:text-white"
			/>
		{:else}
			<SveltyPicker
				format="dd/mm/yyyy hh:ii"
				bind:value={date}
				theme="picker-light"
				inputClasses="dark:bg-gray-600 rounded-lg dark:text-white"
			/>
		{/if}
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
						class="dark:stroke-white"
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
				<path
					d="M12 8V12L15 15"
					stroke="#000000"
					class="dark:stroke-white"
					stroke-width="2"
					stroke-linecap="round"
				/>
				<circle cx="12" cy="12" r="9" stroke="#000000" class="dark:stroke-white" stroke-width="2" />
			</svg>
		</Button>
		<Tooltip>Add a schedule</Tooltip>
		<Button color="alternative" class="!p-2" id="btnAddRepeats" on:click={showRepeats}>
			<svg width="24px" height="24px" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
				<g fill-rule="evenodd" class="dark:fill-white">
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

	<Button on:click={saveTask} id="btnSave"
		>Save <svg
			width="16px"
			height="16px"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			><path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M3 14a1 1 0 0 1 1-1h12a3 3 0 0 0 3-3V6a1 1 0 1 1 2 0v4a5 5 0 0 1-5 5H4a1 1 0 0 1-1-1z"
				fill="#FFF"
			/><path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M3.293 14.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 1.414L5.414 14l3.293 3.293a1 1 0 1 1-1.414 1.414l-4-4z"
				fill="#FFF"
			/></svg
		></Button
	>
</div>

<style>
	:global(.picker-dark) {
		--sdt-primary: #2c55d3;
		--sdt-color: #eee;
		--sdt-color-selected: #eee;
		--sdt-bg-main: #333;
		--sdt-bg-today: var(--sdt-primary);
		--sdt-bg-clear: #dc3545;
		--sdt-today-bg: #2c55d3;
		--sdt-today-color: var(--sdt-color-selected);
		--sdt-clear-color: #dc3545;
		--sdt-btn-bg-hover: #555;
		--sdt-btn-header-bg-hover: #555;
		--sdt-clock-bg: #7b7b7b;
		--sdt-shadow: #999;
		--sdt-disabled-date: #b22222;
	}

	:global(.picker-light) {
		--sdt-primary: #2c55d3;
		--sdt-color: #111;
		--sdt-color-selected: #fff;
		--sdt-bg-main: #fff;
		--sdt-bg-today: var(--sdt-primary);
		--sdt-bg-clear: #dc3545;
		--sdt-today-bg: #2c55d3;
		--sdt-today-color: var(--sdt-color-selected);
		--sdt-clear-color: #dc3545;
		--sdt-btn-bg-hover: #eee;
		--sdt-btn-header-bg-hover: #eee;
		--sdt-clock-bg: #eee;
		--sdt-shadow: #555;
		--sdt-disabled-date: #b22222;
	}
</style>
