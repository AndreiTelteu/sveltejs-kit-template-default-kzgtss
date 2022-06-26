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
	export let produs;
</script>

<h1>
	{ produs.title }
</h1>
<h3>
	price { produs.price } <br />
	category { produs.category }
</h3>
<div>
	{ produs.description }
</div>
