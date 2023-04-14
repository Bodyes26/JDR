<script>
	import ModalManageEmotions from '../modalManageEmotions.svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { Input } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { Button, Modal, Label, Navbar, NavBrand, NavUl, NavHamburger } from 'flowbite-svelte';

	let name = $currentUser.name;
	let newName = undefined;
	let email = $currentUser.email;
	let newEmail = undefined;
	let password = undefined;
	let confirmPassword = undefined;
	let currentPassword = undefined;
	let showModal = false;
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

	onMount(() => {
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
</script>

<div class="w-full px-24">
	<Navbar let:hidden let:toggle class="dark:bg-neutral-950">
		<NavBrand>
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				Settings
			</span>
		</NavBrand>
		<NavHamburger on:click={toggle} />
		<div class="flex">
			<NavUl {hidden}>
				<Button href="/">Home</Button>
			</NavUl>
			<NavUl {hidden}>
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
			</NavUl>
		</div>
	</Navbar>

	<div class="mt-8 grid gap-6">
		<div>
			<Label for="name">Change name</Label>
			<Input
				type="text"
				id="name"
				name="name"
				placeholder={$currentUser.name}
				bind:value={newName}
			/>
		</div>
		<div>
			<Label for="email">Change email</Label>
			<Input
				type="email"
				id="email"
				name="email"
				placeholder={$currentUser.email}
				bind:value={newEmail}
			/>
		</div>
		<div>
			<Label for="password">Current password</Label>
			<Input
				type="password"
				id="currentPassword"
				name="currentPassword"
				placeholder="********"
				bind:value={currentPassword}
			/>
		</div>
		<div class="grid grid-cols-2 gap-2 w-full">
			<div class="flex flex-col">
				<Label for="password">New password</Label>
				<Input
					type="password"
					id="password"
					name="password"
					placeholder="••••••••"
					bind:value={password}
				/>
			</div>
			<div class="flex flex-col">
				<Label for="confirmPassword">Confirm password</Label>
				<Input
					type="password"
					id="confirmPassword"
					bind:value={confirmPassword}
					name="confirmPassword"
					placeholder="••••••••"
				/>
			</div>
		</div>
		<div>
			<Button color="light" on:click={update}>Update data</Button>
			<Button color="light" on:click={() => (showModal = true)}>Manage emotions</Button>
		</div>
		<div>
			<Button color="red" on:click={signOut}>Sign Out</Button>
		</div>
	</div>
</div>
<Modal
	title="Manage emotions"
	bind:open={showModal}
	autoclose={false}
	class="w-full dark:bg-neutral-900"
>
	<ModalManageEmotions />
</Modal>
