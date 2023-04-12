<script>
	export let onClose;
	import { CloseButton } from 'flowbite-svelte';
</script>

<div class="btnCloseModal">
	<CloseButton on:click={onClose} />
</div>

<style>
	.btnCloseModal {
		position: absolute;
		top: 2rem;
		right: 2rem;
		z-index: 10;
	}
</style>
