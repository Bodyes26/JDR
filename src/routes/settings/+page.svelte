<script>
	import { Modal } from 'svelte-simple-modal';
	import { writable } from 'svelte/store';
	import ModalManageEmotions from '../modalManageEmotions.svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import CloseButton from '../closeButton.svelte';
	import { goto } from '$app/navigation';
	let name = $currentUser.name;
	let newName = undefined;
	let email = $currentUser.email;
	let newEmail = undefined;
	let password = undefined;
	let confirmPassword = undefined;
	let currentPassword = undefined;
	export let popup = writable();
	function signOut() {
		pb.authStore.clear();
		open('/login', '_self');
	}
	async function update() {
		try {
			if (newName == undefined) {
				newName = name;
			}
			if (newEmail == undefined) {
				newEmail = email;
			}
			if (password == undefined) {
				password = currentPassword;
				confirmPassword = currentPassword;
			}
			const data = {
				name: newName,
				email: newEmail,
				password: password,
				passwordConfirm: confirmPassword,
				oldPassword: currentPassword
			};
			const record = await pb.collection('users').update($currentUser.id, data);
		} catch (err) {
			console.log(err);
		}
	}
	const showEmotionsModal = () => popup.set(ModalManageEmotions);
</script>

<Modal
	show={$popup}
	styleWindow={{ backgroundColor: 'transparent', padding: '0' }}
	closeButton={CloseButton}
	><div id="header">
		<h1>JDR</h1>
		<button
			on:click={() => {
				goto('/');
			}}>Home</button
		>
	</div>
	<div class="wrapper">
		<h1 id="title">Settings</h1>
		<label for="name">Change name</label>
		<input
			type="text"
			id="name"
			name="name"
			placeholder={$currentUser.name}
			bind:value={newName}
			class="input"
		/>
		<label for="email">Change email</label>
		<input
			type="email"
			id="email"
			name="email"
			placeholder={$currentUser.email}
			bind:value={newEmail}
			class="input"
		/>
		<label for="password">Current password</label>
		<input
			type="password"
			id="currentPassword"
			name="currentPassword"
			class="input"
			placeholder="********"
			bind:value={currentPassword}
		/>
		<div class="wrapperPassword">
			<div class="columnPassword">
				<label for="password">New password</label>
				<input
					type="password"
					id="password"
					name="password"
					class="input"
					placeholder="********"
					bind:value={password}
				/>
			</div>
			<div class="columnPassword">
				<label for="confirmPassword">Confirm password</label>
				<input
					type="password"
					id="confirmPassword"
					bind:value={confirmPassword}
					name="confirmPassword"
					placeholder="********"
					class="input"
				/>
			</div>
		</div>
		<div>
			<button on:click={update} style="margin-bottom: 1rem;">Update data</button>
			<button on:click={showEmotionsModal} style="margin-bottom: 1rem;">Manage emotions</button>
		</div>
		<button on:click={signOut} id="btnSignOut">Sign Out</button>
	</div>
</Modal>

<style>
	label {
		margin: 0;
		font-weight: 600;
	}

	#btnSignOut {
		width: 100%;
		border-color: red;
	}

	.wrapper {
		gap: 0;
		align-items: flex-start;
		width: 100%;
		padding: 2rem;
		margin-top: 4rem;
	}
	.input {
		height: 3rem;
		border-radius: 6px;
		border: 0;
		width: calc(100% - 2rem);
		padding-left: 1rem;
		padding-right: 0.4rem;
		margin-bottom: 1rem;
	}

	.input::placeholder {
		font-size: 16px;
	}

	#title {
		margin: 0;
	}

	.wrapperPassword {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: 100%;
	}
	.columnPassword {
		display: flex;
		flex-direction: column;
		width: 50%;
	}
	#header {
		display: flex;
		justify-content: space-between;
		height: 4rem;
		padding-left: 2rem;
		padding-right: 2rem;
		width: calc(100% - 4rem);
		align-items: center;
		position: absolute;
	}
</style>
