<script>
	import ModalManageEmotions from '../modalManageEmotions.svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { Input } from 'flowbite-svelte';
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
</script>

<div class="w-full px-24">
	<Navbar let:hidden let:toggle>
		<NavBrand>
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				Settings
			</span>
		</NavBrand>
		<NavHamburger on:click={toggle} />
		<NavUl {hidden}>
			<Button href="/">Home</Button>
		</NavUl>
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
		<div class="wrapperPassword">
			<div class="columnPassword">
				<Label for="password">New password</Label>
				<Input
					type="password"
					id="password"
					name="password"
					placeholder="••••••••"
					bind:value={password}
				/>
			</div>
			<div class="columnPassword">
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
			<Button color="alternative" on:click={update}>Update data</Button>
			<Button color="alternative" on:click={() => (showModal = true)}>Manage emotions</Button>
		</div>
		<div>
			<Button color="red" on:click={signOut}>Sign Out</Button>
		</div>
	</div>
</div>
<Modal title="Manage emotions" bind:open={showModal} autoclose={false} class="w-full">
	<ModalManageEmotions />
</Modal>

<style>
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
</style>
