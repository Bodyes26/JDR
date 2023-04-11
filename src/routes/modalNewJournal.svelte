<script>
	import { getContext, onMount } from 'svelte';
	import Emotions from './emotionsNewJournal.svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	export let positive = undefined;
	export let vote = undefined;
	export let description = undefined;
	let emotionsSelected = [];
	let step = 0;
	const { open, close } = getContext('simple-modal');
	export async function saveJournal() {
		console.log('emotions selected', emotionsSelected);
		try {
			const data = {
				title: positive,
				description: description,
				emotions: '123',
				emotion: emotionsSelected,
				vote: vote,
				user: $currentUser.id
			};
			await pb.collection('journals').create(data);
			close();
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

	function init(el) {
		el.focus();
	}
</script>

<div class="wrapperModal" tabindex="-1" id="modalNew">
	{#if step == 0}
		<h1 class="pageTitle">Write a positive thing of today.</h1>
		<input
			type="text"
			name="positive"
			id="positive"
			placeholder="Anything!"
			bind:value={positive}
			on:change={emptyPositive}
			autocomplete="off"
		/>
		<button on:click={checkPositive}
			>Next <img src="../assets/enter.png" alt="enter icon" class="icon" /></button
		>
	{:else if step == 1}
		<h1 class="pageTitle">What vote would you assigne for today?</h1>
		<input
			type="number"
			name="vote"
			id="vote"
			bind:value={vote}
			on:change={emptyVote}
			placeholder="1 ... 10"
			autocomplete="off"
			use:init
		/>
		<div>
			<button on:click={() => step--}>Back</button>
			<button on:click={checkVote}
				>Next <img src="../assets/enter.png" alt="enter icon" class="icon" /></button
			>
		</div>
	{:else if step == 2}
		<h1 class="pageTitle">Select the emotions that you felt today.</h1>
		<Emotions bind:selected={emotionsSelected} />
		<div>
			<button on:click={() => step--}>Back</button>
			<button on:click={() => step++}
				>Next <img src="%sveltekit.assets%/enter.png" alt="enter icon" class="icon" /></button
			>
		</div>
	{:else if step == 3}
		<h1 class="pageTitle">Write a description for the day.</h1>
		<textarea
			name="description"
			id="description"
			cols="30"
			rows="8"
			placeholder="this is your personal space."
			bind:value={description}
			autocomplete="off"
		/>
		<div>
			<button on:click={() => step--}>Back</button>
			<button on:click={saveJournal} id="btnSave"
				>Save
				<img src="%sveltekit.assets%/shift.png" alt="shift icon" class="icon shift" /><img
					src="%sveltekit.assets%/enter.png"
					alt="enter icon"
					class="icon"
				/></button
			>
		</div>
	{/if}
</div>

<style>
	.pageTitle {
		margin: 0;
	}
	.wrapperModal {
		outline: none;
	}

	.icon {
		height: 1rem;
		transform: translateY(20%);
	}

	.shift {
		height: 0.8rem;
		transform: translateY(0);
	}

	#btnSave {
		padding-right: 1rem;
	}
</style>
