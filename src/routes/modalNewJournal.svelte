<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import Emotions from './emotionsNewJournal.svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { Input, Textarea, Button } from 'flowbite-svelte';
	const dispatch = createEventDispatcher();

	export let positive = undefined;
	export let vote = undefined;
	export let description = undefined;
	let emotionsSelected = [];
	let step = 0;
	export async function saveJournal() {
		console.log('emotions selected', emotionsSelected);
		try {
			const data = {
				title: positive,
				description: description,
				emotion: emotionsSelected,
				vote: vote,
				user: $currentUser.id
			};
			await pb.collection('journals').create(data);
			dispatch('createdJournal', {});
		} catch (err) {
			console.log(err);
		}
	}

	function checkPositive() {
		emptyPositive();
		if (positive) {
			document.getElementById('positive').blur();
			step++;
		}
	}

	function checkVote() {
		emptyVote();
		if (vote && vote > 0 && vote < 11) {
			step++;
			document.getElementById('modalNew').focus();
		}
	}

	function emptyPositive() {
		if (positive) {
			document.getElementById('positive').classList.remove('inputError');
		} else {
			document.getElementById('positive').classList.add('inputError');
		}
	}

	function emptyVote() {
		if (vote && vote > 0 && vote < 11) {
			document.getElementById('vote').classList.remove('inputError');
		} else {
			document.getElementById('vote').classList.add('inputError');
		}
	}

	onMount(() => {
		document.getElementById('modalNew').addEventListener('keydown', function (e) {
			if (e.keyCode === 13 && step != 3) {
				if (e.repeat) return;
				console.log('keydown');
				e.preventDefault();
				if (step == 0) {
					checkPositive();
				} else if (step == 1) {
					checkVote();
				} else if (step == 2) {
					step++;
				}
				console.log('step', step);
			}
			if (e.keyCode === 13 && e.shiftKey && step === 3) {
				saveJournal();
			}
		});
		document.getElementById('positive').focus();
	});
</script>

<div class="h-full flex flex-col gap-8 items-center p-8 outline-none" tabindex="-1" id="modalNew">
	{#if step == 0}
		<h1 class="m-0 text-5xl text-blueGray-800 dark:text-white dark:opacity-90">
			Write a positive thing of today.
		</h1>
		<Input
			type="text"
			name="positive"
			id="positive"
			placeholder="Anything!"
			bind:value={positive}
			on:change={emptyPositive}
			autocomplete="off"
			autofocus
		/>
		<Button on:click={checkPositive} class="flex items-center gap-2"
			>Next <svg
				width="16px"
				height="16px"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M3 14a1 1 0 0 1 1-1h12a3 3 0 0 0 3-3V6a1 1 0 1 1 2 0v4a5 5 0 0 1-5 5H4a1 1 0 0 1-1-1z"
					fill="#0D0D0D"
					class="dark:fill-white"
				/><path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M3.293 14.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 1.414L5.414 14l3.293 3.293a1 1 0 1 1-1.414 1.414l-4-4z"
					fill="#0D0D0D"
					class="dark:fill-white"
				/></svg
			></Button
		>
	{:else if step == 1}
		<h1 class="m-0 text-5xl text-blueGray-800 dark:text-white dark:opacity-90">
			What vote would you assigne for today?
		</h1>
		<Input
			type="number"
			name="vote"
			id="vote"
			bind:value={vote}
			on:change={emptyVote}
			placeholder="1 ... 10"
			autocomplete="off"
			autofocus
		/>
		<div class="flex gap-2">
			<Button color="alternative" on:click={() => step--}>Back</Button>
			<Button on:click={checkVote} class="flex items-center gap-2"
				>Next <svg
					width="16px"
					height="16px"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M3 14a1 1 0 0 1 1-1h12a3 3 0 0 0 3-3V6a1 1 0 1 1 2 0v4a5 5 0 0 1-5 5H4a1 1 0 0 1-1-1z"
						fill="#0D0D0D"
						class="dark:fill-white"
					/><path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M3.293 14.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 1.414L5.414 14l3.293 3.293a1 1 0 1 1-1.414 1.414l-4-4z"
						fill="#0D0D0D"
						class="dark:fill-white"
					/></svg
				></Button
			>
		</div>
	{:else if step == 2}
		<h1 class="m-0 text-5xl text-blueGray-800 dark:text-white dark:opacity-90">
			Select the emotions that you felt today.
		</h1>
		<Emotions bind:selected={emotionsSelected} />
		<div class="flex gap-2">
			<Button color="alternative" on:click={() => step--}>Back</Button>
			<Button on:click={() => step++} class="flex items-center gap-2"
				>Next <svg
					width="16px"
					height="16px"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M3 14a1 1 0 0 1 1-1h12a3 3 0 0 0 3-3V6a1 1 0 1 1 2 0v4a5 5 0 0 1-5 5H4a1 1 0 0 1-1-1z"
						fill="#0D0D0D"
						class="dark:fill-white"
					/><path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M3.293 14.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 1.414L5.414 14l3.293 3.293a1 1 0 1 1-1.414 1.414l-4-4z"
						fill="#0D0D0D"
						class="dark:fill-white"
					/></svg
				></Button
			>
		</div>
	{:else if step == 3}
		<h1 class="m-0 text-5xl text-blueGray-800 dark:text-white dark:opacity-90">
			Write a description for the day.
		</h1>
		<Textarea
			name="description"
			id="description"
			rows="5"
			placeholder="this is your personal space."
			bind:value={description}
			autocomplete="off"
		/>
		<div class="flex gap-2">
			<Button color="alternative" on:click={() => step--}>Back</Button>
			<Button on:click={saveJournal} class="flex items-center gap-2"
				>Save
				<svg
					width="16px"
					height="16px"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M8 17V12H5.6302C4.71068 12 4.27858 10.8635 4.96584 10.2526L10.6713 5.18109C11.429 4.50752 12.571 4.50752 13.3287 5.18109L19.0342 10.2526C19.7214 10.8635 19.2893 12 18.3698 12H16V17C16 18.1046 15.1046 19 14 19H10C8.89543 19 8 18.1046 8 17Z"
						stroke="#0D0D0D"
						class="dark:stroke-white"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<svg
					width="16px"
					height="16px"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M3 14a1 1 0 0 1 1-1h12a3 3 0 0 0 3-3V6a1 1 0 1 1 2 0v4a5 5 0 0 1-5 5H4a1 1 0 0 1-1-1z"
						fill="#0D0D0D"
						class="dark:fill-white"
					/><path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M3.293 14.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 1.414L5.414 14l3.293 3.293a1 1 0 1 1-1.414 1.414l-4-4z"
						fill="#0D0D0D"
						class="dark:fill-white"
					/></svg
				></Button
			>
		</div>
	{/if}
</div>
