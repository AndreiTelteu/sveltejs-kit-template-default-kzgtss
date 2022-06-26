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

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
