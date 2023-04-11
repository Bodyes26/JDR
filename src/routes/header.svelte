<script>
	import { goto } from '$app/navigation';
</script>

<div id="header">
	<h1>JDR</h1>
	<button
		on:click={() => {
			goto('/settings');
		}}>Settings</button
	>
</div>

<style>
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
