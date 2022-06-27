<script>
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
</script>

<header>
	<Header />
</header>

<main>
	<slot></slot>
</main>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 90vw;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
