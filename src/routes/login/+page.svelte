<script>
	import { currentUser, pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';

	import { onMount } from 'svelte';
	let mail;
	let password;
	let confirmPassword;
	let signup = false;
	let name;

	onMount(() => {
		if ($currentUser) {
			goto('/');
		}
	});

	async function login() {
		try {
			await pb.collection('users').authWithPassword(mail, password);
			if (signup) {
				loadEmotions();
			}
			goto('/');
		} catch (err) {
			alert('nome utente o password sbagliati.');
			console.log(err);
		}
	}

	function startSignUp() {
		signup = true;
	}

	async function signUp() {
		try {
			const data = {
				email: mail,
				emailVisibility: true,
				password: password,
				passwordConfirm: confirmPassword,
				name: name
			};
			const record = await pb.collection('users').create(data);
			await login();
		} catch (err) {
			console.log(err);
		}
	}

	function clear() {
		signup = false;
		mail = '';
		password = '';
		confirmPassword = '';
		name = '';
	}

	function loadEmotions() {
		const defaultEmotions = [
			{
				text: 'Thankful',
				value: 0,
				user: $currentUser.id
			},
			{
				text: 'Relaxed',
				value: 0,
				user: $currentUser.id
			},
			{
				text: 'Excited',
				value: 0,
				user: $currentUser.id
			},
			{
				text: 'Mah',
				value: 1,
				user: $currentUser.id
			},
			{
				text: 'Sad',
				value: 2,
				user: $currentUser.id
			},
			{
				text: 'Depressed',
				value: 2,
				user: $currentUser.id
			},
			{
				text: 'Good',
				value: 0,
				user: $currentUser.id
			}
		];
		defaultEmotions.forEach(async (emotion) => {
			try {
				console.log(emotion);
				const record = await pb.collection('emotions').create(emotion);
			} catch (err) {
				console.log(err);
			}
		});
	}
</script>

<h1>Journaling done right</h1>
<div class="wrapperLogin">
	<form class="formLogin" on:submit|preventDefault id="formSign">
		{#if signup}
			<input type="text" name="name" id="name" placeholder="Name" bind:value={name} class="input" />
		{/if}
		<input
			type="email"
			name="email"
			id="email"
			placeholder="Email"
			bind:value={mail}
			class="input"
		/>
		{#if signup}
			<div class="wrapperPasswords">
				<input
					type="password"
					name="password"
					id="password"
					placeholder="Password"
					bind:value={password}
					class="input"
				/>
				<input
					type="password"
					name="confirmPassword"
					id="confirmPassword"
					placeholder="confirm password"
					bind:value={confirmPassword}
					class="input"
				/>
			</div>
		{:else}
			<input
				type="password"
				name="password"
				id="password"
				placeholder="Password"
				bind:value={password}
				class="input"
			/>
		{/if}
		<hr />
		<div class="buttons">
			{#if signup}
				<button type="reset" on:click={clear}>Clear</button>
				<button on:click={signUp}>Sign Up</button>
			{:else}
				<button on:click={() => login()}>Sign In</button>
				<button on:click={startSignUp}>Sign Up</button>
			{/if}
		</div>
	</form>
</div>

<style>
	.formLogin {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 1rem;
		padding-bottom: 1rem;
		border-radius: 10px;
		width: 60%;
	}

	hr {
		border-top: 1px solid #bbb;
		width: 100%;
	}

	.input {
		height: 3rem;
		border-radius: 8px;
		border: 0;
		padding-left: 1rem;
		padding-right: 0.4rem;
		margin-bottom: 1rem;
	}

	.input::placeholder {
		font-size: 16px;
	}

	h1 {
		text-align: center;
	}

	.wrapperPasswords {
		display: flex;
		width: calc(100% + 1.4rem);
		gap: 1rem;
	}

	.wrapperLogin {
		display: flex;
		justify-content: center;
	}

	.buttons {
		display: flex;
		gap: 1rem;
		width: 100%;
		justify-content: center;
	}
</style>
