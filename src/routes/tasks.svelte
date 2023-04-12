<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import Task from './task.svelte';
	import { dateForPocketbase } from '$lib/script';
	let todayTasks = [];
	let tomorrowTasks = [];
	let tasksNoDate = [];

	const dispatch = createEventDispatcher();

	onMount(async () => {
		loadToday();
		loadTomorrow();
		loadNoDate();
		dateForPocketbase('today');
		pb.collection('tasks').subscribe('*', async ({ action, record }) => {
			const today = new Date();
			const tomorrow = new Date();
			const dayAftertomorrow = new Date();
			tomorrow.setDate(today.getDate() + 1);
			dayAftertomorrow.setDate(tomorrow.getDate() + 1);
			if (action === 'create') {
				if (record.duetime < tomorrow && record.duetime > today) {
					todayTasks = [...todayTasks, record];
				} else if (record.duetime >= tomorrow && record.duetime < dayAftertomorrow) {
					tomorrowTasks = [...tomorrowTasks, record];
				} else if (record.duetime == '') {
					tasksNoDate = [...tasksNoDate, record];
				}
			}
			if (action === 'delete') {
				tasksNoDate = tasksNoDate.filter((m) => m.id !== record.id);
			}
		});
	});

	async function loadToday() {
		const day1 = dateForPocketbase('today');
		const day2 = dateForPocketbase('tomorrow');
		const filter = " done = false && duetime > '" + day1 + "' && duetime < '" + day2 + "'";
		const resultList = await pb.collection('tasks').getList(1, 50, {
			filter: filter
		});
		todayTasks = resultList.items;
	}

	async function loadTomorrow() {
		const day1 = dateForPocketbase('tomorrow');
		const day2 = dateForPocketbase('afterTomorrow');
		const filter = " done = false && duetime > '" + day1 + "' && duetime < '" + day2 + "'";
		const resultList = await pb.collection('tasks').getList(1, 50, {
			filter: filter
		});
		tomorrowTasks = resultList.items;
	}

	async function loadNoDate() {
		const filter = 'done = false && duetime = null';
		const resultList = await pb.collection('tasks').getList(1, 50, {
			filter: filter,
			sort: '-created'
		});
		tasksNoDate = resultList.items;
	}

	/**
	 * @param {{ detail: { id: any; }; }} event
	 */
	function updateTodayList(event) {
		setTimeout(() => {
			let temp = todayTasks.filter((m) => m.id !== event.detail.id);
			todayTasks = temp;
			removeChecked();
		}, 1000);
	}

	/**
	 * @param {{ detail: { id: any; }; }} event
	 */
	function updateTomorrowList(event) {
		setTimeout(() => {
			let temp = tomorrowTasks.filter((m) => m.id !== event.detail.id);
			todayTasks = temp;
			removeChecked();
		}, 1000);
	}

	/**
	 * @param {{ detail: { id: any; }; }} event
	 */
	function updateNoDateList(event) {
		setTimeout(() => {
			let temp = tasksNoDate.filter((m) => m.id !== event.detail.id);
			tasksNoDate = temp;
			removeChecked();
		}, 1000);
	}

	function removeChecked() {
		document.querySelectorAll('.checkbox').forEach((button) => {
			console.log('button ', button);
			button.classList.remove('selected');
		});
	}

	function modifyTask(event) {
		dispatch('modifyTask', {
			id: event.detail.id,
			title: event.detail.title,
			time: event.detail.time,
			description: event.detail.description
		});
	}
</script>

<div class="tasks">
	<div id="wrapperToday">
		{#if todayTasks.length > 0}
			<h3>Today</h3>
			{#each todayTasks as task}
				<Task
					title={task.title}
					id={task.id}
					dateTime={task.duetime}
					description={task.description}
					on:checkedTask={updateTodayList}
					on:modifyTask={modifyTask}
				/>
			{/each}
		{/if}
	</div>
	<div id="wrapperTomorrow">
		{#if tomorrowTasks.length > 0}
			<h3>Tomorrow</h3>
			{#each tomorrowTasks as task}
				<Task
					title={task.title}
					id={task.id}
					dateTime={task.duetime}
					description={task.description}
					on:checkedTask={updateTomorrowList}
					on:modifyTask={modifyTask}
				/>
			{/each}
		{/if}
	</div>
	<div id="wrapperNoDates">
		{#if tasksNoDate.length > 0}
			<h3>Anytime</h3>
			{#each tasksNoDate as task}
				<Task
					title={task.title}
					id={task.id}
					dateTime={task.duetime}
					description={task.description}
					on:checkedTask={updateNoDateList}
					on:modifyTask={modifyTask}
				/>
			{/each}
		{/if}
	</div>
</div>

<style>
	.tasks {
		gap: 0.8rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
	}
</style>
