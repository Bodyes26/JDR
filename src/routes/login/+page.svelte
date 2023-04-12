<script>
	import { currentUser, pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import { Hr } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { Input } from 'flowbite-svelte';
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

<div id="bigBoxLogin">
	<h1>Journaling done right</h1>
	<div class="wrapperLogin">
		<form class="formLogin" on:submit|preventDefault id="formSign">
			{#if signup}
				<Input type="text" name="name" id="name" placeholder="Name" bind:value={name} />
			{/if}
			<Input type="email" name="email" id="email" placeholder="Email" bind:value={mail} />
			{#if signup}
				<div class="wrapperPasswords">
					<Input
						type="password"
						name="password"
						id="password"
						placeholder="Password"
						bind:value={password}
					/>
					<Input
						type="password"
						name="confirmPassword"
						id="confirmPassword"
						placeholder="confirm password"
						bind:value={confirmPassword}
					/>
				</div>
			{:else}
				<Input
					type="password"
					name="password"
					id="password"
					placeholder="Password"
					bind:value={password}
				/>
			{/if}
			<Hr class="my-8" height="h-px" />
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
		gap: 0.5rem;
	}

	h1 {
		text-align: center;
		width: 100%;
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

	#bigBoxLogin {
		width: 100%;
		margin-top: 4rem;
	}
</style>
