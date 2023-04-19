<script>
	import { currentUser, pb } from '$lib/pocketbase';
	import { createEventDispatcher, onMount } from 'svelte';
	export let title;
	export let id;
	export let dateTime = undefined;
	export let description = undefined;
	let time;
	let appointmentDate = new Date();
	let isNotified = false;
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
			const task = { title: title, description: description, time: dateTime };
			appointmentDate = new Date(dateTime).getTime();
			// Schedule notification if appointment is within 24 hours
			const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in one day
			const timeDiff = appointmentDate - Date.now() - 7200000;
			console.log(timeDiff);
			if (timeDiff > 0 && timeDiff < oneDay) {
				registerNotification(timeDiff);
			}
		}
	});

	function registerNotification(timeDiff) {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.getRegistration().then(function (registration) {
				registration.showNotification(title, {
					body: description,
					vibrate: [200, 100, 200],
					time: timeDiff
				});
				registration.pushManager();
				isNotified = true;
			});
		}
	}

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

<div class="flex flex-col mb-2">
	<div class="flex">
		<div
			{id}
			class="mt-1 h-5 w-5 flex justify-center items-center rounded-md mr-2 transition-colors ease-in duration-200 border-solid border-2 hover:cursor-pointer border-black border-opacity-20 dark:border-white dark:border-opacity-20"
			on:click={checkTask}
			on:keydown={checkTask}
		>
			<svg
				width="18px"
				height="18px"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g id="Interface / Check">
					<path
						id="Vector"
						d="M6 12L10.2426 16.2426L18.727 7.75732"
						stroke="#FFFFFF"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="dark:stroke-neutral-950"
					/>
				</g>
			</svg>
		</div>
		{#if time}
			<p class="text-xs opacity-80 m-0 mr-2 mt-1 relative w-9 font-mono dark:text-white">{time}</p>
		{/if}
		<p
			on:click={modifyTask}
			on:keydown={modifyTask}
			on:mouseenter={showEdit}
			on:mouseleave={hideEdit}
			class="hover:cursor-pointer w-4/5 max-w-fit dark:text-white"
		>
			{title}
		</p>
		<div
			class=" ml-2 opacity-0 w-6 h-6 transition-opacity duration-200 ease-in hover:opacity-100 hover:cursor-pointer"
			id="edit_{id}"
		>
			<svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<title />

				<g id="Complete">
					<g id="edit">
						<g>
							<path
								d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8"
								fill="none"
								stroke="#000000"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
							/>

							<polygon
								fill="none"
								points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8"
								stroke="#000000"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
							/>
						</g>
					</g>
				</g>
			</svg>
		</div>
		<div class="selected" style="display: hidden;" />
	</div>
	{#if description}
		{#if time}
			<div class="ml-16 pl-2">
				<p class="text-xs w-4/5 max-w-fit dark:text-white dark:opacity-80">{description}</p>
			</div>
		{:else}
			<div class="ml-8">
				<p class="text-xs w-4/5 max-w-fit dark:text-white dark:opacity-80">{description}</p>
			</div>
		{/if}
	{/if}
</div>

<style>
	.selected {
		background-color: #4eaceb;
	}
</style>
