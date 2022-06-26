<script context="module">
	import { browser, dev } from '$app/env';
	import axios from 'axios'
	export const hydrate = true;
	export const router = true;
	export const prerender = false;

	export async function load({ params }) {
		const { id } = params;
		let produs = [];
		let { data } = await axios.get(`https://dummyjson.com/products/${id}`);
		produs = data;
		return {
			props: { produs },
		};
	}
</script>

<script>
	import cart from '$lib/cart';
	export let produs;
</script>

<svelte:head>
    <title>{produs.title}</title>
    <meta name="description" content="{produs.description}" />
</svelte:head>

<h1>
	{ produs.title }
</h1>
<div>
	<button type="button" on:click={() => cart.add(produs)}>
		add to cart
	</button>
</div>
<h3>
	price { produs.price } <br />
	category { produs.category }
</h3>
<div>
	{ produs.description }
</div>
