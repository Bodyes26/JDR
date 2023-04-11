<script>
	import { onMount } from 'svelte';
	import Header from './header.svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import Journal from './journal.svelte';
	import Tasks from './tasks.svelte';
	import Modal, { bind } from 'svelte-simple-modal';
	import ModalNewJournal from './modalNewJournal.svelte';
	import ModalNewTask from './modalNewTask.svelte';
	import ModalModifyTask from './modalModifyTask.svelte';
	import { writable } from 'svelte/store';
	import CloseButton from './closeButton.svelte';

	onMount(() => {
		if (!$currentUser) {
			goto('/login');
		}
	});
	const modal = writable(null);
	const showJournalModal = () => modal.set(ModalNewJournal);
	const showTaskModal = () => modal.set(ModalNewTask);
	const showModifyTaskModal = (event) =>
		modal.set(
			bind(ModalModifyTask, {
				id: event.detail.id,
				taskTitle: event.detail.title,
				date: event.detail.time,
				taskDescription: event.detail.description
			})
		);
</script>

<Modal
	show={$modal}
	styleWindow={{ backgroundColor: 'transparent', padding: '0' }}
	closeButton={CloseButton}
>
	<Header />
	<div class="wrapper">
		<div class="wrapperTask">
			<h3>Tasks</h3>
			<button on:click={showTaskModal}>+ new Task</button>
			<div class="tasks">
				<Tasks on:modifyTask={showModifyTaskModal} />
			</div>
		</div>
		<div class="wrapperJournal">
			<h3>Journal</h3>
			<button on:click={showJournalModal}>+ new Journal</button>
			<Journal />
		</div>
	</div>
</Modal>

<style>
	.wrapper {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: calc(100% - 4rem);
		margin-left: 4rem;
		margin-right: 4rem;
		gap: 1rem;
		margin-top: 4rem;
	}

	.wrapperTask {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: flex-start;
		height: calc(100vh - 7rem);
		width: 49%;
		border-right: 2px solid rgba(0, 0, 0, 0.2);
	}

	.wrapperJournal {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: flex-start;
		height: calc(100vh - 7rem);
		width: 49%;
	}

	.wrapperJournal > button {
		margin-bottom: 1rem;
	}

	.tasks {
		overflow: auto;
		width: 100%;
	}
</style>
