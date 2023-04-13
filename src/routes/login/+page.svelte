<script>
	import { currentUser, pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Input, Hr, Button } from 'flowbite-svelte';
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

<div class="w-full mt-24">
	<h1
		class="w-full text-center text-5xl text-blueGray-800 text-gray-900 dark:text-white dark:opacity-90"
	>
		Journaling done right
	</h1>
	<div class="flex justify-center">
		<form
			class="flex flex-col justify-center items-center py-4 gap-2 w-3/5"
			on:submit|preventDefault
			id="formSign"
		>
			{#if signup}
				<Input type="text" name="name" id="name" placeholder="Name" bind:value={name} />
			{/if}
			<Input type="email" name="email" id="email" placeholder="Email" bind:value={mail} />
			{#if signup}
				<div class="flex gap-4 w-full">
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
			<div class="flex gap-4 w-full justify-center">
				{#if signup}
					<Button color="alternative" type="reset" on:click={clear}>Clear</Button>
					<Button on:click={signUp}>Sign Up</Button>
				{:else}
					<Button on:click={() => login()}>Sign In</Button>
					<Button color="alternative" on:click={startSignUp}>Sign Up</Button>
				{/if}
			</div>
		</form>
	</div>
</div>
