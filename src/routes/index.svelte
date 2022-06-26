<script context="module">
	export const prerender = true;
</script>

<svelte:head>
	<title>acasa</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<a sveltekit:prefetch href="/produse">produse</a>

</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

</style>
