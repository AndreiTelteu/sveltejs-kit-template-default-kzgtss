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

<div style="display: flex; flex-direction: row; align-items: center; width: 100%;">
	<div style="width: 400px;">
		{#if produs.thumbnail}
			<img src={produs.thumbnail} alt=" " style="width: 100%;  object-fit: contain;" />
		{/if}
	</div>
	<div style="flex: 1; text-align: center;">
		<h1>{ produs.title }</h1>
		<h1>${ produs.price }</h1>
		<button type="button" on:click={() => cart.add(produs)}>
			add to cart
		</button>
	</div>
</div>

<h3>
	category: { produs.category }
</h3>
<div>
	{ produs.description }
</div>
