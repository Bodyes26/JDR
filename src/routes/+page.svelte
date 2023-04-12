<script>
	import { onMount } from 'svelte';
	import Header from './header.svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import Journal from './journal.svelte';
	import Tasks from './tasks.svelte';
	import ModalNewJournal from './modalNewJournal.svelte';
	import ModalNewTask from './modalNewTask.svelte';
	import ModalModifyTask from './modalModifyTask.svelte';
	import { Button, Modal, Label, Navbar, NavBrand, NavUl, NavHamburger } from 'flowbite-svelte';

	onMount(() => {
		if (!$currentUser) {
			goto('/login');
		}
	});

	let showJournalModal = false;
	let showTaskModal = false;
	let showModalModifyTask = false;
	let modifyTaskId;
	let modifyTaskTitle;
	let modifyTaskDate;
	let modifyTaskDesc;
	const showModifyTaskModal = (event) => {
		showModalModifyTask = true;
		modifyTaskId = event.detail.id;
		modifyTaskTitle = event.detail.title;
		modifyTaskDate = event.detail.time;
		modifyTaskDesc = event.detail.description;
	};
</script>

<div class="w-full">
	<Header />
	<div class="flex gap-4 mt-4 mx-8 flex-wrap">
		<div class="wrapperTask">
			<h3>Tasks</h3>
			<Button on:click={() => (showTaskModal = true)}>+ new Task</Button>
			<div class="tasks">
				<Tasks on:modifyTask={showModifyTaskModal} />
			</div>
		</div>
		<div class="wrapperJournal">
			<h3>Journal</h3>
			<Button on:click={() => (showJournalModal = true)}>+ new Journal</Button>
			<Journal />
		</div>
	</div>
</div>

<Modal title="New Task" bind:open={showTaskModal} autoclose={false} class="w-full">
	<ModalNewTask />
</Modal>
<Modal bind:open={showJournalModal} autoclose={false} class="w-full">
	<ModalNewJournal />
</Modal>
<Modal title="Modify Task" bind:open={showModalModifyTask} autoclose={false} class="w-full">
	<ModalModifyTask
		taskTitle={modifyTaskTitle}
		taskDescription={modifyTaskDesc}
		date={modifyTaskDate}
		id={modifyTaskId}
	/>
</Modal>

<style>
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

	.tasks {
		overflow: auto;
		width: 100%;
	}
</style>
