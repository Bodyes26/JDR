<script>
    export let onClose;
    import IoIosClose from "svelte-icons/io/IoIosClose.svelte";
</script>

<div class="btnCloseModal" on:click={onClose} on:keydown={onClose}>
    <IoIosClose />
</div>

<style>
    .btnCloseModal {
        position: absolute;
        top: 2rem;
        right: 2rem;
        z-index: 10;
        width: 32px;
        height: 32px;
    }

    div:hover {
        cursor: pointer;
    }
</style>
