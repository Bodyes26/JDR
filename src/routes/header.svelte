<script>
	import { currentUser } from '$lib/pocketbase';
	import { Button, Navbar, NavBrand, NavUl, NavHamburger } from 'flowbite-svelte';
</script>

<div class="w-full px-24">
	<Navbar let:hidden let:toggle>
		<NavBrand>
			<div class="flex gap-4 items-center">
				<h1 class="self-center whitespace-nowrap font-semibold dark:text-white">JDR</h1>
				<p>Greetings, {$currentUser.name}!</p>
			</div>
		</NavBrand>
		<NavHamburger on:click={toggle} />
		<NavUl {hidden}>
			<Button href="/settings">Settings</Button>
		</NavUl>
	</Navbar>
</div>

<style>
</style>
