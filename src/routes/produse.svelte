<script context="module">
	import { browser, dev } from '$app/env';
	import axios from 'axios'
	export const hydrate = dev;
	export const router = browser;
	export const prerender = false;

	export async function load({ params }) {
		let produse = [];
		let { data } = await axios.get("https://fakestoreapi.com/products");
		produse = data;
		return {
			props: { produse }
		};
	}
</script>
<script>
export let produse;
</script>

<svelte:head>
	<title>produse</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="content">
	<h1>lista</h1>

	<ul>
	{#each produse as produs}
	<li>
	<a href="/produs/{produs.id}">{produs.title}</a>
	</li>
	{/each}
	</ul>
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
