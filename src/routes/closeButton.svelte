<script>
	export let onClose;
	import { CloseButton } from 'flowbite-svelte';
</script>

<div class=" absolute top-8 right-8 z-10">
	<CloseButton on:click={onClose} />
</div>
