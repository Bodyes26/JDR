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
		var themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
		var themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

		// Change the icons inside the button based on previous settings
		if (
			localStorage.getItem('color-theme') === 'dark' ||
			(!('color-theme' in localStorage) &&
				window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			themeToggleLightIcon.classList.remove('hidden');
		} else {
			themeToggleDarkIcon.classList.remove('hidden');
		}

		var themeToggleBtn = document.getElementById('theme-toggle');

		themeToggleBtn.addEventListener('click', function () {
			// toggle icons inside button
			themeToggleDarkIcon.classList.toggle('hidden');
			themeToggleLightIcon.classList.toggle('hidden');

			// if set via local storage previously
			if (localStorage.getItem('color-theme')) {
				if (localStorage.getItem('color-theme') === 'light') {
					document.documentElement.classList.add('dark');
					localStorage.setItem('color-theme', 'dark');
				} else {
					document.documentElement.classList.remove('dark');
					localStorage.setItem('color-theme', 'light');
				}

				// if NOT set via local storage previously
			} else {
				if (document.documentElement.classList.contains('dark')) {
					document.documentElement.classList.remove('dark');
					localStorage.setItem('color-theme', 'light');
				} else {
					document.documentElement.classList.add('dark');
					localStorage.setItem('color-theme', 'dark');
				}
			}
		});
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

	function checkEnter(e) {
		if (e.keyCode === 13) {
			if (signup) {
				signUp();
			} else {
				login();
			}
		}
	}
</script>

<div class="absolute top-8 right-8">
	<button
		id="theme-toggle"
		type="button"
		class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
	>
		<svg
			id="theme-toggle-dark-icon"
			class="hidden w-5 h-5"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg
		>
		<svg
			id="theme-toggle-light-icon"
			class="hidden w-5 h-5"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			><path
				d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
				fill-rule="evenodd"
				clip-rule="evenodd"
			/></svg
		>
	</button>
</div>
<div class="w-full mt-24">
	<h1 class="w-full text-center text-5xl text-blueGray-800 dark:text-white">
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
						on:keypress={checkEnter}
					/>
				</div>
			{:else}
				<Input
					type="password"
					name="password"
					id="password"
					placeholder="Password"
					bind:value={password}
					on:keypress={checkEnter}
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
