<script>
	import { currentUser } from '$lib/pocketbase';
	import { Button, Navbar, NavBrand, NavUl, NavHamburger } from 'flowbite-svelte';
	import { onMount } from 'svelte';

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
		<NavBrand class="hover:cursor-default">
			<div class="flex gap-4 items-center">
				<h1
					class="self-center whitespace-nowrap font-semibold text-5xl text-blueGray-800 dark:text-white"
				>
					JDR
				</h1>
				<p class="text-black dark:text-white hover:cursor-default">
					Greetings, {$currentUser.name}!
				</p>
			</div>
		</NavBrand>
		<NavHamburger on:click={toggle} />
		<div class="flex">
			<NavUl {hidden}>
				<Button color="alternative" href="/settings" class="dark:text-white"
					><svg
						width="24px"
						height="24px"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M13.9794 2.97636C12.7523 2.27761 11.2477 2.27761 10.0207 2.97636L7.59467 4.35783L7.59463 4.35776L7.58436 4.36378L5.17499 5.77401C3.95632 6.48731 3.20403 7.79031 3.19563 9.20235L3.17903 11.994L3.17896 11.994L3.17903 12.0059L3.19563 14.7976C3.20403 16.2097 3.95632 17.5127 5.17499 18.226L7.58436 19.6362L7.58433 19.6363L7.59467 19.6422L10.0207 21.0236C11.2477 21.7224 12.7523 21.7224 13.9794 21.0236L16.4053 19.6422L16.4054 19.6422L16.4157 19.6362L18.825 18.226C20.0437 17.5127 20.796 16.2097 20.8044 14.7976L20.821 12.0059H20.8211L20.821 11.994L20.8044 9.20235C20.796 7.7903 20.0437 6.4873 18.825 5.77401L16.4157 4.36378L16.4157 4.36371L16.4053 4.35783L13.9794 2.97636ZM11.0103 4.71433C11.6239 4.36496 12.3762 4.36496 12.9897 4.71433L15.4105 6.09285L17.8147 7.50008C18.4241 7.85673 18.8002 8.50823 18.8044 9.21425L18.821 12L18.8044 14.7857C18.8002 15.4918 18.4241 16.1433 17.8147 16.4999L15.4105 17.9072L12.9897 19.2857C12.3762 19.635 11.6239 19.635 11.0103 19.2857L8.58952 17.9071L6.18528 16.4999C5.57594 16.1433 5.1998 15.4918 5.1956 14.7857L5.17903 12L5.1956 9.21425C5.1998 8.50823 5.57594 7.85673 6.18528 7.50008L8.5895 6.09286L11.0103 4.71433ZM11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12ZM12 9C10.3432 9 9.00001 10.3431 9.00001 12C9.00001 13.6568 10.3432 15 12 15C13.6569 15 15 13.6568 15 12C15 10.3431 13.6569 9 12 9Z"
							fill="#000000"
							class="dark:fill-white"
						/>
					</svg>Settings</Button
				>
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
</div>
